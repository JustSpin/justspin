import { createServerFn } from "@tanstack/react-start";
import { cuisineById, sanitizeOsm } from "./cuisines";
import { haversineMiles, milesToMeters, MILES_MAX, MILES_MIN } from "./geo";
import { compactHours, isOpenAt, localClock, looksPermanentlyClosed } from "./hours";
import { namesClose, rankPlaces, searchRatedPlaces } from "./live-places";
import type { Clock } from "./hours";
import type { GeocodeHit, Place, SearchPlacesResult } from "./types";

const NOMINATIM = "https://nominatim.openstreetmap.org";
const OVERPASS_HOSTS = [
  "https://overpass.openstreetmap.fr/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];
const UA = "JustSpin/1.0 (dinner discovery; https://justspin.app)";

type OsmEl = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

export const geocodeCity = createServerFn({ method: "POST" })
  .validator((input: { query: string }) => input)
  .handler(async ({ data }): Promise<GeocodeHit[]> => {
    const q = data.query.trim();
    if (q.length < 2) return [];
    const url = `${NOMINATIM}/search?format=jsonv2&limit=6&addressdetails=1&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": UA },
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{
      display_name: string;
      lat: string;
      lon: string;
      name?: string;
      address?: Record<string, string>;
    }>;
    return rows.map((r) => ({
      label: shortLabel(r),
      lat: Number(r.lat),
      lon: Number(r.lon),
    }));
  });

export const reverseGeocode = createServerFn({ method: "POST" })
  .validator((input: { lat: number; lon: number }) => input)
  .handler(async ({ data }): Promise<GeocodeHit | null> => {
    const url = `${NOMINATIM}/reverse?format=jsonv2&lat=${data.lat}&lon=${data.lon}&zoom=12`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": UA },
    });
    if (!res.ok) return null;
    const r = (await res.json()) as {
      display_name?: string;
      name?: string;
      address?: Record<string, string>;
      lat?: string;
      lon?: string;
    };
    return {
      label: shortLabel(r),
      lat: data.lat,
      lon: data.lon,
    };
  });

export const searchPlaces = createServerFn({ method: "POST" })
  .validator(
    (input: {
      lat: number;
      lon: number;
      cuisineId: string;
      osm?: string;
      radiusMeters: number;
      timeZone?: string;
    }) => input,
  )
  .handler(async ({ data }): Promise<SearchPlacesResult> => {
    const cuisine = cuisineById(data.cuisineId);
    const osm = sanitizeOsm(data.osm ?? "") || cuisine?.osm;
    if (!osm) return { nearby: [], source: "fallback" };
    const radius = Math.min(
      Math.max(data.radiusMeters, milesToMeters(MILES_MIN)),
      milesToMeters(MILES_MAX),
    );
    const live = await searchRatedPlaces({
      lat: data.lat,
      lon: data.lon,
      radiusMeters: radius,
      query: cuisine?.search || cuisine?.label || data.cuisineId,
      cuisineId: data.cuisineId,
    });
    if (live?.places.length) {
      return { nearby: live.places, source: live.source };
    }
    const clock = localClock(data.timeZone?.slice(0, 80) || null);
    const nearby = await queryOverpass(data.lat, data.lon, osm, radius, clock);
    return { nearby, source: nearby.length ? "overpass" : "fallback" };
  });

type RatingHit = { name: string; rating: number; reviews: number | null };
const ratingCache = new Map<string, { at: number; hits: RatingHit[] }>();
const RATING_CACHE_MS = 6 * 60 * 60 * 1000;

export const fillRatings = createServerFn({ method: "POST" })
  .validator((input: { city: string; names: string[] }) => input)
  .handler(async ({ data }): Promise<RatingHit[]> => {
    const city = data.city.trim().slice(0, 80);
    const names = [...new Set(data.names.map((n) => n.trim()).filter(Boolean))].slice(0, 10);
    if (!city || names.length === 0) return [];
    const cacheKey = `${city.toLowerCase()}|${names.map((n) => n.toLowerCase()).sort().join("|")}`;
    const cached = ratingCache.get(cacheKey);
    if (cached && Date.now() - cached.at < RATING_CACHE_MS) return cached.hits;
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return [];
    try {
      const res = await fetch("https://api.x.ai/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-3-mini",
          max_output_tokens: 400,
          tools: [{ type: "web_search" }],
          input: `Return JSON only, no markdown. Look up current Google Maps or Yelp star ratings for these restaurants in ${city}:
${names.join("; ")}
Prefer the Google Maps rating when both exist (usually more reviews).
Format: [{"name":"exact name","rating":4.3,"reviews":210}]
Use only numbers you find on Google Maps or Yelp. Omit a place if you cannot find a rating. Never guess or invent a star number.`,
        }),
        signal: AbortSignal.timeout(14000),
      });
      if (!res.ok) return [];
      const body = (await res.json()) as {
        output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
      };
      const text = (body.output ?? [])
        .filter((o) => o.type === "message")
        .flatMap((o) => o.content ?? [])
        .filter((c) => c.type === "output_text")
        .map((c) => c.text ?? "")
        .join("\n");
      const hits = parseRatingHits(text, names);
      ratingCache.set(cacheKey, { at: Date.now(), hits });
      return hits;
    } catch {
      return [];
    }
  });

function parseRatingHits(text: string, names: string[]): RatingHit[] {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start < 0 || end <= start) return [];
  let rows: unknown;
  try {
    rows = JSON.parse(text.slice(start, end + 1));
  } catch {
    return [];
  }
  if (!Array.isArray(rows)) return [];
  const used = new Set<string>();
  const out: RatingHit[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const rec = row as { name?: unknown; rating?: unknown; reviews?: unknown };
    if (typeof rec.name !== "string") continue;
    const rating = typeof rec.rating === "number" ? rec.rating : Number(rec.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) continue;
    const match = names.find((n) => !used.has(n) && namesClose(n, rec.name));
    if (!match) continue;
    used.add(match);
    const reviewsRaw =
      typeof rec.reviews === "number" ? rec.reviews : Number(String(rec.reviews ?? "").replace(/[^\d]/g, ""));
    out.push({
      name: match,
      rating: Math.round(rating * 10) / 10,
      reviews: Number.isFinite(reviewsRaw) && reviewsRaw > 0 ? Math.round(reviewsRaw) : null,
    });
  }
  return out;
}

export const askBite = createServerFn({ method: "POST" })
  .validator((input: { cuisine: string; city: string; names: string[] }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Just Ask is not available yet." };
    const hour = new Date().getHours();
    const moment =
      hour < 11 ? "late breakfast" : hour < 15 ? "lunch" : hour < 17 ? "a late lunch" : "dinner";
    const list = data.names.slice(0, 8).join("; ");
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 140,
        messages: [
          {
            role: "system",
            content:
              "You are Just, a terse dinner concierge for JustSpin. Pick ONE restaurant from the list and one dish. Two short sentences, no markdown, no preamble.",
          },
          {
            role: "user",
            content: `It is ${moment} in ${data.city || "town"}. Cuisine: ${data.cuisine}. Open, in-business places with ratings when we have them: ${list || "delivery chains"}. Prefer higher ratings. Skip anything that sounds closed.`,
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: "Just Ask is busy. Spin again in a moment." };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "Just Ask had nothing to add." };
    return { ok: true as const, text };
  });

function shortLabel(r: {
  display_name?: string;
  name?: string;
  address?: Record<string, string>;
}): string {
  const a = r.address ?? {};
  const city = a.city || a.town || a.village || a.hamlet || r.name;
  const region = a.state || a.region;
  if (city && region) return `${city}, ${region}`;
  if (city) return city;
  return (r.display_name ?? "Pinned location").split(",").slice(0, 2).join(",").trim();
}

async function queryOverpass(
  lat: number,
  lon: number,
  osm: string,
  radius: number,
  clock: Clock,
): Promise<Place[]> {
  const ql = `[out:json][timeout:25];
(
  nwr["amenity"~"restaurant|fast_food|cafe|food_court"]["cuisine"~"${osm}",i]["name"]["disused"!="yes"]["abandoned"!="yes"]["closed"!="yes"]["opening_hours"!="closed"]["opening_hours"!="off"]["disused:amenity"!~"."]["abandoned:amenity"!~"."]["was:amenity"!~"."](around:${radius},${lat},${lon});
);
out tags center meta 40;`;

  for (const host of OVERPASS_HOSTS) {
    try {
      const res = await fetch(host, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent": UA,
        },
        body: `data=${encodeURIComponent(ql)}`,
        signal: AbortSignal.timeout(28000),
      });
      if (!res.ok) continue;
      const json = (await res.json()) as { elements?: OsmEl[] };
      const places = (json.elements ?? [])
        .map((el) => toPlace(el, lat, lon, clock))
        .filter((p): p is Place => Boolean(p));
      const deduped = rankPlaces(dedupePlaces(places));
      if (deduped.length) return deduped;
    } catch {
      // try next host
    }
  }
  return [];
}

function toPlace(el: OsmEl, originLat: number, originLon: number, clock: Clock): Place | null {
  const tags = el.tags ?? {};
  const name = tags.name || tags["name:en"];
  if (!name) return null;
  if (isOsmClosed(tags, name)) return null;
  const lat = el.lat ?? el.center?.lat ?? null;
  const lon = el.lon ?? el.center?.lon ?? null;
  const distanceMiles =
    lat != null && lon != null ? haversineMiles({ lat: originLat, lon: originLon }, { lat, lon }) : null;
  const cuisineTags = (tags.cuisine ?? "")
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const address = [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"]]
    .filter(Boolean)
    .join(" ");
  const rated = osmRating(tags);
  const hours = tags.opening_hours && tags.opening_hours !== "closed" ? tags.opening_hours : null;
  return {
    id: `osm-${el.type}-${el.id}`,
    name,
    lat,
    lon,
    distanceMiles,
    cuisineTags,
    address: address || null,
    phone: tags.phone || tags["contact:phone"] || null,
    website: tags.website || tags["contact:website"] || null,
    source: "nearby",
    rating: rated.rating,
    ratingCount: rated.count,
    hours: compactHours(hours) ?? hours,
    openNow: hours ? isOpenAt(hours, clock) : null,
  };
}

function isOsmClosed(tags: Record<string, string>, name: string): boolean {
  if (tags.opening_hours === "closed" || tags.opening_hours === "off") return true;
  if (tags.disused === "yes" || tags.abandoned === "yes" || tags.closed === "yes") return true;
  if (tags.access === "no") return true;
  if (tags["disused:amenity"] || tags["abandoned:amenity"] || tags["was:amenity"]) return true;
  if (tags.end_date) return true;
  return looksPermanentlyClosed(name, tags.description, tags.note, tags.fixme, tags.opening_hours);
}

function osmRating(tags: Record<string, string>): { rating: number | null; count: number | null } {
  const raw = tags.stars || tags.rating || tags["rating:google"] || tags["stars:tripadvisor"];
  const n = raw ? Number(String(raw).replace(/[^0-9.]/g, "")) : NaN;
  const rating = Number.isFinite(n) && n > 0 && n <= 5 ? n : null;
  const countRaw = tags["rating:count"] || tags.votes;
  const count = countRaw ? Number(countRaw) : null;
  return { rating, count: count && Number.isFinite(count) ? count : null };
}

function dedupePlaces(places: Place[]): Place[] {
  const seen = new Set<string>();
  const out: Place[] = [];
  for (const p of places) {
    const key = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}
