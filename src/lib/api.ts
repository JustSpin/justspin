import { createServerFn } from "@tanstack/react-start";
import { cuisineById, sanitizeOsm } from "./cuisines";
import { haversineMiles, milesToMeters, MILES_MAX, MILES_MIN } from "./geo";
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
  .validator((input: { lat: number; lon: number; cuisineId: string; osm?: string; radiusMeters: number }) => input)
  .handler(async ({ data }): Promise<SearchPlacesResult> => {
    const cuisine = cuisineById(data.cuisineId);
    const osm = sanitizeOsm(data.osm ?? "") || cuisine?.osm;
    if (!osm) return { nearby: [], source: "fallback" };
    const radius = Math.min(
      Math.max(data.radiusMeters, milesToMeters(MILES_MIN)),
      milesToMeters(MILES_MAX),
    );
    const nearby = await queryOverpass(data.lat, data.lon, osm, radius);
    return { nearby, source: nearby.length ? "overpass" : "fallback" };
  });

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
            content: `It is ${moment} in ${data.city || "town"}. Cuisine: ${data.cuisine}. Places: ${list || "delivery chains"}.`,
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
): Promise<Place[]> {
  const ql = `[out:json][timeout:25];
(
  nwr["amenity"~"restaurant|fast_food|cafe|food_court"]["cuisine"~"${osm}",i](around:${radius},${lat},${lon});
);
out tags center 30;`;

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
        .map((el) => toPlace(el, lat, lon))
        .filter((p): p is Place => Boolean(p));
      const deduped = dedupePlaces(places);
      deduped.sort((a, b) => (a.distanceMiles ?? 99) - (b.distanceMiles ?? 99));
      if (deduped.length) return deduped.slice(0, 14);
    } catch {
      // try next host
    }
  }
  return [];
}

function toPlace(el: OsmEl, originLat: number, originLon: number): Place | null {
  const tags = el.tags ?? {};
  const name = tags.name || tags["name:en"];
  if (!name) return null;
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
  };
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
