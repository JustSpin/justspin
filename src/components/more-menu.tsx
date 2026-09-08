import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PRICING } from "@/lib/monetize";
import { useT } from "@/lib/use-t";
import { LanguageSelect } from "@/components/language-select";
import { listenOutside, onViewportChange } from "@/lib/browser";

export function MoreMenu() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top?: number; bottom?: number; right: number } | null>(null);
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const place = () => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      const pad = 8;
      const vh = window.innerHeight;
      const spaceBelow = vh - r.bottom - pad;
      const openUp = spaceBelow < 280 && r.top > spaceBelow;
      const right = Math.max(pad, window.innerWidth - r.right);
      if (openUp) setPos({ bottom: vh - r.top + 4, right });
      else setPos({ top: r.bottom + 4, right });
    };
    place();
    return onViewportChange(place);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const stop = listenOutside([rootRef.current, menuRef.current], () => setOpen(false));
    return () => {
      window.removeEventListener("keydown", onKey);
      stop();
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
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => setOpen((v) => !v)}
      >
        <EllipsisVertical />
      </Button>
      {open && pos && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label={t("menu")}
              data-float-menu=""
              onPointerDown={(e) => e.stopPropagation()}
              className="fixed z-[110] max-h-[min(24rem,70vh)] w-[min(18rem,calc(100vw-1.5rem))] overflow-y-auto overflow-touch rounded-lg border border-border bg-surface p-1.5 shadow-[var(--shadow-lift)]"
              style={{ top: pos.top, bottom: pos.bottom, right: pos.right }}
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
