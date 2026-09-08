import { useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin, Search, X } from "lucide-react";
import { geocodeCity, reverseGeocode } from "@/lib/api";
import { QUICK_CITIES } from "@/lib/cities";
import { useBite } from "@/lib/store";
import { useT } from "@/lib/use-t";
import type { GeocodeHit } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LocationSheet({ open, onOpenChange }: Props) {
  const setLocation = useBite((s) => s.setLocation);
  const current = useBite((s) => s.location);
  const t = useT();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<GeocodeHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoBusy, setGeoBusy] = useState(false);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    if (!open) {
      setHits([]);
      setSearching(false);
      setGeoError(null);
      return;
    }
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      return;
    }
    let live = true;
    const t = window.setTimeout(async () => {
      setSearching(true);
      try {
        const next = await geocodeCity({ data: { query: q } });
        if (live) setHits(next);
      } catch {
        if (live) setHits([]);
      } finally {
        if (live) setSearching(false);
      }
    }, 280);
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, [query, open]);

  const pick = (hit: GeocodeHit) => {
    setLocation({ lat: hit.lat, lon: hit.lon, label: hit.label });
    onOpenChange(false);
  };

  const useGps = () => {
    if (!navigator.geolocation) {
      setGeoError(t("gpsUnavailable"));
      return;
    }
    setGeoBusy(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (!openRef.current) {
          setGeoBusy(false);
          return;
        }
        try {
          const hit = await reverseGeocode({
            data: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          });
          if (!openRef.current) {
            setGeoBusy(false);
            return;
          }
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            label: hit?.label ?? t("currentLocation"),
          });
          onOpenChange(false);
        } catch {
          if (!openRef.current) {
            setGeoBusy(false);
            return;
          }
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            label: t("currentLocation"),
          });
          onOpenChange(false);
        } finally {
          setGeoBusy(false);
        }
      },
      () => {
        setGeoBusy(false);
        if (openRef.current) setGeoError(t("gpsFail"));
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  };

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
        aria-label={t("closeLocation")}
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-labelledby="loc-title"
        className="relative z-10 flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-xl border border-border bg-surface p-5 shadow-[var(--shadow-lift)] sm:rounded-xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
              {t("tablesNearby")}
            </p>
            <h2 id="loc-title" className="font-display mt-1 text-2xl tracking-tight">
              {t("whereEating")}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label={t("close")}>
            <X />
          </Button>
        </div>

        <Button variant="paper" className="w-full" onClick={useGps} disabled={geoBusy}>
          <LocateFixed />
          {geoBusy ? t("findingYou") : t("useMyLocation")}
        </Button>
        {geoError ? <p className="mt-2 text-sm text-accent">{geoError}</p> : null}

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchCity")}
            className="pl-10"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>

        {searching ? (
          <p className="mt-3 text-sm text-muted">{t("searching")}</p>
        ) : hits.length > 0 ? (
          <ul className="mt-3 max-h-48 overflow-auto rounded-md border border-border">
            {hits.map((h) => (
              <li key={`${h.lat}-${h.lon}-${h.label}`}>
                <button
                  type="button"
                  onClick={() => pick(h)}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm hover:bg-raised"
                >
                  <MapPin className="size-4 text-muted" />
                  {h.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
          {t("jumpCity")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK_CITIES.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => pick(c)}
              className={cn(
                "h-10 rounded-full border px-3.5 text-sm transition-colors duration-150",
                current?.label === c.label
                  ? "border-accent bg-accent/15 text-fg"
                  : "border-hairline text-muted hover:border-fg/30 hover:text-fg",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}