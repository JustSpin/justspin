import type { Place } from "./types";

type ChainSeed = {
  cuisineId: string;
  name: string;
  blurb: string;
};

const SEEDS: ChainSeed[] = [
  { cuisineId: "mexican", name: "Chipotle", blurb: "Bowls, burritos, and a line that moves." },
  { cuisineId: "mexican", name: "Qdoba", blurb: "Queso-heavy Mexican, no extra for guacamole." },
  { cuisineId: "pizza", name: "Blaze Pizza", blurb: "Fast-fire personal pies in minutes." },
  { cuisineId: "pizza", name: "Domino's", blurb: "The reliable late-night delivery pie." },
  { cuisineId: "burger", name: "Shake Shack", blurb: "Smash-style burgers and frozen custard." },
  { cuisineId: "burger", name: "Five Guys", blurb: "Cajun fries and as many toppings as you want." },
  { cuisineId: "sushi", name: "Kura Sushi", blurb: "Revolving-rail sushi still spinning in the US." },
  { cuisineId: "thai", name: "Noodles & Company", blurb: "Pad thai and noodle bowls, still on the apps." },
  { cuisineId: "indian", name: "Curry Up Now", blurb: "Modern Indian comfort, bowls and wraps." },
  { cuisineId: "chinese", name: "Panda Express", blurb: "Orange chicken when the craving is specific." },
  { cuisineId: "bbq", name: "Dickey's Barbecue Pit", blurb: "Brisket, ribs, and a tray of sides." },
  { cuisineId: "italian", name: "Olive Garden", blurb: "Breadsticks and a bottomless salad." },
  { cuisineId: "korean", name: "Bonchon", blurb: "Soy-garlic and spicy fried chicken." },
  { cuisineId: "med", name: "CAVA", blurb: "Greens, grains, and a very serious hot bar." },
  { cuisineId: "comfort", name: "The Cheesecake Factory", blurb: "A menu long enough to end any argument." },
  { cuisineId: "filipino", name: "Jollibee", blurb: "Chickenjoy and spaghetti, still expanding." },
  { cuisineId: "brazilian", name: "Fogo de Chão", blurb: "Rodízio steakhouse, still carving." },
  { cuisineId: "caribbean", name: "Bahama Breeze", blurb: "Island plates from a chain that's still open." },
  { cuisineId: "vietnamese", name: "Pho Hoa", blurb: "Pho shops that are still on the map." },
  { cuisineId: "greek", name: "The Great Greek Grill", blurb: "Gyros and lemon potatoes, still grilling." },
];

export function chainsForCuisine(cuisineId: string, city: string, label?: string): Place[] {
  const matched = SEEDS.filter((s) => s.cuisineId === cuisineId).map((s, i) => ({
    id: `chain-${cuisineId}-${i}`,
    name: s.name,
    lat: null,
    lon: null,
    distanceMiles: null,
    cuisineTags: [cuisineId],
    address: city ? `Delivery in ${city}` : "Nationwide delivery",
    phone: null,
    website: null,
    source: "chain" as const,
    blurb: s.blurb,
  }));
  if (matched.length) return matched;
  const name = (label ?? cuisineId).trim();
  if (!name) return [];
  return [
    {
      id: `chain-search-${cuisineId}`,
      name,
      lat: null,
      lon: null,
      distanceMiles: null,
      cuisineTags: [cuisineId],
      address: city ? `Delivery in ${city}` : "Nationwide delivery",
      phone: null,
      website: null,
      source: "chain" as const,
      blurb: `Search ${name} on the apps and order in.`,
    },
  ];
}
