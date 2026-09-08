import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { l as require_react_dom, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as EllipsisVertical } from "../_libs/lucide-react.mjs";
import { i as useCurrentUserState } from "./router-DFIybXp3.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/more-menu-BCg8xcki.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
/**
* Revenue config — swap these when you join each partner program.
* DoorDash (Impact), Uber Eats (Impact / Uber Affiliates), Grubhub (CJ).
* Empty IDs still send UTM-tagged traffic you can attribute later.
*/
var AFFILIATE_IDS = {
	doordash: "",
	ubereats: "",
	grubhub: ""
};
var UTM = "utm_source=justspin&utm_medium=affiliate&utm_campaign=order";
var PARTNER_INBOX = "partners@justspin.app";
var PRICING = {
	featured: {
		name: "Cuisine feature",
		price: 149,
		unit: "mo",
		blurb: "First chair when hungry people land on your food type in one city."
	},
	alwaysOn: {
		name: "Always on",
		price: 399,
		unit: "mo",
		blurb: "Stay at the top of every spin in your city, any cuisine."
	},
	takeover: {
		name: "City takeover",
		price: 899,
		unit: "mo",
		blurb: "Homepage lockup + cuisine features + a dedicated partner tile."
	},
	pro: {
		name: "JustSpin Pro",
		price: 1.99,
		unit: "mo",
		blurb: "No ads, dietary locks, saved tables, and Just Ask."
	}
};
function mapsDirectionsUrl(lat, lon, name) {
	return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=&travelmode=driving&query=${encodeURIComponent(name)}`;
}
function mapsPlaceUrl(name, city) {
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${city}`)}`;
}
function orderLinks(name, city) {
	const q = encodeURIComponent(`${name} ${city}`.trim());
	const dashId = AFFILIATE_IDS.doordash ? `&aff_unique2=${encodeURIComponent(AFFILIATE_IDS.doordash)}` : "";
	const uberId = AFFILIATE_IDS.ubereats ? `&utm_term=${encodeURIComponent(AFFILIATE_IDS.ubereats)}` : "";
	const grubId = AFFILIATE_IDS.grubhub ? `&affiliate=${encodeURIComponent(AFFILIATE_IDS.grubhub)}` : "";
	return {
		doordash: `https://www.doordash.com/search/store/${q}/?${UTM}${dashId}`,
		ubereats: `https://www.ubereats.com/search?q=${q}&${UTM}${uberId}`,
		grubhub: `https://www.grubhub.com/search?orderMethod=delivery&queryText=${q}&${UTM}${grubId}`
	};
}
function partnerMailto(fields) {
	return `mailto:${PARTNER_INBOX}?subject=${encodeURIComponent(`JustSpin listing — ${fields.restaurant}`)}&body=${encodeURIComponent([
		`Restaurant: ${fields.restaurant}`,
		`City: ${fields.city}`,
		`Cuisine: ${fields.cuisine}`,
		`Email: ${fields.email}`,
		`Website: ${fields.website}`,
		"",
		"I'd like a featured placement on JustSpin."
	].join("\n"))}`;
}
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted || isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "size-8 shrink-0 animate-pulse rounded-full bg-raised",
		"aria-hidden": true
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "flex h-11 items-center px-2 text-sm text-muted hover:text-fg",
		children: "Sign in"
	});
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/account",
		className: "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-raised ring-1 ring-hairline",
		"aria-label": `Account, ${label}`,
		children: user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: user.profileImageUrl,
			alt: "",
			className: "size-8 object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium text-fg",
			children: label.charAt(0).toUpperCase()
		})
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function LogoMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/icon-wheel.png",
		alt: "",
		width: 32,
		height: 32,
		className: cn("size-8 rounded-full bg-[#12100e] object-cover ring-1 ring-[#c9a86a]/45", className)
	});
}
function Wordmark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("font-display text-[1.35rem] leading-none tracking-tight", className),
		children: ["Just", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "italic text-[#d4af6a]",
			children: "Spin"
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,color,opacity,border-color] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			chili: "bg-accent text-accent-fg shadow-[0_8px_24px_rgb(232_93_76_/_0.28)] hover:brightness-110",
			paper: "bg-fg text-bg hover:bg-fg/90",
			outline: "border border-hairline bg-transparent text-fg hover:bg-raised",
			ghost: "text-fg hover:bg-raised",
			muted: "bg-raised text-fg hover:bg-hairline",
			link: "text-accent underline-offset-4 hover:underline px-0 h-auto"
		},
		size: {
			sm: "h-9 rounded-sm px-3 text-sm",
			md: "h-11 rounded-md px-4 text-sm",
			lg: "h-12 rounded-lg px-5 text-base",
			xl: "h-14 rounded-xl px-6 text-base tracking-wide",
			icon: "size-11 rounded-md",
			pill: "h-10 rounded-full px-4 text-sm"
		}
	},
	defaultVariants: {
		variant: "chili",
		size: "md"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function Separator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "separator",
		className: cn("h-px w-full bg-border", className),
		...props
	});
}
function MoreMenu() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [pos, setPos] = (0, import_react.useState)({
		top: 0,
		right: 0
	});
	const rootRef = (0, import_react.useRef)(null);
	const btnRef = (0, import_react.useRef)(null);
	const menuRef = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		if (!open || !btnRef.current) return;
		const r = btnRef.current.getBoundingClientRect();
		setPos({
			top: r.bottom + 4,
			right: window.innerWidth - r.right
		});
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		const onPointer = (e) => {
			const t = e.target;
			if (rootRef.current?.contains(t) || menuRef.current?.contains(t)) return;
			setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		window.addEventListener("pointerdown", onPointer);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("pointerdown", onPointer);
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rootRef,
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			ref: btnRef,
			variant: "ghost",
			size: "icon",
			"aria-label": "More",
			"aria-expanded": open,
			"aria-haspopup": "menu",
			onClick: () => setOpen((v) => !v),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, {})
		}), open && typeof document !== "undefined" ? (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: menuRef,
			role: "menu",
			"aria-label": "JustSpin menu",
			className: "fixed z-50 w-64 rounded-lg border border-border bg-surface p-1.5 shadow-[var(--shadow-lift)]",
			style: {
				top: pos.top,
				right: pos.right
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					role: "menuitem",
					to: "/partners",
					onClick: () => setOpen(false),
					className: "flex min-h-11 flex-col justify-center rounded-md px-3 py-2 hover:bg-raised",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-fg",
						children: "Get listed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-subtle",
						children: [
							"Featured tables from $",
							PRICING.featured.price,
							"/",
							PRICING.featured.unit
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					role: "menuitem",
					to: "/pro",
					onClick: () => setOpen(false),
					className: "flex min-h-11 flex-col justify-center rounded-md px-3 py-2 hover:bg-raised",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-fg",
						children: "JustSpin Pro"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-subtle",
						children: [
							"$",
							PRICING.pro.price,
							"/",
							PRICING.pro.unit,
							" · hide ads, Just Ask"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					role: "menuitem",
					to: "/account",
					onClick: () => setOpen(false),
					className: "flex h-11 items-center rounded-md px-3 text-sm text-fg hover:bg-raised",
					children: "Account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-1.5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-3 py-2 text-xs leading-relaxed text-subtle",
					children: "We earn a commission when you order through DoorDash, Uber Eats, or Grubhub. Same menu — you pay nothing extra."
				})
			]
		}), document.body) : null]
	});
}
//#endregion
export { PRICING as a, cn as c, orderLinks as d, partnerMailto as f, MoreMenu as i, mapsDirectionsUrl as l, Button as n, Separator as o, LogoMark as r, Wordmark as s, AuthSlot as t, mapsPlaceUrl as u };
