import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, b as useRouter, d as HeadContent, g as createFileRoute, h as lazyRouteComponent, m as Outlet, p as createRouter, u as Scripts, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { t as authMiddleware } from "./db-DdbbMTmm.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { t as authClient } from "./client-B40BzJxt.mjs";
import { a as cuisineById, d as wheelFromIds, l as slugLabel, o as defaultWheel, r as DEFAULT_CUISINE_IDS, s as guessOsm, t as ALL_CUISINES, u as toSlice } from "./cuisines-CvJhBg5L.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as auth } from "./server-CL8p3Pdr.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-CuQQId76.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getMyAccount = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d21a146a7ea0d154efbabe6dadbb0878f96c76379d3958f788770449c1e90c42"));
var setProStatus = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("77c5a09a4554e2da188f482a123a9112904c0c1e45a035796e1772a61bc46c36"));
var toggleStar = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("ce9e21938f1a11a223b824698ed1d57fc56c4a0ab6e064bd9e7e8e7ef673845f"));
var recordSeenPlaces = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("0db08812bd07644e71be5247bf580c755a16d10dced4ed9300e237f00c8fca75"));
var useBite = create()(persist((set, get) => ({
	location: null,
	wheel: defaultWheel(),
	radiusMeters: 8046,
	favorites: [],
	bookmarks: [],
	accountId: null,
	proUnlocked: false,
	hideAds: false,
	setLocation: (location) => set({ location }),
	addSlice: (id) => {
		const { wheel } = get();
		if (wheel.length >= 12) return;
		if (wheel.some((s) => s.id === id)) return;
		const cuisine = cuisineById(id);
		if (!cuisine) return;
		set({ wheel: [...wheel, toSlice(cuisine)] });
	},
	addCustom: (raw) => {
		const label = raw.trim().slice(0, 18);
		if (label.length < 2) return false;
		const { wheel } = get();
		if (wheel.length >= 12) return false;
		const known = ALL_CUISINES.find((c) => c.label.toLowerCase() === label.toLowerCase() || c.id === label.toLowerCase());
		if (known) {
			if (wheel.some((s) => s.id === known.id)) return false;
			set({ wheel: [...wheel, toSlice(known)] });
			return true;
		}
		const id = `custom-${slugLabel(label) || "bite"}`;
		if (wheel.some((s) => s.id === id || s.label.toLowerCase() === label.toLowerCase())) return false;
		set({ wheel: [...wheel, {
			id,
			label,
			kicker: "Yours",
			osm: guessOsm(label),
			search: label.toLowerCase(),
			weight: 1,
			custom: true
		}] });
		return true;
	},
	removeSlice: (id) => {
		const { wheel } = get();
		if (wheel.length <= 3) return;
		set({ wheel: wheel.filter((s) => s.id !== id) });
	},
	moveSlice: (id, dir) => {
		const { wheel } = get();
		const i = wheel.findIndex((s) => s.id === id);
		const j = i + dir;
		if (i < 0 || j < 0 || j >= wheel.length) return;
		const next = wheel.slice();
		const [row] = next.splice(i, 1);
		next.splice(j, 0, row);
		set({ wheel: next });
	},
	setWeight: (id, weight) => {
		const w = Math.min(3, Math.max(1, Math.round(weight)));
		set({ wheel: get().wheel.map((s) => s.id === id ? {
			...s,
			weight: w
		} : s) });
	},
	renameSlice: (id, label) => {
		const next = label.trim().slice(0, 18);
		if (next.length < 2) return;
		set({ wheel: get().wheel.map((s) => s.id === id ? {
			...s,
			label: next,
			osm: s.custom ? guessOsm(next) : s.osm,
			search: s.custom ? next.toLowerCase() : s.search
		} : s) });
	},
	applyPreset: (ids) => set({ wheel: wheelFromIds(ids) }),
	resetWheel: () => set({ wheel: defaultWheel() }),
	setRadiusMeters: (radiusMeters) => set({ radiusMeters }),
	toggleFavorite: (id) => {
		const current = get().favorites;
		set({ favorites: current.includes(id) ? current.filter((x) => x !== id) : [...current, id] });
	},
	setFavorites: (favorites) => set({ favorites }),
	cacheBookmark: (place) => {
		set({ bookmarks: [place, ...get().bookmarks.filter((p) => p.placeId !== place.placeId)].slice(0, 80) });
	},
	setBookmarks: (bookmarks) => set({ bookmarks: bookmarks.slice(0, 80) }),
	setAccountId: (accountId) => set({ accountId }),
	clearSessionLocal: () => set({
		favorites: [],
		bookmarks: [],
		accountId: null,
		proUnlocked: false,
		hideAds: false
	}),
	setProUnlocked: (proUnlocked) => set({
		proUnlocked,
		hideAds: proUnlocked
	})
}), {
	name: "spinbite-v1",
	version: 3,
	skipHydration: true,
	partialize: (s) => ({
		location: s.location,
		wheel: s.wheel,
		radiusMeters: s.radiusMeters,
		favorites: s.favorites,
		bookmarks: s.bookmarks,
		accountId: s.accountId
	}),
	migrate: (persisted, version) => {
		const state = persisted;
		if (version < 2) {
			const ids = Array.isArray(state.cuisineIds) ? state.cuisineIds : DEFAULT_CUISINE_IDS;
			state.wheel = wheelFromIds(ids);
			delete state.cuisineIds;
		}
		if (!Array.isArray(state.wheel) || state.wheel.length < 3) state.wheel = defaultWheel();
		if (!Array.isArray(state.bookmarks)) state.bookmarks = [];
		if (version < 3) {
			delete state.proUnlocked;
			delete state.hideAds;
			state.accountId = null;
		}
		if (typeof state.accountId !== "string") state.accountId = null;
		return state;
	}
}));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/use-current-user-DG6UNzh9.js
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-DFIybXp3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
/** Push this device's guest hearts, then return the account snapshot. */
async function hydrateAccount(userId) {
	const { bookmarks, favorites, accountId } = useBite.getState();
	if (!accountId) {
		const starred = bookmarks.filter((b) => favorites.includes(b.placeId));
		for (const b of starred) await toggleStar({ data: {
			...b,
			starred: true
		} });
		if (bookmarks.length > 0) await recordSeenPlaces({ data: {
			city: bookmarks[0]?.city ?? "",
			cuisine: bookmarks[0]?.cuisine ?? "",
			places: bookmarks
		} });
	} else if (accountId !== userId) useBite.getState().clearSessionLocal();
	return getMyAccount();
}
/** Pull starred ids and Pro from the account once a session exists. */
function AccountSync() {
	const { user, isPending } = useCurrentUserState();
	const setFavorites = useBite((s) => s.setFavorites);
	const setProUnlocked = useBite((s) => s.setProUnlocked);
	const setAccountId = useBite((s) => s.setAccountId);
	const setBookmarks = useBite((s) => s.setBookmarks);
	const clearSessionLocal = useBite((s) => s.clearSessionLocal);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let live = true;
		Promise.resolve(useBite.persist.rehydrate()).finally(() => {
			if (live) setReady(true);
		});
		return () => {
			live = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready || isPending) return;
		if (!user) {
			if (useBite.getState().accountId) clearSessionLocal();
			else setProUnlocked(false);
			return;
		}
		let live = true;
		hydrateAccount(user.id).then((data) => {
			if (!live) return;
			setFavorites(data.starred.map((p) => p.placeId));
			setProUnlocked(data.isPro);
			setAccountId(user.id);
			const seen = /* @__PURE__ */ new Set();
			const merged = [];
			for (const p of [...data.starred, ...data.recent]) {
				if (seen.has(p.placeId)) continue;
				seen.add(p.placeId);
				merged.push({
					placeId: p.placeId,
					name: p.name,
					city: p.city,
					address: p.address,
					cuisine: p.cuisine,
					lat: p.lat,
					lon: p.lon,
					website: p.website,
					phone: p.phone
				});
			}
			setBookmarks(merged);
		}).catch(() => {});
		return () => {
			live = false;
		};
	}, [
		ready,
		user?.id,
		isPending,
		setFavorites,
		setProUnlocked,
		setAccountId,
		setBookmarks,
		clearSessionLocal
	]);
	return null;
}
var styles_default = "/assets/styles-69YdI894.css";
var APP_NAME = "JustSpin";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Can't decide what's for dinner? Spin the wheel, land a cuisine, and order from nearby tables."
			},
			{
				name: "theme-color",
				content: "#12100e"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountSync, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$4 = () => import("./routes-C72nHv3Y.mjs");
var Route$5 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./account-DqUAnGsd.mjs");
var Route$4 = createFileRoute("/account")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./login-DO_pyYHn.mjs");
var Route$3 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./partners-C-cyzrCZ.mjs");
var Route$2 = createFileRoute("/partners")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./pro-BYm1MQB1.mjs");
var Route$1 = createFileRoute("/pro")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	AccountRoute: Route$4.update({
		id: "/account",
		path: "/account",
		getParentRoute: () => Route$6
	}),
	LoginRoute: Route$3.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$6
	}),
	PartnersRoute: Route$2.update({
		id: "/partners",
		path: "/partners",
		getParentRoute: () => Route$6
	}),
	ProRoute: Route$1.update({
		id: "/pro",
		path: "/pro",
		getParentRoute: () => Route$6
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { createSsrRpc as a, toggleStar as c, useCurrentUserState as i, useBite as l, hydrateAccount as n, recordSeenPlaces as o, useCurrentUser as r, setProStatus as s, router_exports as t };
