import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp, Plus, Search, X } from "lucide-react";
import {
  ALL_CUISINES,
  FEATURED_EXTRA_IDS,
  MAX_SLICES,
  MIN_SLICES,
  PRESETS,
  type WheelSlice,
} from "@/lib/cuisines";
import { useBite } from "@/lib/store";
import { cuisineKicker, cuisineName } from "@/lib/i18n";
import { useT } from "@/lib/use-t";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { onViewportChange, viewportSize } from "@/lib/browser";

const FEATURED_ORDER = [...FEATURED_EXTRA_IDS];
const FEATURED = new Set<string>(FEATURED_EXTRA_IDS);

const CUISINES_HOUSE = new Set([
  "mexican",
  "pizza",
  "burger",
  "sushi",
  "thai",
  "indian",
  "chinese",
  "bbq",
  "italian",
  "korean",
  "med",
  "comfort",
]);

type MenuItem = { id: string; label: string; hint?: string };
type MenuGroup = { id: string; label: string; items: MenuItem[] };

export function WheelEditor() {
  const wheel = useBite((s) => s.wheel);
  const addSlice = useBite((s) => s.addSlice);
  const addCustom = useBite((s) => s.addCustom);
  const removeSlice = useBite((s) => s.removeSlice);
  const moveSlice = useBite((s) => s.moveSlice);
  const setWeight = useBite((s) => s.setWeight);
  const renameSlice = useBite((s) => s.renameSlice);
  const applyPreset = useBite((s) => s.applyPreset);
  const resetWheel = useBite((s) => s.resetWheel);
  const locale = useBite((s) => s.locale);
  const t = useT();
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const onWheel = useMemo(() => new Set(wheel.map((s) => s.id)), [wheel]);
  const available = ALL_CUISINES.filter((c) => !onWheel.has(c.id));
  const full = wheel.length >= MAX_SLICES;

  const groups = useMemo<MenuGroup[]>(() => {
    const featured: MenuItem[] = [];
    const world: MenuItem[] = [];
    for (const c of available) {
      const item = {
        id: c.id,
        label: cuisineName(locale, c.id, c.label),
        hint: cuisineKicker(locale, c.id, c.kicker),
      };
      if (FEATURED.has(c.id) || CUISINES_HOUSE.has(c.id)) featured.push(item);
      else world.push(item);
    }
    featured.sort((a, b) => {
      const ai = FEATURED_ORDER.indexOf(a.id);
      const bi = FEATURED_ORDER.indexOf(b.id);
      if (ai === -1 && bi === -1) return a.label.localeCompare(b.label);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    world.sort((a, b) => a.label.localeCompare(b.label));
    return [
      { id: "featured", label: t("groupFeatured"), items: featured },
      { id: "world", label: t("groupWorld"), items: world },
    ].filter((g) => g.items.length > 0);
  }, [available, locale, t]);

  const submitCustom = () => {
    const ok = addCustom(draft);
    if (!ok) {
      setNote(full ? t("wheelFullNote") : t("alreadyOn"));
      return;
    }
    setDraft("");
    setNote(null);
  };

  const pick = (id: string) => {
    addSlice(id);
    setNote(null);
  };

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
        {t("yourWheel", { n: wheel.length })}
      </p>
      <p className="mt-1 text-sm text-muted">{t("wheelHelp")}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p.ids)}
            className="h-10 rounded-full border border-hairline px-3.5 text-sm text-muted transition-colors duration-150 hover:border-fg/30 hover:text-fg"
          >
            {t(
              p.id === "classic"
                ? "presetClassic"
                : p.id === "heat"
                  ? "presetHeat"
                  : p.id === "date"
                    ? "presetDate"
                    : "presetWeeknight",
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={resetWheel}
          className="h-10 rounded-full px-3 text-sm text-subtle hover:text-fg"
        >
          {t("reset")}
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {wheel.map((slice, i) => (
          <SliceRow
            key={slice.id}
            slice={slice}
            index={i}
            last={i === wheel.length - 1}
            canRemove={wheel.length > MIN_SLICES}
            onMove={moveSlice}
            onWeight={setWeight}
            onRename={renameSlice}
            onRemove={removeSlice}
          />
        ))}
      </ul>

      <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
        {t("addSlice")}
      </p>
      <div className="mt-2">
        <AddSliceMenu
          triggerLabel={t("otherCuisines")}
          searchLabel={t("searchCuisines")}
          emptyLabel={t("everyCuisine")}
          nothingLabel={t("nothingMatches")}
          groups={groups}
          disabled={full}
          onPick={pick}
        />
      </div>

      <div className="mt-3 flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("customPlaceholder")}
          maxLength={18}
          className="h-11"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submitCustom();
            }
          }}
        />
        <Button type="button" variant="paper" className="h-11 shrink-0 px-4" onClick={submitCustom} disabled={full}>
          <Plus />
          {t("add")}
        </Button>
      </div>
      {note ? <p className="mt-2 text-sm text-accent">{note}</p> : null}
      {full ? (
        <p className="mt-2 text-sm text-muted">{t("twelveCeiling")}</p>
      ) : null}
    </div>
  );
}

