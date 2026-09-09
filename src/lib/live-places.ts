import { haversineMiles, METERS_PER_MILE } from "./geo";
import { looksPermanentlyClosed } from "./hours";
import type { Place } from "./types";

function googleKey() {
  return (
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    ""
  ).trim();
}

function yelpKey() {
  return (process.env.YELP_API_KEY || process.env.YELP_FUSION_API_KEY || "").trim();
}

const PRICE: Record<string, number> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

export async function searchRatedPlaces(input: {
  lat: number;
  lon: number;
  radiusMeters: number;
  query: string;
  cuisineId: string;
}): Promise<{ places: Place[]; source: "google" | "yelp" } | null> {
  const g = googleKey();
  if (g) {
    const places = await googleNearby(input, g);
    if (places.length) return { places, source: "google" };
  }
  const y = yelpKey();
  if (y) {
    const places = await yelpNearby(input, y);
    if (places.length) return { places, source: "yelp" };
  }
  return null;
}

async function googleNearby(
  input: { lat: number; lon: number; radiusMeters: number; query: string },
  key: string,
): Promise<Place[]> {
  const fromNew = await googleNearbyNew(input, key);
  if (fromNew.length) return fromNew;
  return googleNearbyLegacy(input, key);
}

async function googleNearbyNew(
  input: { lat: number; lon: number; radiusMeters: number; query: string },
  key: string,
): Promise<Place[]> {
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.businessStatus,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.priceLevel,places.currentOpeningHours,places.types,places.primaryTypeDisplayName",
      },
      body: JSON.stringify({
        textQuery: `${input.query} restaurant`,
        locationBias: {
          circle: {
            center: { latitude: input.lat, longitude: input.lon },
            radius: input.radiusMeters,
          },
        },
        maxResultCount: 20,
      }),
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      places?: Array<{
        id?: string;
        displayName?: { text?: string };
        formattedAddress?: string;
        location?: { latitude?: number; longitude?: number };
        rating?: number;
        userRatingCount?: number;
        businessStatus?: string;
        nationalPhoneNumber?: string;
        internationalPhoneNumber?: string;
        websiteUri?: string;
        priceLevel?: string;
        currentOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
        primaryTypeDisplayName?: { text?: string };
        types?: string[];
      }>;
    };
    const out: Place[] = [];
    const maxMiles = input.radiusMeters / METERS_PER_MILE + 0.6;
    for (const p of json.places ?? []) {
      if (p.businessStatus && p.businessStatus !== "OPERATIONAL") continue;
      const name = p.displayName?.text?.trim();
      if (!name || looksPermanentlyClosed(name)) continue;
      if (!isFoodPlace(p.types)) continue;
      const lat = p.location?.latitude ?? null;
      const lon = p.location?.longitude ?? null;
      const distanceMiles =
        lat != null && lon != null
          ? haversineMiles({ lat: input.lat, lon: input.lon }, { lat, lon })
          : null;
      if (distanceMiles != null && distanceMiles > maxMiles) continue;
      const rating = typeof p.rating === "number" && p.rating > 0 ? p.rating : null;
      out.push({
        id: `ggl-${p.id || slug(name)}`,
        name,
        lat,
        lon,
        distanceMiles,
        cuisineTags: [p.primaryTypeDisplayName?.text].filter(Boolean) as string[],
        address: p.formattedAddress ?? null,
        phone: p.nationalPhoneNumber || p.internationalPhoneNumber || null,
        website: p.websiteUri ?? null,
        source: "nearby",
        rating,
        ratingCount: p.userRatingCount ?? null,
        priceLevel: p.priceLevel ? (PRICE[p.priceLevel] ?? null) : null,
        openNow: p.currentOpeningHours?.openNow ?? null,
        hours: p.currentOpeningHours?.weekdayDescriptions?.[0] ?? null,
      });
    }
    return rankPlaces(out);
  } catch {
    return [];
  }
}

