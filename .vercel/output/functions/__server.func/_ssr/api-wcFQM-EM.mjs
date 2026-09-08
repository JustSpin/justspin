import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { a as cuisineById, c as sanitizeOsm } from "./cuisines-CvJhBg5L.mjs";
import { i as milesToMeters, n as haversineMiles } from "./geo-p7Dsmxxq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-wcFQM-EM.js
var NOMINATIM = "https://nominatim.openstreetmap.org";
var OVERPASS_HOSTS = [
	"https://overpass.openstreetmap.fr/api/interpreter",
	"https://overpass.kumi.systems/api/interpreter",
	"https://overpass-api.de/api/interpreter"
];
var UA = "JustSpin/1.0 (dinner discovery; https://justspin.app)";
var geocodeCity_createServerFn_handler = createServerRpc({
	id: "3f7879b8c9569e2d56130b9cb6db13a55530fd5ee8eed77ef6dfb9e527a798e8",
	name: "geocodeCity",
	filename: "src/lib/api.ts"
}, (opts) => geocodeCity.__executeServer(opts));
var geocodeCity = createServerFn({ method: "POST" }).validator((input) => input).handler(geocodeCity_createServerFn_handler, async ({ data }) => {
	const q = data.query.trim();
	if (q.length < 2) return [];
	const url = `${NOMINATIM}/search?format=jsonv2&limit=6&addressdetails=1&q=${encodeURIComponent(q)}`;
	const res = await fetch(url, { headers: {
		Accept: "application/json",
		"User-Agent": UA
	} });
	if (!res.ok) return [];
	return (await res.json()).map((r) => ({
		label: shortLabel(r),
		lat: Number(r.lat),
		lon: Number(r.lon)
	}));
});
var reverseGeocode_createServerFn_handler = createServerRpc({
	id: "9adbf68a15d15b1c3afe18f38f6440b0816972ca3405db633a16ff37230a28af",
	name: "reverseGeocode",
	filename: "src/lib/api.ts"
}, (opts) => reverseGeocode.__executeServer(opts));
var reverseGeocode = createServerFn({ method: "POST" }).validator((input) => input).handler(reverseGeocode_createServerFn_handler, async ({ data }) => {
	const url = `${NOMINATIM}/reverse?format=jsonv2&lat=${data.lat}&lon=${data.lon}&zoom=12`;
	const res = await fetch(url, { headers: {
		Accept: "application/json",
		"User-Agent": UA
	} });
	if (!res.ok) return null;
	return {
		label: shortLabel(await res.json()),
		lat: data.lat,
		lon: data.lon
	};
});
var searchPlaces_createServerFn_handler = createServerRpc({
	id: "22dd64c431f956509af6c52f78efe2657ba2fec4a05476d6a2265baf114dc3cc",
	name: "searchPlaces",
	filename: "src/lib/api.ts"
}, (opts) => searchPlaces.__executeServer(opts));
var searchPlaces = createServerFn({ method: "POST" }).validator((input) => input).handler(searchPlaces_createServerFn_handler, async ({ data }) => {
	const cuisine = cuisineById(data.cuisineId);
	const osm = sanitizeOsm(data.osm ?? "") || cuisine?.osm;
	if (!osm) return {
		nearby: [],
		source: "fallback"
	};
	const radius = Math.min(Math.max(data.radiusMeters, milesToMeters(1)), milesToMeters(100));
	const nearby = await queryOverpass(data.lat, data.lon, osm, radius);
	return {
		nearby,
		source: nearby.length ? "overpass" : "fallback"
	};
});
var askBite_createServerFn_handler = createServerRpc({
	id: "ec6f58f3d1b5e49609815f36e87b575c6f9aa03f3cd0537ce9c3282718f9ffe8",
	name: "askBite",
	filename: "src/lib/api.ts"
}, (opts) => askBite.__executeServer(opts));
var askBite = createServerFn({ method: "POST" }).validator((input) => input).handler(askBite_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Just Ask is not available yet."
	};
	const hour = (/* @__PURE__ */ new Date()).getHours();
	const moment = hour < 11 ? "late breakfast" : hour < 15 ? "lunch" : hour < 17 ? "a late lunch" : "dinner";
	const list = data.names.slice(0, 8).join("; ");
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 140,
			messages: [{
				role: "system",
				content: "You are Just, a terse dinner concierge for JustSpin. Pick ONE restaurant from the list and one dish. Two short sentences, no markdown, no preamble."
			}, {
				role: "user",
				content: `It is ${moment} in ${data.city || "town"}. Cuisine: ${data.cuisine}. Places: ${list || "delivery chains"}.`
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: "Just Ask is busy. Spin again in a moment."
	};
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "Just Ask had nothing to add."
	};
	return {
		ok: true,
		text
	};
});
function shortLabel(r) {
	const a = r.address ?? {};
	const city = a.city || a.town || a.village || a.hamlet || r.name;
	const region = a.state || a.region;
	if (city && region) return `${city}, ${region}`;
	if (city) return city;
	return (r.display_name ?? "Pinned location").split(",").slice(0, 2).join(",").trim();
}
async function queryOverpass(lat, lon, osm, radius) {
	const ql = `[out:json][timeout:25];
(
  nwr["amenity"~"restaurant|fast_food|cafe|food_court"]["cuisine"~"${osm}",i](around:${radius},${lat},${lon});
);
out tags center 30;`;
	for (const host of OVERPASS_HOSTS) try {
		const res = await fetch(host, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				"User-Agent": UA
			},
			body: `data=${encodeURIComponent(ql)}`,
			signal: AbortSignal.timeout(28e3)
		});
		if (!res.ok) continue;
		const deduped = dedupePlaces(((await res.json()).elements ?? []).map((el) => toPlace(el, lat, lon)).filter((p) => Boolean(p)));
		deduped.sort((a, b) => (a.distanceMiles ?? 99) - (b.distanceMiles ?? 99));
		if (deduped.length) return deduped.slice(0, 14);
	} catch {}
	return [];
}
function toPlace(el, originLat, originLon) {
	const tags = el.tags ?? {};
	const name = tags.name || tags["name:en"];
	if (!name) return null;
	const lat = el.lat ?? el.center?.lat ?? null;
	const lon = el.lon ?? el.center?.lon ?? null;
	const distanceMiles = lat != null && lon != null ? haversineMiles({
		lat: originLat,
		lon: originLon
	}, {
		lat,
		lon
	}) : null;
	const cuisineTags = (tags.cuisine ?? "").split(/[;,]/).map((s) => s.trim()).filter(Boolean).slice(0, 3);
	const address = [
		tags["addr:housenumber"],
		tags["addr:street"],
		tags["addr:city"]
	].filter(Boolean).join(" ");
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
		source: "nearby"
	};
}
function dedupePlaces(places) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const p of places) {
		const key = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(p);
	}
	return out;
}
//#endregion
export { askBite_createServerFn_handler, geocodeCity_createServerFn_handler, reverseGeocode_createServerFn_handler, searchPlaces_createServerFn_handler };
