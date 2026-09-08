import { useEffect, useMemo, useRef, useState } from "react";
import type { WheelSlice } from "@/lib/cuisines";
import { useT } from "@/lib/use-t";
import { cn } from "@/lib/utils";

type Props = {
  cuisines: WheelSlice[];
  spinning: boolean;
  winningId: string | null;
  onSpinStart?: () => void;
  onSpin: (cuisine: WheelSlice) => void;
  disabled?: boolean;
};

function n(value: number) {
  return Math.round(value * 100) / 100;
}

type Geom = {
  cuisine: WheelSlice;
  start: number;
  end: number;
  mid: number;
  size: number;
  i: number;
};

function layoutSlices(cuisines: WheelSlice[]): Geom[] {
  const total = cuisines.reduce((sum, c) => sum + Math.max(1, c.weight ?? 1), 0) || 1;
  let acc = 0;
  return cuisines.map((c, i) => {
    const size = (Math.max(1, c.weight ?? 1) / total) * 360;
    const start = acc;
    const end = acc + size;
    acc = end;
    return { cuisine: c, start, end, mid: start + size / 2, size, i };
  });
}

function pickWeightedIndex(cuisines: WheelSlice[]): number {
  const total = cuisines.reduce((sum, c) => sum + Math.max(1, c.weight ?? 1), 0);
  let r = Math.random() * total;
  for (let i = 0; i < cuisines.length; i++) {
    r -= Math.max(1, cuisines[i].weight ?? 1);
    if (r <= 0) return i;
  }
  return cuisines.length - 1;
}

export function SpinWheel({
  cuisines,
  spinning,
  winningId,
  onSpinStart,
  onSpin,
  disabled,
}: Props) {
  const [rotation, setRotation] = useState(0);
  const [nudge, setNudge] = useState(0);
  const [busy, setBusy] = useState(false);
  const t = useT();
  const reduced = usePrefersReducedMotion();
  const liveRef = useRef<HTMLParagraphElement>(null);
  const timerRef = useRef<number | null>(null);
  const count = Math.max(cuisines.length, 1);
  const locked = spinning || busy || disabled || cuisines.length < 3;
  const geoms = useMemo(() => layoutSlices(cuisines), [cuisines]);

  const spin = () => {
    if (locked) return;
    const index = pickWeightedIndex(cuisines);
    const picked = cuisines[index];
    const geom = geoms[index];
    const jitter = (Math.random() - 0.5) * Math.max(geom.size - 8, 2);
    const targetMod = (360 - (geom.mid + jitter) + 360) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    let delta = targetMod - currentMod;
    if (delta < 0) delta += 360;
    const extra = 5 + Math.floor(Math.random() * 3);
    const next = rotation + extra * 360 + delta;

    setBusy(true);
    onSpinStart?.();

    if (reduced) {
      setRotation(targetMod);
      setBusy(false);
      onSpin(picked);
      return;
    }

    setRotation(next);
    setNudge((k) => k + 1);
    if (timerRef.current != null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setBusy(false);
      onSpin(picked);
    }, 4200);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!winningId || !liveRef.current) return;
    const label = cuisines.find((c) => c.id === winningId)?.label;
    if (label) liveRef.current.textContent = t("tonightLive", { label });
  }, [winningId, cuisines, t]);

  const slices = useMemo(() => {
    return geoms.map((g) => ({
      ...g,
      win: winningId === g.cuisine.id && !spinning && !busy,
    }));
  }, [geoms, winningId, spinning, busy]);

  return (
    <div className="relative mx-auto w-full max-w-[22.5rem] sm:max-w-[24.5rem]">
      <p ref={liveRef} className="sr-only" aria-live="polite" />
      <div className="relative aspect-square">
        <div className="pointer-events-none absolute left-1/2 top-[-6px] z-20" key={nudge}>
          <svg
            width="28"
            height="34"
            viewBox="0 0 28 34"
            className={cn("-translate-x-1/2", nudge > 0 && "pointer-live")}
            style={{ transformOrigin: "14px 8px" }}
          >
            <path d="M14 32 L2 4 H26 Z" fill="var(--color-accent)" />
            <circle cx="14" cy="8" r="2.2" fill="var(--color-bg)" />
          </svg>
        </div>

        <div className="absolute inset-0 rounded-full bg-well shadow-[var(--shadow-well)] ring-1 ring-hairline" />

        <div
          className="absolute inset-[10px] overflow-hidden rounded-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: reduced ? "none" : "transform 4.2s cubic-bezier(0.12, 0.78, 0.08, 1)",
            willChange: busy ? "transform" : undefined,
          }}
        >
          <svg viewBox="0 0 200 200" className="size-full">
            {slices.map((s) => {
              const d = slicePath(100, 100, 100, s.start, s.end);
              const pos = polar(100, 100, 64, s.mid);
              const flip = s.mid > 90 && s.mid < 270;
              const tx = n(pos.x);
              const ty = n(pos.y);
              const showLabel = s.size >= 18;
              return (
                <g key={s.cuisine.id}>
                  <path
                    d={d}
                    fill={
                      s.win
                        ? "var(--color-win)"
                        : s.i % 2 === 0
                          ? "var(--color-slice-a)"
                          : "var(--color-slice-b)"
                    }
                    stroke="var(--color-border)"
                    strokeWidth="0.6"
                  />
                  {s.win ? <path d={d} fill="var(--color-accent)" opacity="0.16" /> : null}
                  {showLabel ? (
                    <text
                      x={tx}
                      y={ty}
                      fill={s.win ? "var(--color-fg)" : "var(--color-muted)"}
                      fontSize={count > 10 || s.size < 28 ? 6.8 : 8.2}
                      fontFamily="Figtree, sans-serif"
                      fontWeight={600}
                      letterSpacing="0.08em"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${n(s.mid + (flip ? 180 : 0))} ${tx} ${ty})`}
                    >
                      {s.cuisine.label.toUpperCase()}
                    </text>
                  ) : null}
                </g>
              );
            })}
            <circle cx="100" cy="100" r="28" fill="var(--color-bg)" />
            <circle
              cx="100"
              cy="100"
              r="28"
              fill="none"
              stroke="var(--color-hairline)"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        <button
          type="button"
          onClick={spin}
          disabled={locked}
          className={cn(
            "absolute left-1/2 top-1/2 z-10 flex size-[5.4rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full",
            "bg-accent text-accent-fg shadow-[0_10px_28px_rgb(232_93_76_/_0.38)]",
            "transition-[transform,filter] duration-150 ease-out",
            "hover:brightness-110 active:scale-[0.96]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/70",
            "disabled:opacity-50 disabled:shadow-none",
          )}
          aria-label={busy || spinning ? t("spinningAria") : t("spinAria")}
        >
          <span className="font-display text-lg leading-none tracking-tight">
            {busy || spinning ? "..." : t("spin")}
          </span>
          {busy || spinning ? null : (
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-accent-fg/80">
              {t("tonight")}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: n(cx + r * Math.cos(rad)), y: n(cy + r * Math.sin(rad)) };
}

function slicePath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, end);
  const e = polar(cx, cy, r, start);
  const large = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y} Z`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
