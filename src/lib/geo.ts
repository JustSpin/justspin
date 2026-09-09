export function haversineMiles(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 3958.8;
  const dLat = deg(b.lat - a.lat);
  const dLon = deg(b.lon - a.lon);
  const lat1 = deg(a.lat);
  const lat2 = deg(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function deg(n: number) {
  return (n * Math.PI) / 180;
}

export function formatMiles(n: number | null, unit = "mi"): string {
  if (n == null || Number.isNaN(n)) return "";
  if (n < 0.1) return `< 0.1 ${unit}`;
  if (n < 10) return `${n.toFixed(1)} ${unit}`;
  return `${Math.round(n)} ${unit}`;
}

export const MILES_MIN = 1;
export const MILES_MAX = 100;
export const METERS_PER_MILE = 1609.34;

export function clampMiles(n: number): number {
  if (!Number.isFinite(n)) return 5;
  return Math.min(MILES_MAX, Math.max(MILES_MIN, Math.round(n)));
}

export function milesToMeters(miles: number): number {
  return Math.round(clampMiles(miles) * METERS_PER_MILE);
}

export function metersToMiles(meters: number): number {
  return clampMiles(meters / METERS_PER_MILE);
}

export type BBox = {
  south: number;
  north: number;
  west: number;
  east: number;
};

export function parseNominatimBox(raw?: Array<string | number> | null): BBox | null {
  if (!raw || raw.length < 4) return null;
  const south = Number(raw[0]);
  const north = Number(raw[1]);
  const west = Number(raw[2]);
  const east = Number(raw[3]);
  if (![south, north, west, east].every(Number.isFinite)) return null;
  if (south >= north) return null;
  return { south, north, west, east };
}

export function inBBox(lat: number, lon: number, box: BBox, padDeg = 0.008): boolean {
  return (
    lat >= box.south - padDeg &&
    lat <= box.north + padDeg &&
    lon >= box.west - padDeg &&
    lon <= box.east + padDeg
  );
}

export function cityKey(label: string): string {
  return (label.split(",")[0] ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function mentionsCity(text: string | null | undefined, city: string): boolean | null {
  if (!text) return null;
  const key = cityKey(city);
  if (key.length < 3) return null;
  const hay = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (hay.includes(key)) return true;
  const compact = (s: string) => s.replace(/ /g, "");
  if (compact(hay).includes(compact(key))) return true;
  return false;
}

export type SearchArea = {
  radiusMiles: number;
  city: string;
  bbox: BBox | null;
};

export function withinSearch(
  place: {
    lat: number | null;
    lon: number | null;
    distanceMiles: number | null;
    address?: string | null;
    name?: string;
  },
  area: SearchArea,
): boolean {
  if (place.lat == null || place.lon == null || place.distanceMiles == null) return false;
  if (place.distanceMiles > area.radiusMiles + 0.05) return false;
  if (area.bbox && !inBBox(place.lat, place.lon, area.bbox)) return false;
  if (!area.bbox) {
    const named = mentionsCity(place.address, area.city) ?? mentionsCity(place.name, area.city);
    if (named === false) return false;
  }
  return true;
}
