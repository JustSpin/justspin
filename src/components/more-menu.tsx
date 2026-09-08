import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PRICING } from "@/lib/monetize";
import { useT } from "@/lib/use-t";
import { LanguageSelect } from "@/components/language-select";
import { onViewportChange } from "@/lib/browser";

export function MoreMenu() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const place = () => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, right: Math.max(8, window.innerWidth - r.right) });
    };
    place();
    return onViewportChange(place);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: Event) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("touchstart", onPointer, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("touchstart", onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <Button
        ref={btnRef}
        variant="ghost"
        size="icon"
        aria-label={t("more")}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <EllipsisVertical />
      </Button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label={t("menu")}
              className="fixed z-50 w-64 rounded-lg border border-border bg-surface p-1.5 shadow-[var(--shadow-lift)]"
              style={{ top: pos.top, right: pos.right }}
            >
              <div className="px-2 pb-2 pt-1.5">
                <LanguageSelect labeled id="menu-language" />
              </div>
              <Separator className="mb-1.5" />
              <Link
                role="menuitem"
                to="/partners"
                onClick={() => setOpen(false)}
                className="flex min-h-11 flex-col justify-center rounded-md px-3 py-2 hover:bg-raised"
              >
                <span className="text-sm text-fg">{t("getListed")}</span>
                <span className="text-xs text-subtle">
                  {t("getListedHint", {
                    price: PRICING.featured.price,
                    unit: PRICING.featured.unit,
                  })}
                </span>
              </Link>
              <Link
                role="menuitem"
                to="/pro"
                onClick={() => setOpen(false)}
                className="flex min-h-11 flex-col justify-center rounded-md px-3 py-2 hover:bg-raised"
              >
                <span className="text-sm text-fg">{t("proName")}</span>
                <span className="text-xs text-subtle">
                  {t("proHint", { price: PRICING.pro.price, unit: PRICING.pro.unit })}
                </span>
              </Link>
              <Link
                role="menuitem"
                to="/account"
                onClick={() => setOpen(false)}
                className="flex h-11 items-center rounded-md px-3 text-sm text-fg hover:bg-raised"
              >
                {t("account")}
              </Link>
              <Link
                role="menuitem"
                to="/marks"
                onClick={() => setOpen(false)}
                className="flex min-h-11 flex-col justify-center rounded-md px-3 py-2 hover:bg-raised"
              >
                <span className="text-sm text-fg">{t("marksItem")}</span>
                <span className="text-xs text-subtle">{t("marksHint")}</span>
              </Link>
              <Separator className="my-1.5" />
              <p className="px-3 py-2 text-xs leading-relaxed text-subtle">{t("commission")}</p>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
