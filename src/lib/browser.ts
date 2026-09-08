/** Safari / iOS helpers. Keep UI working in private mode, old WebKit, and visualViewport. */

type MqHandler = (this: MediaQueryList, ev: MediaQueryListEvent) => void;

export function listenMq(mq: MediaQueryList, fn: MqHandler): () => void {
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }
  mq.addListener(fn);
  return () => mq.removeListener(fn);
}

export function viewportSize() {
  const vv = typeof window !== "undefined" ? window.visualViewport : null;
  return {
    width: vv?.width ?? window.innerWidth,
    height: vv?.height ?? window.innerHeight,
    offsetTop: vv?.offsetTop ?? 0,
    offsetLeft: vv?.offsetLeft ?? 0,
  };
}

export function onViewportChange(fn: () => void): () => void {
  window.addEventListener("resize", fn);
  window.addEventListener("scroll", fn, true);
  const vv = window.visualViewport;
  vv?.addEventListener("resize", fn);
  vv?.addEventListener("scroll", fn);
  return () => {
    window.removeEventListener("resize", fn);
    window.removeEventListener("scroll", fn, true);
    vv?.removeEventListener("resize", fn);
    vv?.removeEventListener("scroll", fn);
  };
}

let locks = 0;
let scrollY = 0;

export function lockBody() {
  if (typeof document === "undefined") return;
  if (locks === 0) {
    scrollY = window.scrollY;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }
  locks += 1;
}

export function unlockBody() {
  if (typeof document === "undefined") return;
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  const html = document.documentElement;
  html.style.overflow = "";
  html.style.overscrollBehavior = "";
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollY);
}

export function safeLocalStorage(): {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
} {
  const mem = new Map<string, string>();
  const memory = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => {
      mem.set(k, v);
    },
    removeItem: (k: string) => {
      mem.delete(k);
    },
  };
  if (typeof window === "undefined") return memory;
  try {
    const probe = "__justspin_ok";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return memory;
  }
}

export type MenuBox = {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxH: number;
};

/** Place a fixed menu from a trigger rect. Layout viewport only — mixing
 * visualViewport with position:fixed puts menus off-screen on iOS. */
export function placeMenu(r: DOMRect, minWidth = 0, needBelow = 220): MenuBox {
  const pad = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(Math.max(minWidth, r.width), vw - pad * 2);
  const spaceBelow = vh - r.bottom - pad;
  const spaceAbove = r.top - pad;
  const openUp = spaceBelow < needBelow && spaceAbove > spaceBelow;
  const maxH = Math.max(160, Math.min(380, openUp ? spaceAbove : spaceBelow));
  const left = Math.max(pad, Math.min(r.left, vw - width - pad));
  if (openUp) return { bottom: vh - r.top + 6, left, width, maxH };
  return { top: r.bottom + 6, left, width, maxH };
}

/** Close on outside pointer after a short delay so the opening tap does not close. */
export function listenOutside(inside: Array<Element | null>, close: () => void): () => void {
  let live = true;
  const onPointer = (e: Event) => {
    if (!live) return;
    const n = e.target;
    if (!(n instanceof Node)) return;
    if (inside.some((el) => el?.contains(n))) return;
    if (n instanceof Element && n.closest("[data-float-menu]")) return;
    close();
  };
  const id = window.setTimeout(() => {
    document.addEventListener("pointerdown", onPointer, true);
  }, 80);
  return () => {
    live = false;
    window.clearTimeout(id);
    document.removeEventListener("pointerdown", onPointer, true);
  };
}


