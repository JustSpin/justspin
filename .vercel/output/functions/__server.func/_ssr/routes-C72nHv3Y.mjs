import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { i as PRESETS, t as ALL_CUISINES } from "./cuisines-CvJhBg5L.mjs";
import { _ as ChevronUp, a as Search, c as Phone, d as MapPinned, f as MapPin, h as ExternalLink, i as SlidersHorizontal, l as Pencil, m as Heart, o as RotateCcw, p as LocateFixed, r as Sparkles, s as Plus, t as X, u as Megaphone, v as ChevronDown } from "../_libs/lucide-react.mjs";
import { a as createSsrRpc, c as toggleStar, i as useCurrentUserState, l as useBite, o as recordSeenPlaces, r as useCurrentUser } from "./router-DFIybXp3.mjs";
import { a as PRICING, c as cn, d as orderLinks, i as MoreMenu, l as mapsDirectionsUrl, n as Button, o as Separator, r as LogoMark, s as Wordmark, t as AuthSlot, u as mapsPlaceUrl } from "./more-menu-BCg8xcki.mjs";
import { t as Badge } from "./badge-enKLUCI1.mjs";
import { i as milesToMeters, r as metersToMiles, t as formatMiles } from "./geo-p7Dsmxxq.mjs";
import { t as Input } from "./input-W27atZ24.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C72nHv3Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppHeader({ onLocation, onSettings }) {
	const location = useBite((s) => s.location);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	const cityLabel = ready && location?.label ? location.label : "Set city";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-30 border-b border-border/80 bg-bg/90 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2 text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onLocation,
						className: "flex h-11 max-w-[7.5rem] items-center gap-1.5 rounded-md px-2 text-sm text-muted hover:bg-raised hover:text-fg sm:max-w-[10.5rem]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: cityLabel
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: onSettings,
						"aria-label": "Customize the wheel",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreMenu, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})
				]
			})]
		})
	});
}
var geocodeCity = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("3f7879b8c9569e2d56130b9cb6db13a55530fd5ee8eed77ef6dfb9e527a798e8"));
var reverseGeocode = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("9adbf68a15d15b1c3afe18f38f6440b0816972ca3405db633a16ff37230a28af"));
var searchPlaces = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("22dd64c431f956509af6c52f78efe2657ba2fec4a05476d6a2265baf114dc3cc"));
var askBite = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("ec6f58f3d1b5e49609815f36e87b575c6f9aa03f3cd0537ce9c3282718f9ffe8"));
var QUICK_CITIES = [
	{
		label: "Minneapolis",
		lat: 44.9778,
		lon: -93.265
	},
	{
		label: "Chicago",
		lat: 41.8781,
		lon: -87.6298
	},
	{
		label: "New York",
		lat: 40.7128,
		lon: -74.006
	},
	{
		label: "Los Angeles",
		lat: 34.0522,
		lon: -118.2437
	},
	{
		label: "Austin",
		lat: 30.2672,
		lon: -97.7431
	},
	{
		label: "Denver",
		lat: 39.7392,
		lon: -104.9903
	},
	{
		label: "Seattle",
		lat: 47.6062,
		lon: -122.3321
	},
	{
		label: "Miami",
		lat: 25.7617,
		lon: -80.1918
	},
	{
		label: "Atlanta",
		lat: 33.749,
		lon: -84.388
	},
	{
		label: "Portland",
		lat: 45.5152,
		lon: -122.6784
	}
];
function LocationSheet({ open, onOpenChange }) {
	const setLocation = useBite((s) => s.setLocation);
	const current = useBite((s) => s.location);
	const [query, setQuery] = (0, import_react.useState)("");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [searching, setSearching] = (0, import_react.useState)(false);
	const [geoError, setGeoError] = (0, import_react.useState)(null);
	const [geoBusy, setGeoBusy] = (0, import_react.useState)(false);
	const openRef = (0, import_react.useRef)(open);
	openRef.current = open;
	(0, import_react.useEffect)(() => {
		if (!open) {
			setHits([]);
			setSearching(false);
			setGeoError(null);
			return;
		}
		const q = query.trim();
		if (q.length < 2) {
			setHits([]);
			return;
		}
		let live = true;
		const t = window.setTimeout(async () => {
			setSearching(true);
			try {
				const next = await geocodeCity({ data: { query: q } });
				if (live) setHits(next);
			} catch {
				if (live) setHits([]);
			} finally {
				if (live) setSearching(false);
			}
		}, 280);
		return () => {
			live = false;
			window.clearTimeout(t);
		};
	}, [query, open]);
	const pick = (hit) => {
		setLocation({
			lat: hit.lat,
			lon: hit.lon,
			label: hit.label
		});
		onOpenChange(false);
	};
	const useGps = () => {
		if (!navigator.geolocation) {
			setGeoError("Location is not available in this browser.");
			return;
		}
		setGeoBusy(true);
		setGeoError(null);
		navigator.geolocation.getCurrentPosition(async (pos) => {
			if (!openRef.current) {
				setGeoBusy(false);
				return;
			}
			try {
				const hit = await reverseGeocode({ data: {
					lat: pos.coords.latitude,
					lon: pos.coords.longitude
				} });
				if (!openRef.current) {
					setGeoBusy(false);
					return;
				}
				setLocation({
					lat: pos.coords.latitude,
					lon: pos.coords.longitude,
					label: hit?.label ?? "Current location"
				});
				onOpenChange(false);
			} catch {
				if (!openRef.current) {
					setGeoBusy(false);
					return;
				}
				setLocation({
					lat: pos.coords.latitude,
					lon: pos.coords.longitude,
					label: "Current location"
				});
				onOpenChange(false);
			} finally {
				setGeoBusy(false);
			}
		}, () => {
			setGeoBusy(false);
			if (openRef.current) setGeoError("Couldn't read GPS. Pick a city instead.");
		}, {
			enableHighAccuracy: false,
			timeout: 8e3,
			maximumAge: 6e4
		});
	};
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onOpenChange(false);
		};
		window.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [open, onOpenChange]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-bg/70",
			"aria-label": "Close location picker",
			onClick: () => onOpenChange(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-labelledby": "loc-title",
			className: "relative z-10 flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-xl border border-border bg-surface p-5 shadow-[var(--shadow-lift)] sm:rounded-xl sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.18em] text-accent",
						children: "Tables nearby"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "loc-title",
						className: "font-display mt-1 text-2xl tracking-tight",
						children: "Where are you eating?"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => onOpenChange(false),
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "paper",
					className: "w-full",
					onClick: useGps,
					disabled: geoBusy,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, {}), geoBusy ? "Finding you…" : "Use my location"]
				}),
				geoError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-accent",
					children: geoError
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search a city",
						className: "pl-10",
						autoComplete: "off",
						autoCorrect: "off"
					})]
				}),
				searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "Searching…"
				}) : hits.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 max-h-48 overflow-auto rounded-md border border-border",
					children: hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => pick(h),
						className: "flex w-full items-center gap-3 px-3 py-3 text-left text-sm hover:bg-raised",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-muted" }), h.label]
					}) }, `${h.lat}-${h.lon}-${h.label}`))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
					children: "Jump to a city"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: QUICK_CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => pick(c),
						className: cn("h-10 rounded-full border px-3.5 text-sm transition-colors duration-150", current?.label === c.label ? "border-accent bg-accent/15 text-fg" : "border-hairline text-muted hover:border-fg/30 hover:text-fg"),
						children: c.label
					}, c.label))
				})
			]
		})]
	});
}
var SEEDS = [
	{
		cuisineId: "mexican",
		name: "Chipotle",
		blurb: "Bowls, burritos, and a line that moves."
	},
	{
		cuisineId: "mexican",
		name: "Qdoba",
		blurb: "Queso-heavy Mexican, no extra for guacamole."
	},
	{
		cuisineId: "pizza",
		name: "Blaze Pizza",
		blurb: "Fast-fire personal pies in minutes."
	},
	{
		cuisineId: "pizza",
		name: "Domino's",
		blurb: "The reliable late-night delivery pie."
	},
	{
		cuisineId: "burger",
		name: "Shake Shack",
		blurb: "Smash-style burgers and frozen custard."
	},
	{
		cuisineId: "burger",
		name: "Five Guys",
		blurb: "Cajun fries and as many toppings as you want."
	},
	{
		cuisineId: "sushi",
		name: "Sushi Counter",
		blurb: "Grab-and-go rolls when you don't want to sit."
	},
	{
		cuisineId: "thai",
		name: "Thai Express",
		blurb: "Pad thai and curries, delivery-first."
	},
	{
		cuisineId: "indian",
		name: "Curry Up Now",
		blurb: "Modern Indian comfort, bowls and wraps."
	},
	{
		cuisineId: "chinese",
		name: "Panda Express",
		blurb: "Orange chicken when the craving is specific."
	},
	{
		cuisineId: "bbq",
		name: "Dickey's Barbecue Pit",
		blurb: "Brisket, ribs, and a tray of sides."
	},
	{
		cuisineId: "italian",
		name: "Olive Garden",
		blurb: "Breadsticks and a bottomless salad."
	},
	{
		cuisineId: "korean",
		name: "Bonchon",
		blurb: "Soy-garlic and spicy fried chicken."
	},
	{
		cuisineId: "med",
		name: "CAVA",
		blurb: "Greens, grains, and a very serious hot bar."
	},
	{
		cuisineId: "comfort",
		name: "The Cheesecake Factory",
		blurb: "A menu long enough to end any argument."
	}
];
function chainsForCuisine(cuisineId, city, label) {
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
		source: "chain",
		blurb: s.blurb
	}));
	if (matched.length) return matched;
	const name = (label ?? cuisineId).trim();
	if (!name) return [];
	return [{
		id: `chain-search-${cuisineId}`,
		name,
		lat: null,
		lon: null,
		distanceMiles: null,
		cuisineTags: [cuisineId],
		address: city ? `Delivery in ${city}` : "Nationwide delivery",
		phone: null,
		website: null,
		source: "chain",
		blurb: `Search ${name} on the apps and order in.`
	}];
}
function AdCard({ cuisine }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "rounded-lg border border-dashed border-hairline bg-well px-4 py-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex size-10 shrink-0 items-center justify-center rounded-md bg-raised text-accent",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
						children: "Partner slot"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-display text-lg leading-snug tracking-tight",
						children: [
							"Own the first chair when someone spins ",
							cuisine,
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Featured listings from $149/mo. Hungry people, one city, your table."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/partners",
							children: "See placements"
						})
					})
				]
			})]
		})
	});
}
function RestaurantCard({ place, city, index }) {
	const favorites = useBite((s) => s.favorites);
	const toggleFavorite = useBite((s) => s.toggleFavorite);
	const cacheBookmark = useBite((s) => s.cacheBookmark);
	const { user, isPending } = useCurrentUserState();
	const loved = favorites.includes(place.id);
	const orders = orderLinks(place.name, city);
	const maps = place.lat != null && place.lon != null ? mapsDirectionsUrl(place.lat, place.lon, place.name) : mapsPlaceUrl(place.name, city);
	const bookmark = {
		placeId: place.id,
		name: place.name,
		city,
		address: place.address,
		cuisine: place.cuisineTags[0] ?? null,
		lat: place.lat,
		lon: place.lon,
		website: place.website,
		phone: place.phone
	};
	const onStar = () => {
		if (isPending) return;
		const next = !loved;
		toggleFavorite(place.id);
		cacheBookmark(bookmark);
		if (!user) return;
		toggleStar({ data: {
			...bookmark,
			starred: next
		} }).catch(() => {
			toggleFavorite(place.id);
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("rounded-lg border bg-surface p-4", place.featured ? "border-accent/50" : "border-border"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								index != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-lg leading-none text-subtle tabular-nums",
									children: String(index).padStart(2, "0")
								}) : null,
								place.featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "chili",
									children: "Tonight's table"
								}) : null,
								place.source === "chain" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Delivery partner" }) : null,
								place.source === "partner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "chili",
									children: "Featured"
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display mt-1 truncate text-xl tracking-tight",
							children: place.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								formatMiles(place.distanceMiles),
								place.address,
								place.blurb
							].filter(Boolean).join(" · ")
						}),
						place.cuisineTags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs uppercase tracking-[0.12em] text-subtle",
							children: place.cuisineTags.join(" · ")
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onStar,
					className: "flex size-11 shrink-0 items-center justify-center rounded-md text-muted hover:bg-raised hover:text-accent",
					"aria-label": loved ? "Remove from saved tables" : "Save this table",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-5", loved && "fill-accent text-accent") })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderButton, {
						href: orders.doordash,
						label: "DoorDash"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderButton, {
						href: orders.ubereats,
						label: "Uber Eats"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderButton, {
						href: orders.grubhub,
						label: "Grubhub"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: maps,
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPinned, {}), "Directions"]
						})
					}),
					place.website ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: place.website,
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {}), "Site"]
						})
					}) : null,
					place.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `tel:${place.phone.replace(/\s+/g, "")}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {}), "Call"]
						})
					}) : null
				]
			}),
			!isPending && !user && loved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted",
				children: [
					"Saved on this device.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-fg underline-offset-4 hover:underline",
						children: "Sign in to keep it"
					})
				]
			}) : null
		]
	});
}
function OrderButton({ href, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		target: "_blank",
		rel: "noreferrer sponsored",
		className: "flex h-11 items-center justify-center rounded-md bg-accent text-center text-xs font-semibold tracking-wide text-accent-fg transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.96]",
		children: label
	});
}
function ResultsPanel({ cuisine, nearby, loading, source, onSpinAgain }) {
	const location = useBite((s) => s.location);
	const hideAds = useBite((s) => s.hideAds);
	const proUnlocked = useBite((s) => s.proUnlocked);
	const cacheBookmark = useBite((s) => s.cacheBookmark);
	const city = location?.label ?? "";
	const user = useCurrentUser();
	const partners = chainsForCuisine(cuisine.id, city, cuisine.label).filter((p) => !nearby.some((n) => n.name.toLowerCase() === p.name.toLowerCase()));
	const featured = nearby[0] ? {
		...nearby[0],
		featured: true
	} : null;
	const restNearby = nearby.slice(featured ? 1 : 0);
	const [advice, setAdvice] = (0, import_react.useState)(null);
	const [asking, setAsking] = (0, import_react.useState)(false);
	const [askError, setAskError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (loading || nearby.length === 0) return;
		const places = nearby.slice(0, 8).map((p) => ({
			placeId: p.id,
			name: p.name,
			city,
			address: p.address,
			cuisine: p.cuisineTags[0] ?? cuisine.label,
			lat: p.lat,
			lon: p.lon,
			website: p.website,
			phone: p.phone
		}));
		for (const p of places) cacheBookmark(p);
		if (!user) return;
		recordSeenPlaces({ data: {
			city,
			cuisine: cuisine.label,
			places
		} }).catch(() => {});
	}, [
		user?.id,
		loading,
		nearby,
		city,
		cuisine.label,
		cacheBookmark
	]);
	const handleAsk = async () => {
		if (!proUnlocked) return;
		setAsking(true);
		setAskError(null);
		try {
			const names = [
				featured?.name,
				...restNearby.map((p) => p.name),
				...partners.map((p) => p.name)
			].filter(Boolean);
			const res = await askBite({ data: {
				cuisine: cuisine.label,
				city,
				names
			} });
			if (res.ok) setAdvice(res.text);
			else setAskError(res.error);
		} catch {
			setAskError("Just Ask is busy. Try again in a moment.");
		} finally {
			setAsking(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "stagger-in mx-auto w-full max-w-3xl px-4 pb-24 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.18em] text-accent",
				children: "Tonight's menu"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-4xl tracking-tight sm:text-5xl",
					children: [cuisine.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xl italic text-muted sm:text-2xl",
						children: cuisine.kicker
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: onSpinAgain,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), "Spin again"]
				})]
			}),
			proUnlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-lg border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
							children: "Just Ask"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: handleAsk,
							disabled: asking || loading,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), asking ? "Thinking…" : "Pick for me"]
						})]
					}),
					advice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-fg",
						children: advice
					}) : null,
					askError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-accent",
						children: askError
					}) : null,
					!advice && !askError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "One dish. One table. No more scrolling."
					}) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/pro",
				className: "mt-5 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 hover:bg-raised",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-muted",
					children: ["Can't pick a table? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: "Just Ask on Pro."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-medium uppercase tracking-[0.14em] text-accent",
					children: ["$", PRICING.pro.price]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonCard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonCard, {})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestaurantCard, {
						place: featured,
						city,
						index: 1
					})
				}) : null,
				!hideAds ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdCard, { cuisine: cuisine.label })
				}) : null,
				restNearby.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
						children: ["Nearby · ", source === "overpass" ? "OpenStreetMap" : "Local list"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-3",
						children: restNearby.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestaurantCard, {
							place: p,
							city,
							index: i + 2
						}, p.id))
					})]
				}) : !loading && location ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-sm text-muted",
					children: [
						"No independent kitchens tagged for ",
						cuisine.label,
						" in this radius. Delivery partners below still take the order."
					]
				}) : !location ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-muted",
					children: "Set a city to pull nearby kitchens. Delivery still works from here."
				}) : null,
				partners.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
							children: "Order now · affiliate partners"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "We earn a commission when you order through these links. Same menu, you pay nothing extra."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 space-y-3",
							children: partners.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestaurantCard, {
								place: p,
								city,
								index: (featured ? 1 : 0) + restNearby.length + i + 1
							}, p.id))
						})
					]
				}) : null
			] })
		]
	});
}
function SkeletonCard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-40 animate-pulse rounded-lg border border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full rounded-lg bg-raised/60" })
	});
}
function WheelEditor() {
	const wheel = useBite((s) => s.wheel);
	const addSlice = useBite((s) => s.addSlice);
	const addCustom = useBite((s) => s.addCustom);
	const removeSlice = useBite((s) => s.removeSlice);
	const moveSlice = useBite((s) => s.moveSlice);
	const setWeight = useBite((s) => s.setWeight);
	const renameSlice = useBite((s) => s.renameSlice);
	const applyPreset = useBite((s) => s.applyPreset);
	const resetWheel = useBite((s) => s.resetWheel);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)(null);
	const onWheel = (0, import_react.useMemo)(() => new Set(wheel.map((s) => s.id)), [wheel]);
	const available = ALL_CUISINES.filter((c) => !onWheel.has(c.id));
	const full = wheel.length >= 12;
	const submitCustom = () => {
		if (!addCustom(draft)) {
			setNote(full ? "The wheel is full. Remove a slice first." : "Already on the wheel, or too short.");
			return;
		}
		setDraft("");
		setNote(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
			children: [
				"Your wheel · ",
				wheel.length,
				" slices"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Add, rename, reorder. Heavier slices land more often."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: [PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => applyPreset(p.ids),
				className: "h-10 rounded-full border border-hairline px-3.5 text-sm text-muted transition-colors duration-150 hover:border-fg/30 hover:text-fg",
				children: p.label
			}, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: resetWheel,
				className: "h-10 rounded-full px-3 text-sm text-subtle hover:text-fg",
				children: "Reset"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-2",
			children: wheel.map((slice, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliceRow, {
				slice,
				index: i,
				last: i === wheel.length - 1,
				canRemove: wheel.length > 3,
				onMove: moveSlice,
				onWeight: setWeight,
				onRename: renameSlice,
				onRemove: removeSlice
			}, slice.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-5 text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
			children: "Add a slice"
		}),
		available.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex flex-wrap gap-2",
			children: available.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: full,
				onClick: () => addSlice(c.id),
				className: "h-10 rounded-full border border-border px-3.5 text-sm text-muted transition-colors duration-150 hover:border-fg/30 hover:text-fg disabled:opacity-40",
				children: c.label
			}, c.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Every house cuisine is on the wheel. Add your own below."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				placeholder: "Pho, wings, dumplings…",
				maxLength: 18,
				className: "h-11",
				onKeyDown: (e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						submitCustom();
					}
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "paper",
				className: "h-11 shrink-0 px-4",
				onClick: submitCustom,
				disabled: full,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Add"]
			})]
		}),
		note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-accent",
			children: note
		}) : null,
		full ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Twelve slices is the ceiling — take one off to add another."
		}) : null
	] });
}
function SliceRow({ slice, index, last, canRemove, onMove, onWeight, onRename, onRemove }) {
	const [label, setLabel] = (0, import_react.useState)(slice.label);
	(0, import_react.useEffect)(() => {
		setLabel(slice.label);
	}, [slice.label]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-2 rounded-md border border-border bg-well p-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `Move ${slice.label} up`,
					disabled: index === 0,
					onClick: () => onMove(slice.id, -1),
					className: "flex size-8 items-center justify-center rounded-sm text-muted hover:bg-raised hover:text-fg disabled:opacity-30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `Move ${slice.label} down`,
					disabled: last,
					onClick: () => onMove(slice.id, 1),
					className: "flex size-8 items-center justify-center rounded-sm text-muted hover:bg-raised hover:text-fg disabled:opacity-30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: label,
					maxLength: 18,
					"aria-label": `Rename ${slice.label}`,
					onChange: (e) => setLabel(e.target.value),
					onBlur: () => {
						if (label.trim().length < 2) {
							setLabel(slice.label);
							return;
						}
						onRename(slice.id, label);
					},
					onKeyDown: (e) => {
						if (e.key === "Enter") e.currentTarget.blur();
					},
					className: "h-10 w-full rounded-sm bg-transparent px-2 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-2 text-[11px] uppercase tracking-[0.12em] text-subtle",
					children: slice.custom ? "Yours" : slice.kicker
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex shrink-0 gap-1",
				role: "group",
				"aria-label": `${slice.label} odds`,
				children: [
					1,
					2,
					3
				].map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onWeight(slice.id, w),
					"aria-label": `Weight ${w}`,
					"aria-pressed": slice.weight === w,
					className: cn("size-8 rounded-sm text-xs font-medium tabular-nums", slice.weight === w ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg"),
					children: w
				}, w))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": `Remove ${slice.label}`,
				disabled: !canRemove,
				onClick: () => onRemove(slice.id),
				className: "flex size-10 shrink-0 items-center justify-center rounded-sm text-muted hover:bg-raised hover:text-accent disabled:opacity-30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			})
		]
	});
}
function SettingsSheet({ open, onOpenChange }) {
	const radiusMeters = useBite((s) => s.radiusMeters);
	const setRadiusMeters = useBite((s) => s.setRadiusMeters);
	const proUnlocked = useBite((s) => s.proUnlocked);
	const miles = metersToMiles(radiusMeters);
	const pct = (miles - 1) / 99 * 100;
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onOpenChange(false);
		};
		window.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [open, onOpenChange]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-bg/70",
			"aria-label": "Close settings",
			onClick: () => onOpenChange(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-labelledby": "set-title",
			className: "relative z-10 flex max-h-[88dvh] w-full max-w-lg flex-col overflow-auto rounded-t-xl border border-border bg-surface p-5 shadow-[var(--shadow-lift)] sm:rounded-xl sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.18em] text-accent",
						children: "House rules"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "set-title",
						className: "font-display mt-1 text-2xl tracking-tight",
						children: "Tune the wheel"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => onOpenChange(false),
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium uppercase tracking-[0.16em] text-subtle",
						children: "Search radius"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-5xl leading-none tracking-tight tabular-nums",
						children: [miles, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1.5 text-2xl text-muted",
							children: "mi"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 1,
					max: 100,
					step: 1,
					value: miles,
					onChange: (e) => setRadiusMeters(milesToMeters(Number(e.target.value))),
					"aria-label": "Search radius in miles",
					"aria-valuemin": 1,
					"aria-valuemax": 100,
					"aria-valuenow": miles,
					"aria-valuetext": `${miles} miles`,
					className: "radius-slider mt-2",
					style: { ["--radius-pct"]: `${pct}%` }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex justify-between text-sm tabular-nums text-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [1, " mi"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [100, " mi"] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WheelEditor, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-well p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg tracking-tight",
							children: proUnlocked ? "Pro is on" : "JustSpin Pro"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Hide partner slots, save tables across sessions, and Just Ask for the one dish you should order."
						}),
						!proUnlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "chili",
							size: "sm",
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/pro",
								onClick: () => onOpenChange(false),
								children: "See Pro"
							})
						}) : null
					]
				})
			]
		})]
	});
}
function n(value) {
	return Math.round(value * 100) / 100;
}
function layoutSlices(cuisines) {
	const total = cuisines.reduce((sum, c) => sum + Math.max(1, c.weight ?? 1), 0) || 1;
	let acc = 0;
	return cuisines.map((c, i) => {
		const size = Math.max(1, c.weight ?? 1) / total * 360;
		const start = acc;
		const end = acc + size;
		acc = end;
		return {
			cuisine: c,
			start,
			end,
			mid: start + size / 2,
			size,
			i
		};
	});
}
function pickWeightedIndex(cuisines) {
	const total = cuisines.reduce((sum, c) => sum + Math.max(1, c.weight ?? 1), 0);
	let r = Math.random() * total;
	for (let i = 0; i < cuisines.length; i++) {
		r -= Math.max(1, cuisines[i].weight ?? 1);
		if (r <= 0) return i;
	}
	return cuisines.length - 1;
}
function SpinWheel({ cuisines, spinning, winningId, onSpinStart, onSpin, disabled }) {
	const [rotation, setRotation] = (0, import_react.useState)(0);
	const [nudge, setNudge] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const reduced = usePrefersReducedMotion();
	const liveRef = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(null);
	const count = Math.max(cuisines.length, 1);
	const locked = spinning || busy || disabled || cuisines.length < 3;
	const geoms = (0, import_react.useMemo)(() => layoutSlices(cuisines), [cuisines]);
	const spin = () => {
		if (locked) return;
		const index = pickWeightedIndex(cuisines);
		const picked = cuisines[index];
		const geom = geoms[index];
		const jitter = (Math.random() - .5) * Math.max(geom.size - 8, 2);
		const targetMod = (360 - (geom.mid + jitter) + 360) % 360;
		let delta = targetMod - (rotation % 360 + 360) % 360;
		if (delta < 0) delta += 360;
		const extra = 5 + Math.floor(Math.random() * 3);
		const next = rotation + extra * 360 + delta;
		setBusy(true);
		onSpinStart?.();
		if (reduced) {
			setRotation(targetMod);
			setBusy(false);
			onSpin(picked);
			return;
		}
		setRotation(next);
		setNudge((k) => k + 1);
		if (timerRef.current != null) window.clearTimeout(timerRef.current);
		timerRef.current = window.setTimeout(() => {
			timerRef.current = null;
			setBusy(false);
			onSpin(picked);
		}, 4200);
	};
	(0, import_react.useEffect)(() => {
		return () => {
			if (timerRef.current != null) window.clearTimeout(timerRef.current);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!winningId || !liveRef.current) return;
		const label = cuisines.find((c) => c.id === winningId)?.label;
		if (label) liveRef.current.textContent = `Tonight: ${label}`;
	}, [winningId, cuisines]);
	const slices = (0, import_react.useMemo)(() => {
		return geoms.map((g) => ({
			...g,
			win: winningId === g.cuisine.id && !spinning && !busy
		}));
	}, [
		geoms,
		winningId,
		spinning,
		busy
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto w-full max-w-[22.5rem] sm:max-w-[24.5rem]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			ref: liveRef,
			className: "sr-only",
			"aria-live": "polite"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-square",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute left-1/2 top-[-6px] z-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						width: "28",
						height: "34",
						viewBox: "0 0 28 34",
						className: cn("-translate-x-1/2", nudge > 0 && "pointer-live"),
						style: { transformOrigin: "14px 8px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M14 32 L2 4 H26 Z",
							fill: "var(--color-accent)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "14",
							cy: "8",
							r: "2.2",
							fill: "var(--color-bg)"
						})]
					})
				}, nudge),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full bg-well shadow-[var(--shadow-well)] ring-1 ring-hairline" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-[10px] overflow-hidden rounded-full",
					style: {
						transform: `rotate(${rotation}deg)`,
						transition: reduced ? "none" : "transform 4.2s cubic-bezier(0.12, 0.78, 0.08, 1)",
						willChange: busy ? "transform" : void 0
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 200 200",
						className: "size-full",
						children: [
							slices.map((s) => {
								const d = slicePath(100, 100, 100, s.start, s.end);
								const pos = polar(100, 100, 64, s.mid);
								const flip = s.mid > 90 && s.mid < 270;
								const tx = n(pos.x);
								const ty = n(pos.y);
								const showLabel = s.size >= 18;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d,
										fill: s.win ? "var(--color-win)" : s.i % 2 === 0 ? "var(--color-slice-a)" : "var(--color-slice-b)",
										stroke: "var(--color-border)",
										strokeWidth: "0.6"
									}),
									s.win ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d,
										fill: "var(--color-accent)",
										opacity: "0.16"
									}) : null,
									showLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: tx,
										y: ty,
										fill: s.win ? "var(--color-fg)" : "var(--color-muted)",
										fontSize: count > 10 || s.size < 28 ? 6.8 : 8.2,
										fontFamily: "Figtree, sans-serif",
										fontWeight: 600,
										letterSpacing: "0.08em",
										textAnchor: "middle",
										dominantBaseline: "middle",
										transform: `rotate(${n(s.mid + (flip ? 180 : 0))} ${tx} ${ty})`,
										children: s.cuisine.label.toUpperCase()
									}) : null
								] }, s.cuisine.id);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "100",
								cy: "100",
								r: "28",
								fill: "var(--color-bg)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "100",
								cy: "100",
								r: "28",
								fill: "none",
								stroke: "var(--color-hairline)",
								strokeWidth: "1.2"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: spin,
					disabled: locked,
					className: cn("absolute left-1/2 top-1/2 z-10 flex size-[5.4rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full", "bg-accent text-accent-fg shadow-[0_10px_28px_rgb(232_93_76_/_0.38)]", "transition-[transform,filter] duration-150 ease-out", "hover:brightness-110 active:scale-[0.96]", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/70", "disabled:opacity-50 disabled:shadow-none"),
					"aria-label": busy || spinning ? "Wheel is spinning" : "Spin the wheel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg leading-none tracking-tight",
						children: busy || spinning ? "..." : "SPIN"
					}), busy || spinning ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-accent-fg/80",
						children: "tonight"
					})]
				})
			]
		})]
	});
}
function polar(cx, cy, r, angle) {
	const rad = (angle - 90) * Math.PI / 180;
	return {
		x: n(cx + r * Math.cos(rad)),
		y: n(cy + r * Math.sin(rad))
	};
}
function slicePath(cx, cy, r, start, end) {
	const s = polar(cx, cy, r, end);
	const e = polar(cx, cy, r, start);
	const large = end - start > 180 ? 1 : 0;
	return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y} Z`;
}
function usePrefersReducedMotion() {
	const [reduced, setReduced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mq.matches);
		const onChange = () => setReduced(mq.matches);
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);
	return reduced;
}
function Home() {
	const wheel = useBite((s) => s.wheel);
	const [locOpen, setLocOpen] = (0, import_react.useState)(false);
	const [setOpen, setSetOpen] = (0, import_react.useState)(false);
	const [spinning, setSpinning] = (0, import_react.useState)(false);
	const [winner, setWinner] = (0, import_react.useState)(null);
	const [nearby, setNearby] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [source, setSource] = (0, import_react.useState)(null);
	const spinSeq = (0, import_react.useRef)(0);
	const beginSpin = () => {
		spinSeq.current += 1;
		setSpinning(true);
		setWinner(null);
		setNearby([]);
		setSource(null);
	};
	const finishSpin = async (cuisine) => {
		const seq = spinSeq.current;
		setWinner(cuisine);
		setSpinning(false);
		const loc = useBite.getState().location;
		const radius = useBite.getState().radiusMeters;
		if (!loc) {
			if (seq === spinSeq.current) {
				setSource("fallback");
				setLoading(false);
			}
			return;
		}
		setLoading(true);
		try {
			const res = await searchPlaces({ data: {
				lat: loc.lat,
				lon: loc.lon,
				cuisineId: cuisine.id,
				osm: cuisine.osm,
				radiusMeters: radius
			} });
			if (seq !== spinSeq.current) return;
			setNearby(res.nearby);
			setSource(res.source);
		} catch {
			if (seq !== spinSeq.current) return;
			setNearby([]);
			setSource("fallback");
		} finally {
			if (seq === spinSeq.current) setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "paper-grain pointer-events-none fixed inset-0 opacity-[0.035]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {
				onLocation: () => setLocOpen(true),
				onSettings: () => setSetOpen(true)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {
					cuisines: wheel,
					spinning,
					winner,
					onNeedLocation: () => setLocOpen(true),
					onCustomize: () => setSetOpen(true),
					onSpinStart: beginSpin,
					onSpin: (c) => {
						finishSpin(c);
					}
				}), winner && !spinning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsPanel, {
					cuisine: winner,
					nearby,
					loading,
					source,
					onSpinAgain: () => {
						spinSeq.current += 1;
						setWinner(null);
						setNearby([]);
						setSource(null);
						setLoading(false);
						window.scrollTo({
							top: 0,
							behavior: "smooth"
						});
					}
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationSheet, {
				open: locOpen,
				onOpenChange: setLocOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsSheet, {
				open: setOpen,
				onOpenChange: setSetOpen
			})
		]
	});
}
function Hero({ cuisines, spinning, winner, onSpin, onSpinStart, onNeedLocation, onCustomize }) {
	const location = useBite((s) => s.location);
	const compact = Boolean(winner) && !spinning;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: compact ? "border-b border-border pb-8 pt-6" : "pb-4 pt-8 sm:pt-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-4 text-center",
			children: [
				!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.22em] text-accent",
						children: "Can't decide"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mx-auto mt-3 max-w-[16ch] text-[2.6rem] leading-[1.05] tracking-tight sm:text-6xl",
						children: "Let dinner find you."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-md text-base leading-relaxed text-muted",
						children: "Build the wheel you actually want. Then spin it."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mx-auto mt-3 max-w-xs text-xs leading-relaxed text-subtle",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium uppercase tracking-[0.16em] text-accent",
								children: "Warning"
							}),
							" — ",
							"JustSpin is at no fault if she is not satisfied after the meal."
						]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.22em] text-subtle",
					children: "The wheel rests"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: compact ? "mt-5" : "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinWheel, {
						cuisines,
						spinning,
						winningId: winner?.id ?? null,
						onSpinStart,
						onSpin
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onCustomize,
					className: "mx-auto mt-5 flex h-11 items-center gap-2 rounded-full border border-hairline px-4 text-sm text-muted transition-colors duration-150 hover:border-fg/30 hover:text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" }), "Customize wheel"]
				}),
				!location && !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onNeedLocation,
					className: "mt-3 text-sm text-muted underline-offset-4 hover:text-fg hover:underline",
					children: "Set a city for nearby tables — or spin for delivery anywhere."
				}) : null
			]
		})
	});
}
//#endregion
export { Home as component };
