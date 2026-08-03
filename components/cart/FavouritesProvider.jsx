"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/*
  Favourites: the heart on a card and on a detail page. Same shape as the cart
  — React state mirrored into localStorage — but it holds only slugs, and the
  favourites page looks the rest up from the catalogue. That way a change to a
  room's name, photograph or rate shows up in someone's saved list instead of
  going stale in storage.
*/

const KEY = "masailand.favourites.v1";
const FavouritesContext = createContext(null);

export function FavouritesProvider({ children }) {
  const [slugs, setSlugs] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSlugs(JSON.parse(raw));
    } catch {
      /* Not worth breaking the page over. */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(slugs));
    } catch {
      /* Private mode, quota, or storage disabled. */
    }
  }, [slugs, hydrated]);

  const toggle = useCallback((slug) => {
    setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const remove = useCallback((slug) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const value = useMemo(
    () => ({
      slugs,
      count: slugs.length,
      hydrated,
      has: (slug) => slugs.includes(slug),
      toggle,
      remove,
      clear: () => setSlugs([]),
    }),
    [slugs, hydrated, toggle, remove]
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used inside <FavouritesProvider>");
  return ctx;
}
