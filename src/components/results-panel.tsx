import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { RotateCcw, Sparkles } from "lucide-react";
import { recordSeenPlaces } from "@/lib/account";
import { askBite } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { chainsForCuisine } from "@/lib/chains";
import { PRICING } from "@/lib/monetize";
import { useBite } from "@/lib/store";
import { cuisineKicker, cuisineName } from "@/lib/i18n";
import { useT } from "@/lib/use-t";
import type { Cuisine } from "@/lib/cuisines";
import type { Place } from "@/lib/types";
import { AdCard } from "@/components/ad-card";
import { RestaurantCard } from "@/components/restaurant-card";
import { Button } from "@/components/ui/button";

type Props = {
  cuisine: Cuisine;
  nearby: Place[];
  loading: boolean;
  source: "overpass" | "fallback" | "google" | "yelp" | null;
  onSpinAgain: () => void;
};

export function ResultsPanel({ cuisine, nearby, loading, source, onSpinAgain }: Props) {
  const location = useBite((s) => s.location);
  const hideAds = useBite((s) => s.hideAds);
  const proUnlocked = useBite((s) => s.proUnlocked);
  const cacheBookmark = useBite((s) => s.cacheBookmark);
  const locale = useBite((s) => s.locale);
  const t = useT();
  const city = location?.label ?? "";
  const cuisineLabel = cuisineName(locale, cuisine.id, cuisine.label);
  const cuisineKick = cuisineKicker(locale, cuisine.id, cuisine.kicker);
  const user = useCurrentUser();
  const partners = chainsForCuisine(cuisine.id, city, cuisine.label).filter(
    (p) => !nearby.some((n) => n.name.toLowerCase() === p.name.toLowerCase()),
  );
  const featured = nearby[0] ? { ...nearby[0], featured: true } : null;
  const restNearby = nearby.slice(featured ? 1 : 0);
  const [advice, setAdvice] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);

  useEffect(() => {
    if (loading || nearby.length === 0) return;
    const places = nearby.slice(0, 8).map((p) => ({
      placeId: p.id,
      name: p.name,
      city,
      address: p.address,
      cuisine: p.cuisineTags[0] ?? cuisine.label,
      lat: p.lat,
      lon: p.lon,
      website: p.website,
      phone: p.phone,
    }));
    for (const p of places) cacheBookmark(p);
    if (!user) return;
    void recordSeenPlaces({
      data: {
        city,
        cuisine: cuisine.label,
        places,
      },
    }).catch(() => {
      /* guest or network */
    });
  }, [user?.id, loading, nearby, city, cuisine.label, cacheBookmark]);

  const handleAsk = async () => {
    if (!proUnlocked) return;
    setAsking(true);
    setAskError(null);
    try {
      const names = [
        featured?.name,
        ...restNearby.map((p) => p.name),
        ...partners.map((p) => p.name),
      ]
        .filter(Boolean)
        .map((name) => {
          const hit = [featured, ...restNearby].find((p) => p?.name === name);
          if (!hit?.rating) return name as string;
          const n = hit.ratingCount ? `, ${hit.ratingCount} reviews` : "";
          return `${name} (${hit.rating.toFixed(1)}${n})`;
        }) as string[];
      const res = await askBite({
        data: { cuisine: cuisine.label, city, names },
      });
      if (res.ok) setAdvice(res.text);
      else setAskError(res.error);
    } catch {
      setAskError(t("askBusy"));
    } finally {
      setAsking(false);
    }
  };

  return (
    <section className="stagger-in mx-auto w-full max-w-3xl px-4 pb-24 pt-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
        {t("tonightMenu")}
      </p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
          {cuisineLabel}
          <span className="block text-xl italic text-muted sm:text-2xl">{cuisineKick}</span>
        </h2>
        <Button variant="outline" onClick={onSpinAgain}>
          <RotateCcw />
          {t("spinAgain")}
        </Button>
      </div>

      {proUnlocked ? (
        <div className="mt-5 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
              {t("justAsk")}
            </p>
            <Button variant="ghost" size="sm" onClick={handleAsk} disabled={asking || loading}>
              <Sparkles />
              {asking ? t("thinking") : t("pickForMe")}
            </Button>
          </div>
          {advice ? <p className="mt-2 text-sm leading-relaxed text-fg">{advice}</p> : null}
          {askError ? <p className="mt-2 text-sm text-accent">{askError}</p> : null}
          {!advice && !askError ? (
            <p className="mt-2 text-sm text-muted">{t("askHint")}</p>
          ) : null}
        </div>
      ) : (
        <Link
          to="/pro"
          className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 hover:bg-raised"
        >
          <span className="text-sm text-muted">
            {t("askUpsellLead")} <span className="text-fg">{t("askUpsell")}</span>
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
            ${PRICING.pro.price}
          </span>
        </Link>
      )}

      {loading ? (
        <div className="mt-6 space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          {source === "google" ? (
            <p className="mt-5 text-xs text-subtle">
              <a href="https://www.google.com/maps" target="_blank" rel="noreferrer">
                {t("ratingsByGoogle")}
              </a>
            </p>
          ) : null}
          {source === "yelp" ? (
            <p className="mt-5 text-xs text-subtle">
              <a href="https://www.yelp.com" target="_blank" rel="noreferrer">
                {t("ratingsByYelp")}
              </a>
            </p>
          ) : null}
          {featured ? (
            <div className={source === "google" || source === "yelp" ? "mt-3" : "mt-6"}>
              <RestaurantCard place={featured} city={city} index={1} />
            </div>
          ) : null}

          {!hideAds ? (
            <div className="mt-4">
              <AdCard cuisine={cuisineLabel} />
            </div>
          ) : null}

          {restNearby.length > 0 ? (
            <div className="mt-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
                {source === "google" || source === "yelp"
                  ? t("nearbyRated")
                  : source === "overpass"
                    ? t("nearbyOsm")
                    : t("nearbyLocal")}
              </p>
              <div className="mt-3 space-y-3">
                {restNearby.map((p, i) => (
                  <RestaurantCard key={p.id} place={p} city={city} index={i + 2} />
                ))}
              </div>
            </div>
          ) : !loading && location ? (
            <p className="mt-6 text-sm text-muted">
              {t("noKitchens", { cuisine: cuisineLabel })}
            </p>
          ) : !location ? (
            <p className="mt-6 text-sm text-muted">{t("setCityResults")}</p>
          ) : null}

          {partners.length > 0 ? (
            <div className="mt-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
                {t("orderNow")}
              </p>
              <p className="mt-1 text-sm text-muted">{t("commissionShort")}</p>
              <div className="mt-3 space-y-3">
                {partners.map((p, i) => (
                  <RestaurantCard
                    key={p.id}
                    place={p}
                    city={city}
                    index={(featured ? 1 : 0) + restNearby.length + i + 1}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function SkeletonCard() {
  return (
    <div className="h-40 animate-pulse rounded-lg border border-border bg-surface">
      <div className="h-full w-full rounded-lg bg-raised/60" />
    </div>
  );
}
