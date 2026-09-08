import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { LOCALES, t, type Locale } from "@/lib/i18n";
import { useBite } from "@/lib/store";
import { cn } from "@/lib/utils";
import { onViewportChange, viewportSize } from "@/lib/browser";

type Props = {
  id?: string;
  labeled?: boolean;
  className?: string;
  compact?: boolean;
};

export function LanguageSelect({
  id,
  labeled = false,
  className,
  compact = false,
}: Props) {
  const locale = useBite((s) => s.locale);
  const setLocale = useBite((s) => s.setLocale);
  const current = LOCALES.find((l) => l.id === locale) ?? LOCALES[0];
  const label = t(locale, "selectLanguage");
  const autoId = useId();
  const triggerId = id ?? autoId;
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 280, maxH: 420, openUp: false });

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const place = () => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      const pad = 12;
      const vv = viewportSize();
      const width = Math.min(Math.max(compact ? 300 : r.width, 280), vv.width - pad * 2);
      const spaceBelow = vv.height - (r.bottom - vv.offsetTop) - pad;
      const spaceAbove = r.top - vv.offsetTop - pad;
      const openUp = spaceBelow < 240 && spaceAbove > spaceBelow;
      const maxH = Math.max(200, openUp ? spaceAbove : spaceBelow);
      const left = Math.max(pad + vv.offsetLeft, Math.min(r.left, vv.offsetLeft + vv.width - width - pad));
      setPos({
        top: openUp ? r.top - 8 : r.bottom + 6,
        left,
        width,
        maxH,
        openUp,
      });
    };
    place();
    return onViewportChange(place);
  }, [open, compact]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onPointer = (e: Event) => {
      const n = e.target as Node;
      if (btnRef.current?.contains(n) || menuRef.current?.contains(n)) return;
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

  const pick = (next: Locale) => {
    setLocale(next);
    setOpen(false);
  };

  return (
    <div className={cn(compact ? "relative" : "flex w-full flex-col gap-1.5", className)}>
      {labeled ? (
        <span id={`${triggerId}-label`} className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {label}
        </span>
      ) : (
        <span className="sr-only" id={`${triggerId}-label`}>
          {label}
        </span>
      )}
      <button
        ref={btnRef}
        type="button"
        id={triggerId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${triggerId}-label`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 rounded-md text-left text-fg",
          compact
            ? "h-11 min-w-[9.5rem] px-2 hover:bg-raised"
            : "h-12 w-full border border-hairline bg-raised px-3 hover:bg-hairline",
        )}
      >
        <span className="min-w-0 flex-1 truncate text-base font-semibold leading-tight">{current.native}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-muted", open && "rotate-180")} />
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="listbox"
              aria-labelledby={`${triggerId}-label`}
              data-language-menu=""
              onPointerDown={(e) => e.stopPropagation()}
              className="fixed z-[80] overflow-y-auto overflow-touch rounded-lg border border-hairline bg-fg p-1.5 text-bg shadow-[var(--shadow-lift)]"
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
                maxHeight: pos.maxH,
                transform: pos.openUp ? "translateY(-100%)" : undefined,
              }}
            >
              {LOCALES.map((l) => {
                const selected = l.id === locale;
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => pick(l.id)}
                    className={cn(
                      "flex min-h-12 w-full items-center gap-3 rounded-md px-3 py-2 text-left",
                      selected ? "bg-win text-fg" : "text-bg hover:bg-bg/10",
                    )}
                  >
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-lg font-semibold leading-snug">{l.native}</span>
                      <span className={cn("text-sm leading-snug", selected ? "text-fg/85" : "text-bg/70")}>
                        {l.english}
                      </span>
                    </span>
                    {selected ? <Check className="size-5 shrink-0" /> : null}
                  </button>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export function LanguageSelectCompact() {
  return <LanguageSelect compact />;
}
