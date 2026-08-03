"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/*
  The booking cart. Held in React state and mirrored to localStorage so a
  half-built booking survives a reload, which is the one place a lodge site
  really loses people.

  Deliberately no payment anywhere in here: the cart ends at a booking enquiry
  the lodge answers by hand, the same route the contact form already takes.
  Lines are keyed by item + chosen option, so a Deluxe Room booked as a double
  and the same room booked as a twin sit as two lines rather than merging.
*/

const KEY = "masailand.cart.v1";
const CartContext = createContext(null);

const lineKey = (slug, option) => `${slug}::${option ?? ""}`;

export function CartProvider({ children }) {
  const [lines, setLines] = useState([]);
  // Nothing is read from storage on the server, so the first client render has
  // to match the server's empty cart and only then fill in.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* A cart is not worth breaking the page over. */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* Private mode, quota, or storage disabled. */
    }
  }, [lines, hydrated]);

  const add = useCallback((item, { option = null, qty = 1 } = {}) => {
    setLines((prev) => {
      const key = lineKey(item.slug, option);
      const found = prev.find((l) => l.key === key);
      if (found) {
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      }
      return [
        ...prev,
        {
          key,
          slug: item.slug,
          kind: item.kind,
          name: item.name,
          image: item.images[0],
          price: item.price,
          unit: item.unit,
          unitPlural: item.unitPlural,
          option,
          qty,
        },
      ];
    });
  }, []);

  const setQty = useCallback((key, qty) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty } : l))
    );
  }, []);

  const remove = useCallback((key) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
    return { lines, count, subtotal, hydrated, add, setQty, remove, clear };
  }, [lines, hydrated, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
