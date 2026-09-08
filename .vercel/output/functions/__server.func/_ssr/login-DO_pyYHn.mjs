import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, x as require_jsx_runtime, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { t as GROK_PROVIDERS } from "./server-CL8p3Pdr.mjs";
import { i as useCurrentUserState } from "./router-DFIybXp3.mjs";
import { n as Button } from "./more-menu-BCg8xcki.mjs";
import { t as PageChrome } from "./page-chrome-HpckKMys.mjs";
import { t as Input } from "./input-W27atZ24.mjs";
import { t as Label } from "./label-nvQ2yMSE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DO_pyYHn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (mounted && !isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/account" });
	const onEmail = async (e) => {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			if (mode === "up") {
				const { error: err } = await authClient.signUp.email({
					email,
					password,
					name: name.trim() || email.split("@")[0] || "Guest"
				});
				if (err) throw new Error(err.message ?? "Could not create the account.");
			} else {
				const { error: err } = await authClient.signIn.email({
					email,
					password
				});
				if (err) throw new Error(err.message ?? "Could not sign in.");
			}
			window.location.href = "/account";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-md px-4 py-10 sm:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.18em] text-accent",
				children: "Your table"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-3 text-4xl tracking-tight",
				children: mode === "up" ? "Make an account." : "Pull up a chair."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "Star kitchens you loved. Keep a history of spins. Upgrade to Pro when you're ready."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "lg",
						className: "w-full",
						onClick: () => void signIn(p.providerId, { callbackURL: "/" }),
						children: ["Continue with ", p.label]
					}, p.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
					children: "Or with email"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => void onEmail(e),
					className: "mt-4 space-y-3",
					children: [
						mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Alex",
								autoComplete: "name"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "you@email.com",
								autoComplete: "email"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "password",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
								required: true,
								minLength: 8,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "At least 8 characters",
								autoComplete: mode === "up" ? "new-password" : "current-password"
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-accent",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "lg",
							className: "w-full",
							disabled: busy,
							children: busy ? "Working…" : mode === "up" ? "Create account" : "Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-center text-sm text-muted",
					children: mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Already have a chair?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-fg underline-offset-4 hover:underline",
							onClick: () => {
								setMode("in");
								setError(null);
							},
							children: "Sign in"
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"New here?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-fg underline-offset-4 hover:underline",
							onClick: () => {
								setMode("up");
								setError(null);
							},
							children: "Create an account"
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-center text-xs text-subtle",
					children: [
						"By continuing you agree we can save the tables you star on this account.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "underline-offset-4 hover:underline",
							children: "Back to the wheel"
						})
					]
				})
			] })
		]
	}) });
}
//#endregion
export { Login as component };
