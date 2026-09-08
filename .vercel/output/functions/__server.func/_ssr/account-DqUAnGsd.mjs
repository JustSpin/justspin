import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, x as require_jsx_runtime, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { d as MapPinned, m as Heart } from "../_libs/lucide-react.mjs";
import { c as toggleStar, i as useCurrentUserState, l as useBite, n as hydrateAccount, r as useCurrentUser } from "./router-DFIybXp3.mjs";
import { c as cn, n as Button, u as mapsPlaceUrl } from "./more-menu-BCg8xcki.mjs";
import { t as PageChrome } from "./page-chrome-HpckKMys.mjs";
import { t as Badge } from "./badge-enKLUCI1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-DqUAnGsd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function AccountPage() {
	const { user, isPending } = useCurrentUserState();
	const setFavorites = useBite((s) => s.setFavorites);
	const setProUnlocked = useBite((s) => s.setProUnlocked);
	const [starred, setStarred] = (0, import_react.useState)([]);
	const [recent, setRecent] = (0, import_react.useState)([]);
	const [isPro, setIsPro] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	(0, import_react.useEffect)(() => {
		if (isPending || !user) return;
		let live = true;
		setLoading(true);
		hydrateAccount(user.id).then((data) => {
			if (!live) return;
			setStarred(data.starred);
			setRecent(data.recent);
			setIsPro(data.isPro);
			setFavorites(data.starred.map((p) => p.placeId));
			setProUnlocked(data.isPro);
		}).catch(() => {
			if (!live) return;
			setStarred([]);
			setRecent([]);
		}).finally(() => {
			if (live) setLoading(false);
		});
		return () => {
			live = false;
		};
	}, [
		user?.id,
		isPending,
		setFavorites,
		setProUnlocked
	]);
	const unstar = async (place) => {
		setStarred((cur) => cur.filter((p) => p.placeId !== place.placeId));
		setRecent((cur) => cur.map((p) => p.placeId === place.placeId ? {
			...p,
			starred: false
		} : p));
		setFavorites(useBite.getState().favorites.filter((id) => id !== place.placeId));
		try {
			await toggleStar({ data: {
				placeId: place.placeId,
				name: place.name,
				city: place.city,
				address: place.address,
				cuisine: place.cuisine,
				lat: place.lat,
				lon: place.lon,
				website: place.website,
				phone: place.phone,
				starred: false
			} });
		} catch {}
	};
	const star = async (place) => {
		setStarred((cur) => cur.some((p) => p.placeId === place.placeId) ? cur : [{
			...place,
			starred: true
		}, ...cur]);
		setRecent((cur) => cur.map((p) => p.placeId === place.placeId ? {
			...p,
			starred: true
		} : p));
		const ids = useBite.getState().favorites;
		if (!ids.includes(place.placeId)) setFavorites([...ids, place.placeId]);
		try {
			await toggleStar({ data: {
				placeId: place.placeId,
				name: place.name,
				city: place.city,
				address: place.address,
				cuisine: place.cuisine,
				lat: place.lat,
				lon: place.lon,
				website: place.website,
				phone: place.phone,
				starred: true
			} });
		} catch {}
	};
	if (!mounted || isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageChrome, {
		kicker: "Back to the wheel",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-3xl px-4 py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-48 animate-pulse rounded-md bg-raised" })
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageChrome, {
		kicker: "Back to the wheel",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-10 sm:py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.18em] text-accent",
					children: "Account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl tracking-tight",
						children: "Your tables."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [user.primaryEmail ?? user.displayName, isPro ? " · Pro" : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-wrap gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: isPro ? "outline" : "chili",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pro",
							children: isPro ? "Manage Pro" : "Upgrade to Pro"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-tight",
							children: "Starred"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Kitchens you marked to come back to."
						}),
						loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-subtle",
							children: "Loading…"
						}) : starred.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted",
							children: "Tap the heart on a restaurant after a spin. It lives here."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-3",
							children: starred.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SavedRow, {
								place: p,
								onToggleStar: () => void unstar(p)
							}, p.placeId))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-tight",
							children: "Recent spins"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Places that landed after you spun the wheel."
						}),
						loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-subtle",
							children: "Loading…"
						}) : recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted",
							children: "Spin once while signed in and they'll show up."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-3",
							children: recent.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SavedRow, {
								place: p,
								onToggleStar: () => void (p.starred ? unstar(p) : star(p))
							}, `r-${p.placeId}`))
						})
					]
				})
			]
		})
	});
}
function SavedRow({ place, onToggleStar }) {
	const maps = mapsPlaceUrl(place.name, place.city);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-start justify-between gap-3 rounded-lg border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display truncate text-xl tracking-tight",
					children: place.name
				}), place.starred ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "chili",
					children: "Starred"
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					place.city,
					place.address,
					place.cuisine
				].filter(Boolean).join(" · ")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex shrink-0 gap-1",
			children: [onToggleStar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onToggleStar,
				className: "flex size-11 items-center justify-center rounded-md text-muted hover:bg-raised hover:text-accent",
				"aria-label": place.starred ? "Remove star" : "Star this table",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-5", place.starred && "fill-accent text-accent") })
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: maps,
					target: "_blank",
					rel: "noreferrer",
					"aria-label": "Directions",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPinned, {})
				})
			})]
		})]
	});
}
//#endregion
export { AccountPage as component };
