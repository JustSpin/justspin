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
    document.body.style.touchAction = "none";
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
  document.body.style.touchAction = "";
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
