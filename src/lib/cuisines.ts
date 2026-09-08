export type Cuisine = {
  id: string;
  label: string;
  kicker: string;
  osm: string;
  search: string;
};

export type WheelSlice = Cuisine & {
  weight: number;
  custom?: boolean;
};

export const CUISINES: Cuisine[] = [
  { id: "mexican", label: "Tacos", kicker: "Mexican", osm: "mexican|tex-mex|taco|latin", search: "mexican tacos" },
  { id: "pizza", label: "Pizza", kicker: "Slices", osm: "pizza", search: "pizza" },
  { id: "burger", label: "Burgers", kicker: "Grilled", osm: "burger|american", search: "burgers" },
  { id: "sushi", label: "Sushi", kicker: "Japanese", osm: "sushi|japanese|ramen", search: "sushi japanese" },
  { id: "thai", label: "Thai", kicker: "Heat", osm: "thai", search: "thai" },
  { id: "indian", label: "Indian", kicker: "Spice", osm: "indian|pakistani|nepalese", search: "indian" },
  { id: "chinese", label: "Chinese", kicker: "Wok", osm: "chinese|dim_sum|noodle", search: "chinese" },
  { id: "bbq", label: "BBQ", kicker: "Smoke", osm: "barbecue|bbq|steak", search: "bbq barbecue" },
  { id: "italian", label: "Italian", kicker: "Pasta", osm: "italian|pasta", search: "italian" },
  { id: "korean", label: "Korean", kicker: "Banchan", osm: "korean", search: "korean" },
  { id: "med", label: "Mediterranean", kicker: "Olive", osm: "mediterranean|greek|lebanese|turkish|middle_eastern", search: "mediterranean greek" },
  { id: "comfort", label: "Comfort", kicker: "Diner", osm: "american|diner|breakfast|sandwich", search: "american diner" },
];

export const EXTRA_CUISINES: Cuisine[] = [
  { id: "french", label: "French", kicker: "Bistro", osm: "french|bistro", search: "french bistro" },
  { id: "seafood", label: "Seafood", kicker: "Catch", osm: "seafood|fish|sushi", search: "seafood" },
  { id: "vegan", label: "Vegan", kicker: "Plant", osm: "vegan|vegetarian", search: "vegan vegetarian" },
  { id: "vietnamese", label: "Vietnamese", kicker: "Pho", osm: "vietnamese|pho", search: "vietnamese pho" },
  { id: "ramen", label: "Ramen", kicker: "Broth", osm: "ramen|noodle|japanese", search: "ramen" },
  { id: "breakfast", label: "Breakfast", kicker: "AM", osm: "breakfast|brunch|diner|pancake", search: "breakfast brunch" },
  { id: "wings", label: "Wings", kicker: "Heat", osm: "chicken|wings", search: "wings" },
  { id: "ethiopian", label: "Ethiopian", kicker: "Injera", osm: "ethiopian|eritrean", search: "ethiopian" },
  { id: "caribbean", label: "Caribbean", kicker: "Islands", osm: "caribbean|jamaican|cuban", search: "caribbean" },
  { id: "sandwich", label: "Sandwiches", kicker: "Deli", osm: "sandwich|deli", search: "sandwich deli" },
];

export const ALL_CUISINES: Cuisine[] = [...CUISINES, ...EXTRA_CUISINES];

export const DEFAULT_CUISINE_IDS = CUISINES.slice(0, 10).map((c) => c.id);

export const MIN_SLICES = 3;
export const MAX_SLICES = 12;

export const PRESETS: { id: string; label: string; blurb: string; ids: string[] }[] = [
  { id: "classic", label: "Classic", blurb: "The house wheel", ids: DEFAULT_CUISINE_IDS },
  { id: "heat", label: "Heat", blurb: "Spice-forward", ids: ["mexican", "thai", "indian", "korean", "chinese"] },
  { id: "date", label: "Date night", blurb: "Sit-down rooms", ids: ["sushi", "italian", "med", "french", "seafood"] },
  { id: "weeknight", label: "Weeknight", blurb: "Fast and familiar", ids: ["pizza", "mexican", "burger", "chinese", "comfort"] },
];

export function cuisineById(id: string): Cuisine | undefined {
  return ALL_CUISINES.find((c) => c.id === id);
}

export function toSlice(c: Cuisine, weight = 1, custom = false): WheelSlice {
  return { ...c, weight, custom };
}

export function defaultWheel(): WheelSlice[] {
  return CUISINES.slice(0, 10).map((c) => toSlice(c));
}

export function wheelFromIds(ids: string[]): WheelSlice[] {
  return ids
    .map((id) => cuisineById(id))
    .filter((c): c is Cuisine => Boolean(c))
    .map((c) => toSlice(c));
}

export function slugLabel(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
}

export function guessOsm(label: string): string {
  const t = label.toLowerCase().trim();
  const hit = ALL_CUISINES.find(
    (c) =>
      c.label.toLowerCase() === t ||
      c.id === t ||
      t.includes(c.label.toLowerCase()) ||
      c.label.toLowerCase().includes(t),
  );
  if (hit) return hit.osm;

  const rules: [RegExp, string][] = [
    [/pho|viet/, "vietnamese|pho"],
    [/wing/, "chicken|wings"],
    [/taco|burrito|quesadilla/, "mexican|taco"],
    [/burger|smash/, "burger"],
    [/pie|slice/, "pizza"],
    [/noodle|ramen/, "ramen|noodle"],
    [/steak|brisket/, "steak|barbecue"],
    [/fish|oyster|lobster|shrimp/, "seafood"],
    [/salad|bowl|green/, "salad|vegetarian"],
    [/falafel|hummus|gyro|shawarma/, "mediterranean|lebanese|turkish"],
    [/curry/, "indian|thai"],
    [/bbq|barbecue/, "barbecue|bbq"],
  ];
  for (const [re, osm] of rules) {
    if (re.test(t)) return osm;
  }
  const token = t.replace(/[^a-z0-9]+/g, "");
  return token.slice(0, 24) || "regional";
}

export function sanitizeOsm(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9|_-]/g, "").slice(0, 96);
}
