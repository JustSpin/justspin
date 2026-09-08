import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as ArrowLeft } from "../_libs/lucide-react.mjs";
import { i as MoreMenu, r as LogoMark, s as Wordmark, t as AuthSlot } from "./more-menu-BCg8xcki.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/page-chrome-HpckKMys.js
var import_jsx_runtime = require_jsx_runtime();
function PageChrome({ children, kicker }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "paper-grain pointer-events-none fixed inset-0 opacity-[0.035]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreMenu, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "flex h-11 items-center gap-1.5 rounded-md px-2 text-sm text-muted hover:bg-raised hover:text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: kicker ?? "Back to the wheel"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative",
				children
			})
		]
	});
}
//#endregion
export { PageChrome as t };