async function googleNearbyLegacy(
  input: { lat: number; lon: number; radiusMeters: number; query: string },
  key: string,
): Promise<Place[]> {
  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
    url.searchParams.set("location", `${input.lat},${input.lon}`);
    url.searchParams.set("radius", String(Math.min(input.radiusMeters, 50000)));
    url.searchParams.set("keyword", input.query);
    url.searchParams.set("type", "restaurant");
    url.searchParams.set("key", key);
    const res = await fetch(url, { signal: AbortSignal.timeout(9000) });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      results?: Array<{
        place_id?: string;
        name?: string;
        vicinity?: string;
        formatted_address?: string;
        geometry?: { location?: { lat?: number; lng?: number } };
        rating?: number;
        user_ratings_total?: number;
        business_status?: string;
        opening_hours?: { open_now?: boolean };
        price_level?: number;
        types?: string[];
      }>;
    };
    const out: Place[] = [];
    const maxMiles = input.radiusMeters / METERS_PER_MILE + 0.6;
    for (const p of json.results ?? []) {
      if (p.business_status && p.business_status !== "OPERATIONAL") continue;
      const name = p.name?.trim();
      if (!name || looksPermanentlyClosed(name)) continue;
      if (!isFoodPlace(p.types)) continue;
      const lat = p.geometry?.location?.lat ?? null;
      const lon = p.geometry?.location?.lng ?? null;
      const distanceMiles =
        lat != null && lon != null
          ? haversineMiles({ lat: input.lat, lon: input.lon }, { lat, lon })
          : null;
      if (distanceMiles != null && distanceMiles > maxMiles) continue;
      out.push({
        id: `ggl-${p.place_id || slug(name)}`,
        name,
        lat,
        lon,
        distanceMiles,
        cuisineTags: (p.types ?? [])
          .filter((t) => t !== "restaurant" && t !== "food" && t !== "point_of_interest")
          .slice(0, 2),
        address: p.vicinity || p.formatted_address || null,
        phone: null,
        website: null,
        source: "nearby",
        rating: typeof p.rating === "number" && p.rating > 0 ? p.rating : null,
        ratingCount: p.user_ratings_total ?? null,
        priceLevel: p.price_level ?? null,
        openNow: p.opening_hours?.open_now ?? null,
      });
    }
    return rankPlaces(out);
  } catch {
    return [];
  }
}

async function yelpNearby(
  input: { lat: number; lon: number; radiusMeters: number; query: string; cuisineId: string },
  key: string,
): Promise<Place[]> {
  try {
    const url = new URL("https://api.yelp.com/v3/businesses/search");
    url.searchParams.set("latitude", String(input.lat));
    url.searchParams.set("longitude", String(input.lon));
    url.searchParams.set("radius", String(Math.min(input.radiusMeters, 40000)));
    url.searchParams.set("term", `${input.query} restaurant`);
    url.searchParams.set("categories", "restaurants");
    url.searchParams.set("limit", "20");
    url.searchParams.set("sort_by", "rating");
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      businesses?: Array<{
        id?: string;
        name?: string;
        is_closed?: boolean;
        rating?: number;
        review_count?: number;
        price?: string;
        phone?: string;
        url?: string;
        coordinates?: { latitude?: number; longitude?: number };
        location?: { address1?: string; city?: string };
        categories?: Array<{ title?: string }>;
      }>;
    };
    const out: Place[] = [];
    const maxMiles = input.radiusMeters / METERS_PER_MILE + 0.6;
    for (const p of json.businesses ?? []) {
      if (p.is_closed) continue;
      const name = p.name?.trim();
      if (!name || looksPermanentlyClosed(name)) continue;
      const lat = p.coordinates?.latitude ?? null;
      const lon = p.coordinates?.longitude ?? null;
      const distanceMiles =
        lat != null && lon != null
          ? haversineMiles({ lat: input.lat, lon: input.lon }, { lat, lon })
          : null;
      if (distanceMiles != null && distanceMiles > maxMiles) continue;
      out.push({
        id: `yelp-${p.id || slug(name)}`,
        name,
        lat,
        lon,
        distanceMiles,
        cuisineTags: (p.categories ?? []).map((c) => c.title).filter(Boolean).slice(0, 3) as string[],
        address: [p.location?.address1, p.location?.city].filter(Boolean).join(", ") || null,
        phone: p.phone || null,
        website: p.url || null,
        source: "nearby",
        rating: typeof p.rating === "number" && p.rating > 0 ? p.rating : null,
        ratingCount: p.review_count ?? null,
        priceLevel: p.price ? p.price.length : null,
      });
    }
    return rankPlaces(out);
  } catch {
    return [];
  }
}

export function rankPlaces(places: Place[]): Place[] {
  return [...places].sort((a, b) => placeScore(b) - placeScore(a)).slice(0, 14);
}

export function placeScore(p: Place): number {
  const rating = p.rating ?? 0;
  const reviews = Math.log10((p.ratingCount ?? 0) + 1);
  const miles = p.distanceMiles ?? 12;
  const open = p.openNow === true ? 0.35 : p.openNow === false ? -0.5 : 0;
  const alive = (p.website ? 0.18 : 0) + (p.phone ? 0.1 : 0) + (p.hours ? 0.12 : 0);
  return rating * 2.2 + reviews - miles * 0.12 + open + alive;
}

function isFoodPlace(types?: string[]): boolean {
  if (!types?.length) return true;
  return /restaurant|food|cafe|bar|bakery|meal|pizza|sushi|steak|diner|bistro|pub|night_club|ice_cream|sandwich|coffee|tea|dessert|brunch|noodle|taco/i.test(
    types.join(" "),
  );
}

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
}
