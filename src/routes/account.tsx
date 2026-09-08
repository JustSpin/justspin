import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MapPinned } from "lucide-react";
import { toggleStar, type SavedPlace } from "@/lib/account";
import { hydrateAccount } from "@/components/account-sync";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { mapsPlaceUrl } from "@/lib/monetize";
import { useBite } from "@/lib/store";
import { PageChrome } from "@/components/page-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/use-t";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const setFavorites = useBite((s) => s.setFavorites);
  const setProUnlocked = useBite((s) => s.setProUnlocked);
  const t = useT();
  const [starred, setStarred] = useState<SavedPlace[]>([]);
  const [recent, setRecent] = useState<SavedPlace[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isPending || !user) return;
    let live = true;
    setLoading(true);
    hydrateAccount(user.id)
      .then((data) => {
        if (!live) return;
        setStarred(data.starred);
        setRecent(data.recent);
        setIsPro(data.isPro);
        setFavorites(data.starred.map((p) => p.placeId));
        setProUnlocked(data.isPro);
      })
      .catch(() => {
        if (!live) return;
        setStarred([]);
        setRecent([]);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [user?.id, isPending, setFavorites, setProUnlocked]);

  const unstar = async (place: SavedPlace) => {
    setStarred((cur) => cur.filter((p) => p.placeId !== place.placeId));
    setRecent((cur) =>
      cur.map((p) => (p.placeId === place.placeId ? { ...p, starred: false } : p)),
    );
    setFavorites(useBite.getState().favorites.filter((id) => id !== place.placeId));
    try {
      await toggleStar({
        data: {
          placeId: place.placeId,
          name: place.name,
          city: place.city,
          address: place.address,
          cuisine: place.cuisine,
          lat: place.lat,
          lon: place.lon,
          website: place.website,
          phone: place.phone,
          starred: false,
        },
      });
    } catch {
      /* keep optimistic UI */
    }
  };

  const star = async (place: SavedPlace) => {
    setStarred((cur) => (cur.some((p) => p.placeId === place.placeId) ? cur : [{ ...place, starred: true }, ...cur]));
    setRecent((cur) =>
      cur.map((p) => (p.placeId === place.placeId ? { ...p, starred: true } : p)),
    );
    const ids = useBite.getState().favorites;
    if (!ids.includes(place.placeId)) setFavorites([...ids, place.placeId]);
    try {
      await toggleStar({
        data: {
          placeId: place.placeId,
          name: place.name,
          city: place.city,
          address: place.address,
          cuisine: place.cuisine,
          lat: place.lat,
          lon: place.lon,
          website: place.website,
          phone: place.phone,
          starred: true,
        },
      });
    } catch {
      /* keep optimistic UI */
    }
  };

  if (!mounted || isPending) {
    return (
      <PageChrome kicker={t("backWheel")}>
        <main className="mx-auto max-w-3xl px-4 py-10">
          <div className="h-10 w-48 animate-pulse rounded-md bg-raised" />
        </main>
      </PageChrome>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <PageChrome kicker="Back to the wheel">
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          {t("account")}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-4xl tracking-tight">{t("yourTables")}</h1>
          <UserButton />
        </div>
        <p className="mt-2 text-sm text-muted">
          {user.primaryEmail ?? user.displayName}
          {isPro ? " · Pro" : ""}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild variant={isPro ? "outline" : "chili"} size="sm">
            <Link to="/pro">{isPro ? t("managePro") : t("upgradePro")}</Link>
          </Button>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-2xl tracking-tight">{t("starred")}</h2>
          <p className="mt-1 text-sm text-muted">{t("starredBlurb")}</p>
          {loading ? (
            <p className="mt-4 text-sm text-subtle">{t("loading")}</p>
          ) : starred.length === 0 ? (
            <p className="mt-4 text-sm text-muted">{t("starredEmpty")}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {starred.map((p) => (
                <SavedRow key={p.placeId} place={p} onToggleStar={() => void unstar(p)} />
              ))}
            </ul>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl tracking-tight">{t("recentSpins")}</h2>
          <p className="mt-1 text-sm text-muted">{t("recentBlurb")}</p>
          {loading ? (
            <p className="mt-4 text-sm text-subtle">{t("loading")}</p>
          ) : recent.length === 0 ? (
            <p className="mt-4 text-sm text-muted">{t("recentEmpty")}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recent.map((p) => (
                <SavedRow
                  key={`r-${p.placeId}`}
                  place={p}
                  onToggleStar={() => void (p.starred ? unstar(p) : star(p))}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </PageChrome>
  );
}

function SavedRow({
  place,
  onToggleStar,
}: {
  place: SavedPlace;
  onToggleStar?: () => void;
}) {
  const maps = mapsPlaceUrl(place.name, place.city);
  return (
    <li className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display truncate text-xl tracking-tight">{place.name}</h3>
          {place.starred ? <Badge variant="chili">Starred</Badge> : null}
        </div>
        <p className="mt-1 text-sm text-muted">
          {[place.city, place.address, place.cuisine].filter(Boolean).join(" · ")}
        </p>
      </div>
      <div className="flex shrink-0 gap-1">
        {onToggleStar ? (
          <button
            type="button"
            onClick={onToggleStar}
            className="flex size-11 items-center justify-center rounded-md text-muted hover:bg-raised hover:text-accent"
            aria-label={place.starred ? "Remove star" : "Star this table"}
          >
            <Heart className={cn("size-5", place.starred && "fill-accent text-accent")} />
          </button>
        ) : null}
        <Button variant="ghost" size="icon" asChild>
          <a href={maps} target="_blank" rel="noreferrer" aria-label="Directions">
            <MapPinned />
          </a>
        </Button>
      </div>
    </li>
  );
}
