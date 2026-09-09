import { ExternalLink, Heart, MapPinned, Phone, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toggleStar } from "@/lib/account";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { mapsDirectionsUrl, mapsPlaceUrl, orderLinks } from "@/lib/monetize";
import { formatMiles } from "@/lib/geo";
import { compactHours, isOpenAt, localClock } from "@/lib/hours";
import { useBite } from "@/lib/store";
import { useT } from "@/lib/use-t";
import type { Place } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  place: Place;
  city: string;
  index?: number;
};

export function RestaurantCard({ place, city, index }: Props) {
  const favorites = useBite((s) => s.favorites);
  const toggleFavorite = useBite((s) => s.toggleFavorite);
  const cacheBookmark = useBite((s) => s.cacheBookmark);
  const t = useT();
  const { user, isPending } = useCurrentUserState();
  const loved = favorites.includes(place.id);
  const orders = orderLinks(place.name, city);
  const maps =
    place.lat != null && place.lon != null
      ? mapsDirectionsUrl(place.lat, place.lon, place.name)
      : mapsPlaceUrl(place.name, city);
  const openNow =
    place.openNow ?? (place.hours ? isOpenAt(place.hours, localClock()) : null);
  const hours = compactHours(place.hours);

  const bookmark = {
    placeId: place.id,
    name: place.name,
    city,
    address: place.address,
    cuisine: place.cuisineTags[0] ?? null,
    lat: place.lat,
    lon: place.lon,
    website: place.website,
    phone: place.phone,
  };

  const onStar = () => {
    if (isPending) return;
    const next = !loved;
    toggleFavorite(place.id);
    cacheBookmark(bookmark);
    if (!user) return;
    void toggleStar({
      data: {
        ...bookmark,
        starred: next,
      },
    }).catch(() => {
      toggleFavorite(place.id);
    });
  };

  return (
    <article
      className={cn(
        "rounded-lg border bg-surface p-4",
        place.featured ? "border-accent/50" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {index != null ? (
              <span className="font-display text-lg leading-none text-subtle tabular-nums">
                {String(index).padStart(2, "0")}
              </span>
            ) : null}
            {place.featured ? <Badge variant="chili">{t("tonightsTable")}</Badge> : null}
            {place.source === "chain" ? <Badge>{t("deliveryPartner")}</Badge> : null}
            {place.source === "partner" ? <Badge variant="chili">{t("featured")}</Badge> : null}
            {openNow === true ? <Badge variant="chili">{t("openNow")}</Badge> : null}
            {openNow === false ? <Badge>{t("closedNow")}</Badge> : null}
          </div>
          <h3 className="font-display mt-1 truncate text-xl tracking-tight">{place.name}</h3>
          <RatingRow place={place} />
          <p className="mt-1 text-sm text-muted">
            {[
              formatMiles(place.distanceMiles, t("mi")),
              place.address,
              place.blurb,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {hours ? <p className="mt-1 text-xs text-subtle">{hours}</p> : null}
          {place.cuisineTags.length > 0 ? (
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-subtle">
              {place.cuisineTags.join(" · ")}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onStar}
          className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted hover:bg-raised hover:text-accent"
          aria-label={loved ? t("unsaveTable") : t("saveTable")}
        >
          <Heart className={cn("size-5", loved && "fill-accent text-accent")} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <OrderButton href={orders.doordash} label="DoorDash" />
        <OrderButton href={orders.ubereats} label="Uber Eats" />
        <OrderButton href={orders.grubhub} label="Grubhub" />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href={maps} target="_blank" rel="noreferrer">
            <MapPinned />
            {t("directions")}
          </a>
        </Button>
        {place.website ? (
          <Button variant="ghost" size="sm" asChild>
            <a href={place.website} target="_blank" rel="noreferrer">
              <ExternalLink />
              {t("site")}
            </a>
          </Button>
        ) : null}
        {place.phone ? (
          <Button variant="ghost" size="sm" asChild>
            <a href={`tel:${place.phone.replace(/\s+/g, "")}`}>
              <Phone />
              {t("call")}
            </a>
          </Button>
        ) : null}
      </div>
      {!isPending && !user && loved ? (
        <p className="mt-3 text-xs text-muted">
          {t("savedDevice")}{" "}
          <Link to="/login" className="text-fg underline-offset-4 hover:underline">
            {t("signInKeep")}
          </Link>
        </p>
      ) : null}
    </article>
  );
}

function RatingRow({ place }: { place: Place }) {
  const t = useT();
  if (place.rating == null && !place.priceLevel) return null;
  const dollars =
    place.priceLevel && place.priceLevel > 0
      ? "$".repeat(Math.min(4, Math.round(place.priceLevel)))
      : null;
  return (
    <p className="mt-1 flex flex-wrap items-center gap-2 text-sm">
      {place.rating != null ? (
        <span className="inline-flex items-center gap-1.5">
          <Stars value={place.rating} />
          <span className="font-medium tabular-nums text-fg">{place.rating.toFixed(1)}</span>
          {place.ratingCount != null && place.ratingCount > 0 ? (
            <span className="text-subtle">({t("reviewCount", { n: place.ratingCount })})</span>
          ) : null}
        </span>
      ) : null}
      {dollars ? <span className="text-muted">{dollars}</span> : null}
    </p>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-px" aria-label={`${value.toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.min(1, Math.max(0, value - i));
        return (
          <span key={i} className="relative size-3.5 shrink-0">
            <Star className="size-3.5 text-hairline" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="size-3.5 fill-accent text-accent" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function OrderButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer sponsored"
      className="flex h-11 items-center justify-center rounded-md bg-accent text-center text-xs font-semibold tracking-wide text-accent-fg transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.96]"
    >
      {label}
    </a>
  );
}
