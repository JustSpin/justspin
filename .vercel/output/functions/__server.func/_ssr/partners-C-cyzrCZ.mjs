import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as CUISINES } from "./cuisines-CvJhBg5L.mjs";
import { a as PRICING, f as partnerMailto, n as Button } from "./more-menu-BCg8xcki.mjs";
import { t as PageChrome } from "./page-chrome-HpckKMys.mjs";
import { t as Input } from "./input-W27atZ24.mjs";
import { t as Label } from "./label-nvQ2yMSE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/partners-C-cyzrCZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PartnersPage() {
	const [sent, setSent] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		restaurant: "",
		city: "",
		cuisine: "mexican",
		email: "",
		website: ""
	});
	const onSubmit = (e) => {
		e.preventDefault();
		window.location.href = partnerMailto(form);
		setSent(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageChrome, {
		kicker: "Back to the wheel",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-10 sm:py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.18em] text-accent",
					children: "For restaurants"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-3 max-w-[18ch] text-4xl tracking-tight sm:text-5xl",
					children: "Be the table they land on."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-base leading-relaxed text-muted",
					children: "JustSpin sends hungry people to a cuisine, then a kitchen. Featured placements sit in the first chair — before the delivery apps, before the scroll."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-3 sm:grid-cols-3",
					children: [
						PRICING.featured,
						PRICING.alwaysOn,
						PRICING.takeover
					].map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-lg border border-border bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
								children: tier.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display mt-2 text-3xl tracking-tight",
								children: [
									"$",
									tier.price,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-base text-muted",
										children: ["/", tier.unit]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: tier.blurb
							})
						]
					}, tier.name))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-12 rounded-xl border border-border bg-surface p-5 sm:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-tight",
							children: "Request a placement"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "We reply within one business day. No contracts until you want one."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Restaurant",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: form.restaurant,
										onChange: (e) => setForm({
											...form,
											restaurant: e.target.value
										}),
										placeholder: "Night + Market"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "City",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: form.city,
										onChange: (e) => setForm({
											...form,
											city: e.target.value
										}),
										placeholder: "Minneapolis"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Cuisine",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: form.cuisine,
										onChange: (e) => setForm({
											...form,
											cuisine: e.target.value
										}),
										className: "flex h-12 w-full rounded-md border border-border bg-well px-4 text-base text-fg",
										children: CUISINES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c.id,
											children: c.label
										}, c.id))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Email",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										type: "email",
										value: form.email,
										onChange: (e) => setForm({
											...form,
											email: e.target.value
										}),
										placeholder: "you@kitchen.com"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sm:col-span-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Website",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.website,
											onChange: (e) => setForm({
												...form,
												website: e.target.value
											}),
											placeholder: "https://"
										})
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "mt-6",
							size: "lg",
							children: "Send inquiry"
						}),
						sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: "Your mail app should open with the details. If it didn't, write us from that address and mention your city."
						}) : null
					]
				})
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { PartnersPage as component };
