export type PlaceSource = "nearby" | "partner" | "chain";

export type Place = {
  id: string;
  name: string;
  lat: number | null;
  lon: number | null;
  distanceMiles: number | null;
  cuisineTags: string[];
  address: string | null;
  phone: string | null;
  website: string | null;
  source: PlaceSource;
  blurb?: string;
  featured?: boolean;
  rating?: number | null;
  ratingCount?: number | null;
  priceLevel?: number | null;
  openNow?: boolean | null;
  hours?: string | null;
};

export type PlaceBookmark = {
  placeId: string;
  name: string;
  city: string;
  address: string | null;
  cuisine: string | null;
  lat: number | null;
  lon: number | null;
  website: string | null;
  phone: string | null;
};

export type GeoLocation = {
  lat: number;
  lon: number;
  label: string;
};

export type GeocodeHit = {
  label: string;
  lat: number;
  lon: number;
};

export type SearchPlacesResult = {
  nearby: Place[];
  source: "overpass" | "fallback" | "google" | "yelp";
};
