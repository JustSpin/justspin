/**
 * Revenue config — swap these when you join each partner program.
 * DoorDash (Impact), Uber Eats (Impact / Uber Affiliates), Grubhub (CJ).
 * Empty IDs still send UTM-tagged traffic you can attribute later.
 */
export const AFFILIATE_IDS = {
  doordash: "",
  ubereats: "",
  grubhub: "",
};

export const UTM = "utm_source=justspin&utm_medium=affiliate&utm_campaign=order";

export const PARTNER_INBOX = "partners@justspin.app";

/**
 * Where Pro and restaurant-placement money is sent.
 * Personal PayPal: one-time checkout (email or paypal.me). Recurring
 * subscriptions need a Business account — not used while type is personal.
 * Leave paypalEmail / paypalMe empty until the owner names the inbox.
 */
export const PAYOUT = {
  type: "personal" as const,
  paypalEmail: "",
  /** Handle only, e.g. "justspin" — not the full URL. */
  paypalMe: "",
  accountName: "JustSpin",
  stripe: {
    pro: "",
    featured: "",
    alwaysOn: "",
    takeover: "",
  },
} as const;

export function payoutReady(kind?: PayKind) {
  const paypal = Boolean(PAYOUT.paypalEmail || PAYOUT.paypalMe);
  if (kind) return Boolean(PAYOUT.stripe[kind] || paypal);
  return Boolean(
    paypal ||
      PAYOUT.stripe.pro ||
      PAYOUT.stripe.featured ||
      PAYOUT.stripe.alwaysOn ||
      PAYOUT.stripe.takeover,
  );
}

export const PRICING = {
  featured: { name: "Cuisine feature", price: 149, unit: "mo", blurb: "First chair when hungry people land on your food type in one city." },
  alwaysOn: { name: "Always on", price: 399, unit: "mo", blurb: "Stay at the top of every spin in your city, any cuisine." },
  takeover: { name: "City takeover", price: 899, unit: "mo", blurb: "Homepage lockup + cuisine features + a dedicated partner tile." },
  pro: { name: "JustSpin Pro", price: 1.99, unit: "mo", blurb: "No ads, dietary locks, saved tables, and Just Ask." },
} as const;

export type PayKind = "pro" | "featured" | "alwaysOn" | "takeover";

export function mapsDirectionsUrl(lat: number, lon: number, name: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=&travelmode=driving&query=${encodeURIComponent(name)}`;
}

export function mapsPlaceUrl(name: string, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${city}`)}`;
}

export function orderLinks(name: string, city: string) {
  const q = encodeURIComponent(`${name} ${city}`.trim());
  const dashId = AFFILIATE_IDS.doordash
    ? `&aff_unique2=${encodeURIComponent(AFFILIATE_IDS.doordash)}`
    : "";
  const uberId = AFFILIATE_IDS.ubereats
    ? `&utm_term=${encodeURIComponent(AFFILIATE_IDS.ubereats)}`
    : "";
  const grubId = AFFILIATE_IDS.grubhub
    ? `&affiliate=${encodeURIComponent(AFFILIATE_IDS.grubhub)}`
    : "";

  return {
    doordash: `https://www.doordash.com/search/store/${q}/?${UTM}${dashId}`,
    ubereats: `https://www.ubereats.com/search?q=${q}&${UTM}${uberId}`,
    grubhub: `https://www.grubhub.com/search?orderMethod=delivery&queryText=${q}&${UTM}${grubId}`,
  };
}

export function partnerMailto(fields: {
  restaurant: string;
  city: string;
  cuisine: string;
  email: string;
  website: string;
}) {
  const subject = encodeURIComponent(`JustSpin listing — ${fields.restaurant}`);
  const body = encodeURIComponent(
    [
      `Restaurant: ${fields.restaurant}`,
      `City: ${fields.city}`,
      `Cuisine: ${fields.cuisine}`,
      `Email: ${fields.email}`,
      `Website: ${fields.website}`,
      "",
      "I'd like a featured placement on JustSpin.",
    ].join("\n"),
  );
  return `mailto:${PARTNER_INBOX}?subject=${subject}&body=${body}`;
}

function paypalMeHandle() {
  const raw = PAYOUT.paypalMe.trim();
  if (!raw) return "";
  return raw
    .replace(/^https?:\/\/(www\.)?paypal\.me\//i, "")
    .replace(/^\//, "")
    .split("/")[0]
    .split("?")[0];
}

/** Personal accounts: one-time _xclick or paypal.me. Business: monthly subscribe. */
function paypalPayUrl(kind: PayKind, returnUrl: string, cancelUrl: string) {
  const tier = PRICING[kind];
  const amount = Number(tier.price).toFixed(2);
  const item = kind === "pro" ? "JustSpin Pro" : `JustSpin ${tier.name}`;
  const handle = paypalMeHandle();
  if (handle) return `https://www.paypal.com/paypalme/${encodeURIComponent(handle)}/${amount}`;
  if (!PAYOUT.paypalEmail) return null;

  const q = new URLSearchParams();
  q.set("business", PAYOUT.paypalEmail);
  q.set("item_name", item);
  q.set("item_number", kind);
  q.set("currency_code", "USD");
  q.set("no_note", "1");
  q.set("no_shipping", "1");
  q.set("return", returnUrl);
  q.set("cancel_return", cancelUrl);
  q.set("rm", "1");

  if (PAYOUT.type === "personal") {
    q.set("cmd", "_xclick");
    q.set("amount", amount);
  } else {
    q.set("cmd", "_xclick-subscriptions");
    q.set("a3", amount);
    q.set("p3", "1");
    q.set("t3", "M");
    q.set("src", "1");
    q.set("sra", "1");
  }
  return `https://www.paypal.com/cgi-bin/webscr?${q.toString()}`;
}

/** Stripe Payment Link if set, otherwise PayPal — only when a destination is assigned. */
export function checkoutUrl(kind: PayKind, origin: string) {
  const stripe = PAYOUT.stripe[kind];
  if (stripe) return stripe;
  if (!PAYOUT.paypalEmail && !paypalMeHandle()) return null;
  const path = kind === "pro" ? "/pro" : "/partners";
  return paypalPayUrl(
    kind,
    `${origin}${path}?checkout=success&plan=${kind}`,
    `${origin}${path}?checkout=cancel`,
  );
}

export function startCheckout(kind: PayKind) {
  if (typeof window === "undefined") return;
  const url = checkoutUrl(kind, window.location.origin);
  if (!url) return;
  const target = window.top ?? window;
  target.location.href = url;
}
