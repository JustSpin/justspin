import { useEffect, useState } from "react";
import { detectLocale, htmlLang, isLocale } from "@/lib/i18n";
import { getMyAccount, recordSeenPlaces, toggleStar } from "@/lib/account";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useBite } from "@/lib/store";
import type { PlaceBookmark } from "@/lib/types";

/** Push this device's guest hearts, then return the account snapshot. */
export async function hydrateAccount(userId: string) {
  const { bookmarks, favorites, accountId } = useBite.getState();
  const guestDevice = !accountId;
  if (guestDevice) {
    const starred = bookmarks.filter((b) => favorites.includes(b.placeId));
    for (const b of starred) {
      await toggleStar({ data: { ...b, starred: true } });
    }
    if (bookmarks.length > 0) {
      await recordSeenPlaces({
        data: {
          city: bookmarks[0]?.city ?? "",
          cuisine: bookmarks[0]?.cuisine ?? "",
          places: bookmarks,
        },
      });
    }
  } else if (accountId !== userId) {
    // Different person on this device — don't copy their tables over.
    useBite.getState().clearSessionLocal();
  }
  return getMyAccount();
}

/** Pull starred ids and Pro from the account once a session exists. */
export function AccountSync() {
  const { user, isPending } = useCurrentUserState();
  const setFavorites = useBite((s) => s.setFavorites);
  const setProUnlocked = useBite((s) => s.setProUnlocked);
  const setAccountId = useBite((s) => s.setAccountId);
  const setBookmarks = useBite((s) => s.setBookmarks);
  const clearSessionLocal = useBite((s) => s.clearSessionLocal);
  const [ready, setReady] = useState(false);
  const locale = useBite((s) => s.locale);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = htmlLang(isLocale(locale) ? locale : "en");
  }, [locale]);

  useEffect(() => {
    let live = true;
    void Promise.resolve(useBite.persist.rehydrate()).finally(() => {
      if (!live) return;
      const state = useBite.getState();
      if (!state.localePicked) {
        const guessed = detectLocale();
        if (guessed !== state.locale) state.setLocale(guessed);
        else useBite.setState({ localePicked: true });
      }
      const loc = useBite.getState().locale;
      if (typeof document !== "undefined") {
        document.documentElement.lang = htmlLang(isLocale(loc) ? loc : "en");
      }
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || isPending) return;
    if (!user) {
      if (useBite.getState().accountId) clearSessionLocal();
      else setProUnlocked(false);
      return;
    }
    let live = true;
    hydrateAccount(user.id)
      .then((data) => {
        if (!live) return;
        setFavorites(data.starred.map((p) => p.placeId));
        setProUnlocked(data.isPro);
        setAccountId(user.id);
        const seen = new Set<string>();
        const merged: PlaceBookmark[] = [];
        for (const p of [...data.starred, ...data.recent]) {
          if (seen.has(p.placeId)) continue;
          seen.add(p.placeId);
          merged.push({
            placeId: p.placeId,
            name: p.name,
            city: p.city,
            address: p.address,
            cuisine: p.cuisine,
            lat: p.lat,
            lon: p.lon,
            website: p.website,
            phone: p.phone,
          });
        }
        setBookmarks(merged);
      })
      .catch(() => {
        /* signed-out race or network — keep local */
      });
    return () => {
      live = false;
    };
  }, [
    ready,
    user?.id,
    isPending,
    setFavorites,
    setProUnlocked,
    setAccountId,
    setBookmarks,
    clearSessionLocal,
  ]);

  return null;
}