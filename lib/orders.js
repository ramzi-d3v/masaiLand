/*
  Where a completed demo checkout goes.

  There is no backend, so an "order" is written to this browser's localStorage
  and nowhere else. That has two consequences worth being blunt about, both of
  which the admin page says on screen:

    - Orders are per browser. A booking made on a phone is invisible on the
      laptop, and clearing site data wipes the lot.
    - Nothing was paid. The status below records what the simulation did, not
      what a bank did.

  When a real provider and a real datastore arrive, this module is the seam:
  swap these three functions for API calls and both the checkout and the admin
  table follow without touching their markup.
*/

const KEY = "masailand.orders.v1";

export const ORDER_STATUS = {
  paid: { label: "Paid", tone: "paid" },
  pending: { label: "Pending", tone: "pending" },
  failed: { label: "Failed", tone: "failed" },
  enquiry: { label: "Enquiry, unpaid", tone: "pending" },
};

export function readOrders() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrder(order) {
  if (typeof window === "undefined") return;
  try {
    const next = [order, ...readOrders()].slice(0, 100);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* Private mode, quota, or storage disabled. The receipt still shows. */
  }
}

export function clearOrders() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* Nothing to do. */
  }
}
