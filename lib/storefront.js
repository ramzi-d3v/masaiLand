import { catalogue } from "@/lib/catalogue";

/*
  What the shop actually lists, as an overlay on lib/catalogue.js.

  The catalogue itself is derived from lib/content.js and is the property's
  real inventory, so nothing here edits it. Instead this keeps two small lists
  in localStorage:

    hidden — slugs of catalogue entries pulled from the shop
    added  — listings created from the admin screen

  Same caveat as orders, and it matters more here: there is no backend, so a
  room added on this laptop is not on the shop for anyone else. This is the
  editing UI working end to end against the only storage the site has. When a
  datastore arrives, these functions become API calls and neither the admin
  table nor the shop changes.

  One limitation worth knowing: /book/[slug] is prerendered from the real
  catalogue, so an added listing shows on the shop's grid but has no detail
  page behind it. The admin screen says so rather than linking into a 404.
*/

const KEY = "masailand.storefront.v1";
const EMPTY = { hidden: [], added: [] };

export function readStorefront() {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : EMPTY;
    return {
      hidden: Array.isArray(parsed.hidden) ? parsed.hidden : [],
      added: Array.isArray(parsed.added) ? parsed.added : [],
    };
  } catch {
    return EMPTY;
  }
}

function write(state) {
  if (typeof window === "undefined") return state;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* Private mode, quota, or storage disabled. */
  }
  return state;
}

export function setHidden(slug, hidden) {
  const state = readStorefront();
  const next = {
    ...state,
    hidden: hidden
      ? [...new Set([...state.hidden, slug])]
      : state.hidden.filter((s) => s !== slug),
  };
  return write(next);
}

export function addListing(listing) {
  const state = readStorefront();
  return write({ ...state, added: [listing, ...state.added] });
}

export function removeListing(slug) {
  const state = readStorefront();
  return write({ ...state, added: state.added.filter((l) => l.slug !== slug) });
}

export function resetStorefront() {
  return write(EMPTY);
}

/* The catalogue as the shop should show it: hidden entries dropped, added ones
   folded in at the front. Added listings are flagged so the UI can tell them
   apart — they have no detail page. */
export function visibleCatalogue(state = readStorefront()) {
  const added = state.added.map((l) => ({ ...l, isCustom: true }));
  return [...added, ...catalogue.filter((item) => !state.hidden.includes(item.slug))];
}

/* Every listing the admin screen manages, hidden ones included. */
export function manageableCatalogue(state = readStorefront()) {
  const added = state.added.map((l) => ({ ...l, isCustom: true, hidden: false }));
  const base = catalogue.map((item) => ({
    ...item,
    isCustom: false,
    hidden: state.hidden.includes(item.slug),
  }));
  return [...added, ...base];
}

/* Photographs already on the property, for the image picker on the add form —
   there is no upload without a backend. */
export const propertyImages = [
  ...new Set(catalogue.flatMap((item) => item.images)),
];

export const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
