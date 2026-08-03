import { rooms, halls, roomAmenities, conferenceIncludes } from "@/lib/content";

/*
  One catalogue for the booking pages, built from the same `rooms` and `halls`
  arrays the marketing pages already run on, so a change to a room or a hall
  flows straight through to the listing, the detail page and the cart.

  NOTE ON PRICES: every figure here comes from lib/content.js, where the rates
  are flagged as illustrative placeholders rather than the property's real rate
  card. Nothing in these pages takes a payment: the cart ends in a booking
  enquiry, which is what the lodge actually handles today. Swap in the real
  rate card (and only then talk about deposits or cancellation) before this
  goes live.

  NOTE ON BED SETUPS: the room options below are read off the room photography
  in lib/content.js — deluxe and executive are both shot as a double and as a
  twin, the family room as an interconnecting pair. Confirm with the property
  which setups are actually bookable before this ships.
*/

const bedSetups = {
  deluxe: ["Double", "Twin"],
  executive: ["Double", "Twin"],
  family: ["Interconnecting pair"],
};

const roomEntries = rooms.map((room) => ({
  id: `room-${room.slug}`,
  slug: room.slug,
  kind: "room",
  category: "Rooms & Suites",
  name: room.name,
  price: room.price,
  unit: room.priceUnit,
  // What a quantity means for this kind of booking.
  unitPlural: "nights",
  images: room.images,
  lead: room.lead,
  body: room.body,
  capacity: parseInt(room.sleepsShort, 10) || 2,
  capacityLabel: room.sleeps,
  badge: room.area,
  specs: [
    { label: "Size", value: room.area },
    { label: "Sleeps", value: room.sleeps },
    { label: "Outlook", value: room.views },
    ...(room.count ? [{ label: "Rooms of this type", value: `${room.count}` }] : []),
  ],
  option: { label: "Bed setup", values: bedSetups[room.slug] ?? ["Double"] },
  included: roomAmenities.flatMap((group) => group.items),
  href: `/book/${room.slug}`,
  sourceHref: `/rooms-suites#${room.slug}`,
}));

const hallEntries = halls.map((hall) => ({
  id: `hall-${hall.name.toLowerCase()}`,
  slug: hall.name.toLowerCase(),
  kind: "hall",
  category: "Conference Halls",
  name: `${hall.name} Hall`,
  price: hall.price,
  unit: hall.priceUnit,
  unitPlural: "days",
  images: hall.images,
  lead: hall.lead,
  body: `Seats up to ${hall.top}, laid out ${hall.capacities
    .map((c) => `${c.style.toLowerCase()} for ${c.pax}`)
    .join(", ")}. Air conditioned throughout, with a backup generator on the property.`,
  capacity: hall.top,
  capacityLabel: `Up to ${hall.top} seats`,
  badge: `${hall.top} seats`,
  specs: [
    { label: "Capacity", value: `Up to ${hall.top} seats` },
    ...hall.capacities.map((c) => ({ label: c.style, value: `${c.pax} seats` })),
  ],
  // The layouts the property publishes for this hall, which is exactly the
  // choice a booker makes.
  option: {
    label: "Layout",
    values: hall.capacities.map((c) => `${c.style} · ${c.pax}`),
  },
  included: conferenceIncludes,
  href: `/book/${hall.name.toLowerCase()}`,
  sourceHref: `/conferences#${hall.name.toLowerCase()}`,
}));

export const catalogue = [...roomEntries, ...hallEntries];

export const catalogueTabs = [
  { label: "Everything", value: "all" },
  { label: "Rooms & Suites", value: "room" },
  { label: "Conference Halls", value: "hall" },
];

export const capacityBands = [
  { label: "1 to 2", value: "0-2" },
  { label: "3 to 8", value: "3-8" },
  { label: "10 to 50", value: "10-50" },
  { label: "70 and over", value: "70-999" },
];

export const priceBounds = {
  min: Math.min(...catalogue.map((c) => c.price)),
  max: Math.max(...catalogue.map((c) => c.price)),
};

export function getCatalogueItem(slug) {
  return catalogue.find((item) => item.slug === slug) ?? null;
}

/* Everything except the item passed in, nearest in kind first, for the rail
   at the foot of a detail page. */
export function relatedItems(slug, limit = 6) {
  const current = getCatalogueItem(slug);
  if (!current) return catalogue.slice(0, limit);
  return catalogue
    .filter((item) => item.slug !== slug)
    .sort((a, b) => (a.kind === current.kind ? -1 : 1) - (b.kind === current.kind ? -1 : 1))
    .slice(0, limit);
}

export const currency = (n) => `$${n.toLocaleString("en-US")}`;
