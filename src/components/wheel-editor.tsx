import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import {
  ALL_CUISINES,
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

  const submitCustom = () => {
    const ok = addCustom(draft);
    if (!ok) {
      setNote(full ? t("wheelFullNote") : t("alreadyOn"));
      return;
    }
    setDraft("");
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
      {available.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {available.map((c) => (
            <button
              key={c.id}
              type="button"
              disabled={full}
              onClick={() => addSlice(c.id)}
              className="h-10 rounded-full border border-border px-3.5 text-sm text-muted transition-colors duration-150 hover:border-fg/30 hover:text-fg disabled:opacity-40"
            >
              {cuisineName(locale, c.id, c.label)}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted">{t("everyCuisine")}</p>
      )}

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
          className="h-10 w-full rounded-sm bg-transparent px-2 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
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
