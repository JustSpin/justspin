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
