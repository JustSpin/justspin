import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { LOCALES, t, type Locale } from "@/lib/i18n";
import { useBite } from "@/lib/store";
import { cn } from "@/lib/utils";
import { listenOutside, onViewportChange, placeMenu, type MenuBox } from "@/lib/browser";

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
  const [pos, setPos] = useState<MenuBox | null>(null);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const place = () => {
      if (!btnRef.current) return;
      setPos(placeMenu(btnRef.current.getBoundingClientRect(), compact ? 280 : 0, 240));
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
    window.addEventListener("keydown", onKey);
    const stop = listenOutside([btnRef.current, menuRef.current], () => setOpen(false));
    return () => {
      window.removeEventListener("keydown", onKey);
      stop();
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
        onPointerDown={(e) => e.stopPropagation()}
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
      {open && pos && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="listbox"
              aria-labelledby={`${triggerId}-label`}
              data-float-menu=""
              data-language-menu=""
              onPointerDown={(e) => e.stopPropagation()}
              className="fixed z-[120] overflow-y-auto overflow-touch rounded-lg border border-hairline bg-fg p-1.5 text-bg shadow-[var(--shadow-lift)]"
              style={{
                top: pos.top,
                bottom: pos.bottom,
                left: pos.left,
                width: pos.width,
                maxHeight: pos.maxH,
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
