import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ALL_CUISINES,
  DEFAULT_CUISINE_IDS,
  MAX_SLICES,
  MIN_SLICES,
  cuisineById,
  defaultWheel,
  guessOsm,
  slugLabel,
  toSlice,
  wheelFromIds,
  type WheelSlice,
} from "./cuisines";
import { isLocale, type Locale } from "./i18n";
import type { GeoLocation, PlaceBookmark } from "./types";
import { safeLocalStorage } from "./browser";

type BiteState = {
  location: GeoLocation | null;
  wheel: WheelSlice[];
  radiusMeters: number;
  favorites: string[];
  bookmarks: PlaceBookmark[];
  accountId: string | null;
  locale: Locale;
  localePicked: boolean;
  proUnlocked: boolean;
  hideAds: boolean;
  setLocation: (location: GeoLocation | null) => void;
  addSlice: (id: string) => void;
  addCustom: (label: string) => boolean;
  removeSlice: (id: string) => void;
  moveSlice: (id: string, dir: -1 | 1) => void;
  setWeight: (id: string, weight: number) => void;
  renameSlice: (id: string, label: string) => void;
  applyPreset: (ids: string[]) => void;
  resetWheel: () => void;
  setRadiusMeters: (n: number) => void;
  toggleFavorite: (id: string) => void;
  setFavorites: (ids: string[]) => void;
  cacheBookmark: (place: PlaceBookmark) => void;
  setBookmarks: (places: PlaceBookmark[]) => void;
  setAccountId: (id: string | null) => void;
  setLocale: (locale: Locale) => void;
  clearSessionLocal: () => void;
  setProUnlocked: (on: boolean) => void;
};

export const useBite = create<BiteState>()(
  persist(
    (set, get) => ({
      location: null,
      wheel: defaultWheel(),
      radiusMeters: 8046,
      favorites: [],
      bookmarks: [],
      accountId: null,
      locale: "en",
      localePicked: false,
      proUnlocked: false,
      hideAds: false,
      setLocation: (location) => set({ location }),
      addSlice: (id) => {
        const { wheel } = get();
        if (wheel.length >= MAX_SLICES) return;
        if (wheel.some((s) => s.id === id)) return;
        const cuisine = cuisineById(id);
        if (!cuisine) return;
        set({ wheel: [...wheel, toSlice(cuisine)] });
      },
      addCustom: (raw) => {
        const label = raw.trim().slice(0, 18);
        if (label.length < 2) return false;
        const { wheel } = get();
        if (wheel.length >= MAX_SLICES) return false;
        const known = ALL_CUISINES.find(
          (c) => c.label.toLowerCase() === label.toLowerCase() || c.id === label.toLowerCase(),
        );
        if (known) {
          if (wheel.some((s) => s.id === known.id)) return false;
          set({ wheel: [...wheel, toSlice(known)] });
          return true;
        }
        const slug = slugLabel(label) || "bite";
        const id = `custom-${slug}`;
        if (wheel.some((s) => s.id === id || s.label.toLowerCase() === label.toLowerCase())) {
          return false;
        }
        set({
          wheel: [
            ...wheel,
            {
              id,
              label,
              kicker: "Yours",
              osm: guessOsm(label),
              search: label.toLowerCase(),
              weight: 1,
              custom: true,
            },
          ],
        });
        return true;
      },
      removeSlice: (id) => {
        const { wheel } = get();
        if (wheel.length <= MIN_SLICES) return;
        set({ wheel: wheel.filter((s) => s.id !== id) });
      },
      moveSlice: (id, dir) => {
        const { wheel } = get();
        const i = wheel.findIndex((s) => s.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= wheel.length) return;
        const next = wheel.slice();
        const [row] = next.splice(i, 1);
        next.splice(j, 0, row);
        set({ wheel: next });
      },
      setWeight: (id, weight) => {
        const w = Math.min(3, Math.max(1, Math.round(weight)));
        set({
          wheel: get().wheel.map((s) => (s.id === id ? { ...s, weight: w } : s)),
        });
      },
      renameSlice: (id, label) => {
        const next = label.trim().slice(0, 18);
        if (next.length < 2) return;
        set({
          wheel: get().wheel.map((s) =>
            s.id === id
              ? {
                  ...s,
                  label: next,
                  osm: s.custom ? guessOsm(next) : s.osm,
                  search: s.custom ? next.toLowerCase() : s.search,
                }
              : s,
          ),
        });
      },
      applyPreset: (ids) => set({ wheel: wheelFromIds(ids) }),
      resetWheel: () => set({ wheel: defaultWheel() }),
      setRadiusMeters: (radiusMeters) => set({ radiusMeters }),
      toggleFavorite: (id) => {
        const current = get().favorites;
        set({
          favorites: current.includes(id)
            ? current.filter((x) => x !== id)
            : [...current, id],
        });
      },
      setFavorites: (favorites) => set({ favorites }),
      cacheBookmark: (place) => {
        const rest = get().bookmarks.filter((p) => p.placeId !== place.placeId);
        set({ bookmarks: [place, ...rest].slice(0, 80) });
      },
      setBookmarks: (bookmarks) => set({ bookmarks: bookmarks.slice(0, 80) }),
      setAccountId: (accountId) => set({ accountId }),
      setLocale: (locale) => set({ locale, localePicked: true }),
      clearSessionLocal: () =>
        set({
          favorites: [],
          bookmarks: [],
          accountId: null,
          proUnlocked: false,
          hideAds: false,
        }),
      setProUnlocked: (proUnlocked) => set({ proUnlocked, hideAds: proUnlocked }),
    }),
    {
      name: "spinbite-v1",
      version: 4,
      skipHydration: true,
      storage: createJSONStorage(() => safeLocalStorage()),
      partialize: (s) => ({
        location: s.location,
        wheel: s.wheel,
        radiusMeters: s.radiusMeters,
        favorites: s.favorites,
        bookmarks: s.bookmarks,
        accountId: s.accountId,
        locale: s.locale,
        localePicked: s.localePicked,
      }),
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          const ids = Array.isArray(state.cuisineIds)
            ? (state.cuisineIds as string[])
            : DEFAULT_CUISINE_IDS;
          state.wheel = wheelFromIds(ids);
          delete state.cuisineIds;
        }
        if (!Array.isArray(state.wheel) || (state.wheel as WheelSlice[]).length < MIN_SLICES) {
          state.wheel = defaultWheel();
        }
        if (!Array.isArray(state.bookmarks)) state.bookmarks = [];
        if (version < 3) {
          delete state.proUnlocked;
          delete state.hideAds;
          state.accountId = null;
        }
        if (typeof state.accountId !== "string") state.accountId = null;
        if (version < 4) {
          state.localePicked = false;
        }
        if (!isLocale(state.locale)) state.locale = "en";
        if (typeof state.localePicked !== "boolean") state.localePicked = false;
        return state as unknown as BiteState;
      },
    },
  ),
);
