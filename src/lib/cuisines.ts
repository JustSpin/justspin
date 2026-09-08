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

function kitchen(
  id: string,
  label: string,
  kicker: string,
  osm?: string,
  search?: string,
): Cuisine {
  const tag = osm ?? id.replace(/-/g, "_");
  return { id, label, kicker, osm: tag, search: search ?? label.toLowerCase() };
}

export const CUISINES: Cuisine[] = [
  kitchen("mexican", "Tacos", "Mexican", "mexican|tex-mex|taco|latin", "mexican tacos"),
  kitchen("pizza", "Pizza", "Slices", "pizza", "pizza"),
  kitchen("burger", "Burgers", "Grilled", "burger|american", "burgers"),
  kitchen("sushi", "Sushi", "Japanese", "sushi|japanese|ramen", "sushi japanese"),
  kitchen("thai", "Thai", "Heat", "thai", "thai"),
  kitchen("indian", "Indian", "Spice", "indian|pakistani|nepalese", "indian"),
  kitchen("chinese", "Chinese", "Wok", "chinese|dim_sum|noodle", "chinese"),
  kitchen("bbq", "BBQ", "Smoke", "barbecue|bbq|steak", "bbq barbecue"),
  kitchen("italian", "Italian", "Pasta", "italian|pasta", "italian"),
  kitchen("korean", "Korean", "Banchan", "korean", "korean"),
  kitchen("med", "Mediterranean", "Olive", "mediterranean|greek|lebanese|turkish|middle_eastern", "mediterranean greek"),
  kitchen("comfort", "Comfort", "Diner", "american|diner|breakfast|sandwich", "american diner"),
];

/** House extras — shown first in the add-slice dropdown, like SpinSavor. */
export const EXTRA_CUISINES: Cuisine[] = [
  kitchen("french", "French", "Bistro", "french|bistro", "french bistro"),
  kitchen("seafood", "Seafood", "Catch", "seafood|fish|sushi", "seafood"),
  kitchen("vegan", "Vegan", "Plant", "vegan|vegetarian", "vegan vegetarian"),
  kitchen("vietnamese", "Vietnamese", "Pho", "vietnamese|pho", "vietnamese pho"),
  kitchen("ramen", "Ramen", "Broth", "ramen|noodle|japanese", "ramen"),
  kitchen("breakfast", "Breakfast", "AM", "breakfast|brunch|diner|pancake", "breakfast brunch"),
  kitchen("wings", "Wings", "Heat", "chicken|wings", "wings"),
  kitchen("sandwich", "Sandwiches", "Deli", "sandwich|deli", "sandwich deli"),
  kitchen("middle-eastern", "Middle Eastern", "Levant", "middle_eastern|lebanese|turkish|persian", "middle eastern"),
  kitchen("greek", "Greek", "Olive", "greek|mediterranean", "greek"),
  kitchen("filipino", "Filipino", "Islands", "filipino", "filipino"),
  kitchen("german", "German", "Beer hall", "german", "german"),
  kitchen("caribbean", "Caribbean", "Islands", "caribbean|jamaican|cuban", "caribbean"),
  kitchen("brazilian", "Brazilian", "Grill", "brazilian", "brazilian"),
  kitchen("ethiopian", "Ethiopian", "Injera", "ethiopian|eritrean", "ethiopian"),
  kitchen("moroccan", "Moroccan", "Spice", "moroccan", "moroccan"),
];

export const FEATURED_EXTRA_IDS = EXTRA_CUISINES.map((c) => c.id);

/** Worldwide ethnic kitchens, same set SpinSavor uses for extras. */
export const WORLD_CUISINES: Cuisine[] = [
  kitchen("peruvian", "Peruvian", "Andes"),
  kitchen("argentine", "Argentine", "Grill"),
  kitchen("colombian", "Colombian", "Andes"),
  kitchen("cuban", "Cuban", "Island"),
  kitchen("puerto-rican", "Puerto Rican", "Island", "puerto_rican|caribbean"),
  kitchen("salvadoran", "Salvadoran", "Pupusa"),
  kitchen("venezuelan", "Venezuelan", "Arepa"),
  kitchen("cajun", "Cajun", "Bayou", "cajun|creole"),
  kitchen("portuguese", "Portuguese", "Atlantic"),
  kitchen("british", "British", "Pub", "british|english"),
  kitchen("irish", "Irish", "Island"),
  kitchen("polish", "Polish", "Pierogi"),
  kitchen("russian", "Russian", "Steppe"),
  kitchen("hungarian", "Hungarian", "Paprika"),
  kitchen("swedish", "Swedish", "Nordic"),
  kitchen("dutch", "Dutch", "Canal"),
  kitchen("belgian", "Belgian", "Brasserie"),
  kitchen("austrian", "Austrian", "Alpine"),
  kitchen("ukrainian", "Ukrainian", "Steppe"),
  kitchen("turkish", "Turkish", "Bazaar"),
  kitchen("persian", "Persian", "Saffron", "persian|iranian"),
  kitchen("afghan", "Afghan", "Kebab"),
  kitchen("georgian", "Georgian", "Caucasus"),
  kitchen("lebanese", "Lebanese", "Mezze"),
  kitchen("israeli", "Israeli", "Levant"),
  kitchen("pakistani", "Pakistani", "Spice"),
  kitchen("bangladeshi", "Bangladeshi", "Delta"),
  kitchen("sri-lankan", "Sri Lankan", "Island", "sri_lankan"),
  kitchen("nepali", "Nepali", "Himalaya", "nepalese|nepali"),
  kitchen("malaysian", "Malaysian", "Nyonya"),
  kitchen("indonesian", "Indonesian", "Archipelago"),
  kitchen("burmese", "Burmese", "Tea"),
  kitchen("cambodian", "Cambodian", "Khmer"),
  kitchen("laotian", "Laotian", "Mekong"),
  kitchen("taiwanese", "Taiwanese", "Night"),
  kitchen("mongolian", "Mongolian", "Steppe"),
  kitchen("egyptian", "Egyptian", "Nile"),
  kitchen("tunisian", "Tunisian", "Maghreb"),
  kitchen("nigerian", "Nigerian", "West"),
  kitchen("ghanaian", "Ghanaian", "West"),
  kitchen("senegalese", "Senegalese", "Sahel"),
  kitchen("kenyan", "Kenyan", "East"),
  kitchen("south-african", "South African", "Braai", "south_african"),
  kitchen("somali", "Somali", "Horn"),
  kitchen("hawaiian", "Hawaiian", "Island"),
  kitchen("polynesian", "Polynesian", "Pacific"),
  kitchen("singaporean", "Singaporean", "Hawker"),
  kitchen("chilean", "Chilean", "Pacific"),
  kitchen("dominican", "Dominican", "Island"),
  kitchen("jamaican", "Jamaican", "Jerk", "jamaican|caribbean"),
  kitchen("armenian", "Armenian", "Caucasus"),
  kitchen("uzbek", "Uzbek", "Silk"),
  kitchen("finnish", "Finnish", "Nordic"),
  kitchen("norwegian", "Norwegian", "Fjord"),
  kitchen("czech", "Czech", "Bohemia"),
  kitchen("algerian", "Algerian", "Maghreb"),
];

export const ALL_CUISINES: Cuisine[] = [...CUISINES, ...EXTRA_CUISINES, ...WORLD_CUISINES];

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