function AddSliceMenu({
  triggerLabel,
  searchLabel,
  emptyLabel,
  nothingLabel,
  groups,
  disabled,
  onPick,
}: {
  triggerLabel: string;
  searchLabel: string;
  emptyLabel: string;
  nothingLabel: string;
  groups: MenuGroup[];
  disabled?: boolean;
  onPick: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 280, maxH: 320, openUp: false });
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const q = query.trim().toLowerCase();
  const filtered = groups
    .map((g) => ({
      ...g,
      items: q
        ? g.items.filter(
            (item) =>
              item.label.toLowerCase().includes(q) ||
              item.id.toLowerCase().includes(q) ||
              (item.hint ?? "").toLowerCase().includes(q),
          )
        : g.items,
    }))
    .filter((g) => g.items.length > 0);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const place = () => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      const pad = 12;
      const vv = viewportSize();
      const width = Math.min(r.width, vv.width - pad * 2);
      const spaceBelow = vv.height - (r.bottom - vv.offsetTop) - pad;
      const spaceAbove = r.top - vv.offsetTop - pad;
      const openUp = spaceBelow < 220 && spaceAbove > spaceBelow;
      const maxH = Math.max(180, Math.min(360, openUp ? spaceAbove : spaceBelow));
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
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: Event) => {
      const n = e.target as Node;
      if (btnRef.current?.contains(n) || menuRef.current?.contains(n)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("touchstart", onPointer, { passive: true });
    document.addEventListener("keydown", onKey, true);
    searchRef.current?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  if (total === 0) {
    return <p className="text-sm text-muted">{emptyLabel}</p>;
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={triggerLabel}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-md border border-border bg-well px-3.5 text-left text-sm text-fg outline-none transition-colors duration-150 hover:border-fg/30 focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-40"
      >
        <span className="min-w-0 truncate">
          {triggerLabel}
          <span className="text-subtle"> · {total}</span>
        </span>
        <ChevronDown className={cn("size-4 shrink-0 text-subtle transition-transform duration-150", open && "rotate-180")} />
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              className="fixed z-[90] overflow-hidden rounded-md border border-hairline bg-fg text-bg shadow-[var(--shadow-lift)]"
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
                maxHeight: pos.maxH,
                transform: pos.openUp ? "translateY(-100%)" : undefined,
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="relative border-b border-bg/15 p-2">
                <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-bg/50" />
                <Input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchLabel}
                  aria-label={searchLabel}
                  enterKeyHint="search"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="h-10 border-0 bg-bg/10 pl-10 text-base text-bg placeholder:text-bg/50"
                />
              </div>
              <div
                role="listbox"
                aria-label={triggerLabel}
                className="overflow-touch overflow-y-auto py-1"
                style={{ maxHeight: Math.max(120, pos.maxH - 56) }}
              >
                {filtered.length === 0 ? (
                  <p className="px-3.5 py-3 text-sm text-bg/70">{nothingLabel}</p>
                ) : (
                  filtered.map((group) => (
                    <div key={group.id} className="py-1">
                      <p className="px-3.5 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-bg/50">
                        {group.label}
                      </p>
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          role="option"
                          onClick={() => {
                            onPick(item.id);
                            setQuery("");
                            setOpen(false);
                          }}
                          className="flex min-h-11 w-full items-center justify-between gap-3 px-3.5 text-left text-base text-bg hover:bg-bg/10"
                        >
                          <span className="min-w-0 truncate font-medium">{item.label}</span>
                          {item.hint ? (
                            <span className="shrink-0 text-[11px] uppercase tracking-[0.12em] text-bg/55">
                              {item.hint}
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function SliceRow({
  slice,
  index,
  last,
  canRemove,
  onMove,
  onWeight,
  onRename,
  onRemove,
}: {
  slice: WheelSlice;
  index: number;
  last: boolean;
  canRemove: boolean;
  onMove: (id: string, dir: -1 | 1) => void;
  onWeight: (id: string, weight: number) => void;
  onRename: (id: string, label: string) => void;
  onRemove: (id: string) => void;
}) {
  const locale = useBite((s) => s.locale);
  const t = useT();
  const shown = slice.custom ? slice.label : cuisineName(locale, slice.id, slice.label);
  const [label, setLabel] = useState(shown);

  useEffect(() => {
    setLabel(shown);
  }, [shown]);

  return (
    <li className="flex items-center gap-2 rounded-md border border-border bg-well p-2">
      <div className="flex shrink-0 flex-col">
        <button
          type="button"
          aria-label={`Move ${shown} up`}
          disabled={index === 0}
          onClick={() => onMove(slice.id, -1)}
          className="flex size-8 items-center justify-center rounded-sm text-muted hover:bg-raised hover:text-fg disabled:opacity-30"
        >
          <ChevronUp className="size-4" />
        </button>
        <button
          type="button"
          aria-label={`Move ${shown} down`}
          disabled={last}
          onClick={() => onMove(slice.id, 1)}
          className="flex size-8 items-center justify-center rounded-sm text-muted hover:bg-raised hover:text-fg disabled:opacity-30"
        >
          <ChevronDown className="size-4" />
        </button>
      </div>
      <div className="min-w-0 flex-1">
        <input
          value={label}
          maxLength={18}
          aria-label={`Rename ${shown}`}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={() => {
            if (label.trim().length < 2) {
              setLabel(shown);
              return;
            }
            if (label.trim() === shown) return;
            onRename(slice.id, label);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          className="h-10 w-full rounded-sm bg-transparent px-2 text-base text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        />
        <p className="px-2 text-[11px] uppercase tracking-[0.12em] text-subtle">
          {slice.custom ? t("yours") : cuisineKicker(locale, slice.id, slice.kicker)}
        </p>
      </div>
      <div className="flex shrink-0 gap-1" role="group" aria-label={`${shown} odds`}>
        {([1, 2, 3] as const).map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => onWeight(slice.id, w)}
            aria-label={`Weight ${w}`}
            aria-pressed={slice.weight === w}
            className={cn(
              "size-8 rounded-sm text-xs font-medium tabular-nums",
              slice.weight === w
                ? "bg-accent text-accent-fg"
                : "bg-raised text-muted hover:text-fg",
            )}
          >
            {w}
          </button>
        ))}
      </div>
      <button
        type="button"
        aria-label={`Remove ${shown}`}
        disabled={!canRemove}
        onClick={() => onRemove(slice.id)}
        className="flex size-10 shrink-0 items-center justify-center rounded-sm text-muted hover:bg-raised hover:text-accent disabled:opacity-30"
      >
        <X className="size-4" />
      </button>
    </li>
  );
}
