import { X } from "lucide-react";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { MILES_MAX, MILES_MIN, metersToMiles, milesToMeters } from "@/lib/geo";
import { useBite } from "@/lib/store";
import { useT } from "@/lib/use-t";
import { Button } from "@/components/ui/button";
import { LanguageSelect } from "@/components/language-select";
import { WheelEditor } from "@/components/wheel-editor";
import { Separator } from "@/components/ui/separator";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SettingsSheet({ open, onOpenChange }: Props) {
  const radiusMeters = useBite((s) => s.radiusMeters);
  const setRadiusMeters = useBite((s) => s.setRadiusMeters);
  const proUnlocked = useBite((s) => s.proUnlocked);
  const t = useT();
  const miles = metersToMiles(radiusMeters);
  const pct = ((miles - MILES_MIN) / (MILES_MAX - MILES_MIN)) * 100;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-bg/70"
        aria-label={t("closeSettings")}
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-labelledby="set-title"
        className="relative z-10 flex max-h-[88dvh] w-full max-w-lg flex-col overflow-auto rounded-t-xl border border-border bg-surface p-5 shadow-[var(--shadow-lift)] sm:rounded-xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
              {t("houseRules")}
            </p>
            <h2 id="set-title" className="font-display mt-1 text-2xl tracking-tight">
              {t("tuneWheel")}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label={t("close")}>
            <X />
          </Button>
        </div>

        <LanguageSelect labeled className="mb-5" />

        <div className="flex items-end justify-between gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-subtle">
            {t("searchRadius")}
          </p>
          <p className="font-display text-5xl leading-none tracking-tight tabular-nums">
            {miles}
            <span className="ml-1.5 text-2xl text-muted">{t("mi")}</span>
          </p>
        </div>
        <input
          type="range"
          min={MILES_MIN}
          max={MILES_MAX}
          step={1}
          value={miles}
          onChange={(e) => setRadiusMeters(milesToMeters(Number(e.target.value)))}
          aria-label={t("milesAria")}
          aria-valuemin={MILES_MIN}
          aria-valuemax={MILES_MAX}
          aria-valuenow={miles}
          aria-valuetext={t("milesValue", { n: miles })}
          className="radius-slider mt-2"
          style={{ ["--radius-pct" as string]: `${pct}%` }}
        />
        <div className="mt-1 flex justify-between text-sm tabular-nums text-subtle">
          <span>
            {MILES_MIN} {t("mi")}
          </span>
          <span>
            {MILES_MAX} {t("mi")}
          </span>
        </div>

        <Separator className="my-5" />

        <WheelEditor />

        <Separator className="my-5" />
        <div className="rounded-md bg-well p-4">
          <p className="font-display text-lg tracking-tight">
            {proUnlocked ? t("proOn") : t("proName")}
          </p>
          <p className="mt-1 text-sm text-muted">{t("proBlurb")}</p>
          {!proUnlocked ? (
            <Button asChild variant="chili" size="sm" className="mt-3">
              <Link to="/pro" onClick={() => onOpenChange(false)}>
                {t("seePro")}
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
