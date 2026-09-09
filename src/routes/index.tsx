import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { LocationSheet } from "@/components/location-sheet";
import { ResultsPanel } from "@/components/results-panel";
import { SettingsSheet } from "@/components/settings-sheet";
import { SpinWheel } from "@/components/spin-wheel";
import { searchPlaces } from "@/lib/api";
import type { WheelSlice } from "@/lib/cuisines";
import { cuisineKicker, cuisineName } from "@/lib/i18n";
import { useBite } from "@/lib/store";
import { useT } from "@/lib/use-t";
import type { Place } from "@/lib/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const wheel = useBite((s) => s.wheel);

  const [locOpen, setLocOpen] = useState(false);
  const [setOpen, setSetOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelSlice | null>(null);
  const [nearby, setNearby] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"overpass" | "fallback" | "google" | "yelp" | null>(null);
  const spinSeq = useRef(0);

  const beginSpin = () => {
    spinSeq.current += 1;
    setSpinning(true);
    setWinner(null);
    setNearby([]);
    setSource(null);
  };

  const finishSpin = async (cuisine: WheelSlice) => {
    const seq = spinSeq.current;
    setWinner(cuisine);
    setSpinning(false);
    const loc = useBite.getState().location;
    const radius = useBite.getState().radiusMeters;
    if (!loc) {
      if (seq === spinSeq.current) {
        setSource("fallback");
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    try {
      const res = await searchPlaces({
        data: {
          lat: loc.lat,
          lon: loc.lon,
          cuisineId: cuisine.id,
          osm: cuisine.osm,
          radiusMeters: radius,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          city: loc.label,
          bbox: loc.bbox ?? null,
        },
      });
      if (seq !== spinSeq.current) return;
      setNearby(res.nearby);
      setSource(res.source);
    } catch {
      if (seq !== spinSeq.current) return;
      setNearby([]);
      setSource("fallback");
    } finally {
      if (seq === spinSeq.current) setLoading(false);
    }
  };

  return (
    <div className="relative min-page bg-bg">
      <div className="paper-grain pointer-events-none fixed inset-0 opacity-[0.035]" />
      <AppHeader onLocation={() => setLocOpen(true)} onSettings={() => setSetOpen(true)} />

      <main className="relative">
        <Hero
          cuisines={wheel}
          spinning={spinning}
          winner={winner}
          onNeedLocation={() => setLocOpen(true)}
          onCustomize={() => setSetOpen(true)}
          onSpinStart={beginSpin}
          onSpin={(c) => {
            void finishSpin(c);
          }}
        />

        {winner && !spinning ? (
          <ResultsPanel
            cuisine={winner}
            nearby={nearby}
            loading={loading}
            source={source}
            onSpinAgain={() => {
              spinSeq.current += 1;
              setWinner(null);
              setNearby([]);
              setSource(null);
              setLoading(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : null}
      </main>

      <LocationSheet open={locOpen} onOpenChange={setLocOpen} />
      <SettingsSheet open={setOpen} onOpenChange={setSetOpen} />
    </div>
  );
}

function Hero({
  cuisines,
  spinning,
  winner,
  onSpin,
  onSpinStart,
  onNeedLocation,
  onCustomize,
}: {
  cuisines: WheelSlice[];
  spinning: boolean;
  winner: WheelSlice | null;
  onSpin: (c: WheelSlice) => void;
  onSpinStart: () => void;
  onNeedLocation: () => void;
  onCustomize: () => void;
}) {
  const location = useBite((s) => s.location);
  const locale = useBite((s) => s.locale);
  const t = useT();
  const compact = Boolean(winner) && !spinning;
  const labeled = cuisines.map((c) => ({
    ...c,
    label: c.custom ? c.label : cuisineName(locale, c.id, c.label),
    kicker: c.custom ? t("yours") : cuisineKicker(locale, c.id, c.kicker),
  }));

  return (
    <section className={compact ? "border-b border-border pb-8 pt-6" : "pb-4 pt-8 sm:pt-12"}>
      <div className="mx-auto max-w-3xl px-4 text-center">
        {!compact ? (
          <>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
              {t("cantDecide")}
            </p>
            <h1 className="font-display mx-auto mt-3 max-w-[16ch] text-[2.6rem] leading-[1.05] tracking-tight sm:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
              {t("heroSub")}
            </p>
            <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-subtle">
              <span className="font-medium uppercase tracking-[0.16em] text-accent">{t("warning")}</span>
              {" — "}
              {t("warningBody")}
            </p>
          </>
        ) : (
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-subtle">
            {t("wheelRests")}
          </p>
        )}

        <div className={compact ? "mt-5" : "mt-8"}>
          <SpinWheel
            cuisines={labeled}
            spinning={spinning}
            winningId={winner?.id ?? null}
            onSpinStart={onSpinStart}
            onSpin={(c) => onSpin(cuisines.find((x) => x.id === c.id) ?? c)}
          />
        </div>

        <button
          type="button"
          onClick={onCustomize}
          className="mx-auto mt-5 flex h-11 items-center gap-2 rounded-full border border-hairline px-4 text-sm text-muted transition-colors duration-150 hover:border-fg/30 hover:text-fg"
        >
          <Pencil className="size-3.5" />
          {t("customizeWheel")}
        </button>

        {!location && !compact ? (
          <button
            type="button"
            onClick={onNeedLocation}
            className="mt-3 text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
          >
            {t("setCityHint")}
          </button>
        ) : null}
      </div>
    </section>
  );
}
