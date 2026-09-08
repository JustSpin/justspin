import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as Check } from "../_libs/lucide-react.mjs";
import { i as useCurrentUserState, l as useBite, s as setProStatus } from "./router-DFIybXp3.mjs";
import { a as PRICING, n as Button } from "./more-menu-BCg8xcki.mjs";
import { t as PageChrome } from "./page-chrome-HpckKMys.mjs";
import { t as Input } from "./input-W27atZ24.mjs";
import { t as Label } from "./label-nvQ2yMSE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pro-BYm1MQB1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PERKS = [
	"No partner slots between your results",
	"Just Ask picks the table and the dish",
	"Starred tables and spin history on your account",
	"Dietary locks on the wheel, coming next"
];
function ProPage() {
	const { user, isPending } = useCurrentUserState();
	const signedIn = Boolean(user);
	const proUnlocked = useBite((s) => s.proUnlocked);
	const setProUnlocked = useBite((s) => s.setProUnlocked);
	const [email, setEmail] = (0, import_react.useState)("");
	const [joined, setJoined] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	const join = (e) => {
		e.preventDefault();
		try {
			const raw = localStorage.getItem("justspin-pro-waitlist") ?? "[]";
			const parsed = JSON.parse(raw);
			const list = Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
			if (email && !list.includes(email)) localStorage.setItem("justspin-pro-waitlist", JSON.stringify([...list, email]));
		} catch {}
		setJoined(true);
	};
	const unlock = async () => {
		if (!user) return;
		setBusy(true);
		const next = !proUnlocked;
		setProUnlocked(next);
		try {
			await setProStatus({ data: { on: next } });
		} catch {
			setProUnlocked(!next);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-10 sm:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.18em] text-accent",
				children: "Membership"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/poster.jpg",
				alt: "JustSpin — Can't decide? Just spin.",
				width: 1e3,
				height: 1490,
				className: "mt-6 w-full max-w-[200px] rounded-xl border border-border bg-[#12100e]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-6 max-w-[16ch] text-4xl tracking-tight sm:text-5xl",
				children: "Dinner without the noise."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 max-w-xl text-base leading-relaxed text-muted",
				children: [
					"JustSpin Pro is $",
					PRICING.pro.price,
					"/",
					PRICING.pro.unit,
					". You keep the wheel. We hide the ads and let Just Ask settle the argument."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-3",
				children: PERKS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-3 text-sm leading-relaxed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
					}), p]
				}, p))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: join,
				className: "mt-10 rounded-xl border border-border bg-surface p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Join the first billing run"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							"We'll email you when checkout opens. Founding members keep $",
							PRICING.pro.price,
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "pro-email",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "pro-email",
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "you@email.com"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "mt-4",
						size: "lg",
						disabled: joined,
						children: joined ? "You're on the list" : "Notify me"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-lg border border-dashed border-hairline bg-well p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg tracking-tight",
						children: proUnlocked ? "Pro is on for this account" : "Upgrade to Pro"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Payments aren't wired yet. Sign in and unlock Pro on this account so starred tables, history, and Just Ask travel with you."
					}),
					!mounted || isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 h-11 w-40 animate-pulse rounded-md bg-raised" }) : signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: proUnlocked ? "outline" : "paper",
						className: "mt-4",
						disabled: busy,
						onClick: () => void unlock(),
						children: proUnlocked ? "Back to free" : "Unlock Pro on this account"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-4",
						variant: "paper",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: "Sign in to upgrade"
						})
					})
				]
			})
		]
	}) });
}
//#endregion
export { ProPage as component };
