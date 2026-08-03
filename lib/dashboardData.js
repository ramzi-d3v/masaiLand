import {
  analyticsSummary,
  analyticsTimeline,
  devicesSplit,
  enquiries,
  topPages,
  viewsByHour,
} from "@/lib/adminContent";
import { catalogue, currency } from "@/lib/catalogue";

/*
  Everything the dashboard block draws, derived from the data the admin area
  already had in lib/adminContent.js rather than from the block's own demo
  constants. The card layouts are untouched — only what flows into them
  changed, and the titles that named the wrong thing.

  NOTE: lib/adminContent.js is explicit that its figures are placeholders for a
  UI-first build. There is no analytics pipeline and no enquiries backend yet,
  so every number here inherits that: it is shaped like the real thing, it is
  not the real thing. The dashboard says as much on screen.
*/

/* ---------------------------------------------------------------- stats --- */

/* "+12.4%" / "-0.4%" / "+3" → a number the Delta component can point an arrow
   at. A plain count like "+3" has no percentage to show, so it carries its own
   label through instead. */
function parseDelta(raw) {
  const n = Number.parseFloat(String(raw).replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(n)) return 0;
  return String(raw).trim().startsWith("-") ? -Math.abs(n) : Math.abs(n);
}

export const dashboardStats = analyticsSummary.map((s) => ({
  label: s.label,
  value: typeof s.value === "number" ? s.value.toLocaleString("en-US") : s.value,
  delta: parseDelta(s.delta),
  raw: s.delta,
  footnote: "vs prior period",
  // Only the session length is better when it falls; visits and enquiries are
  // not.
  lowerIsBetter: false,
}));

/* ------------------------------------------------------------- timeline --- */

/* analyticsTimeline is thirty points labelled "Day 1".."Day 30". The area
   chart wants real calendar dates, so they are laid onto the thirty days
   ending today. */
const DAY = 86400000;
const today = new Date();
today.setHours(0, 0, 0, 0);

export const visitsTimeline = analyticsTimeline.map((point, i) => {
  const d = new Date(today.getTime() - (analyticsTimeline.length - 1 - i) * DAY);
  return {
    date: d.toISOString().slice(0, 10),
    visits: point.visits,
    visitors: point.visitors,
    enquiries: point.enquiries,
  };
});

export const visitsTotals = (() => {
  const half = Math.floor(visitsTimeline.length / 2);
  const sum = (rows) => rows.reduce((n, r) => n + r.visits, 0);
  const recent = sum(visitsTimeline.slice(half));
  const prior = sum(visitsTimeline.slice(0, half));
  return {
    total: sum(visitsTimeline),
    delta: prior ? Number((((recent - prior) / prior) * 100).toFixed(1)) : 0,
  };
})();

/* --------------------------------------------------------------- hours --- */

export const hourlyVisits = viewsByHour.map((h) => ({
  hour: h.hour,
  views: h.views,
}));

export const peakHour = hourlyVisits.reduce((best, h) => (h.views > best.views ? h : best));

/* ------------------------------------------------------------- devices --- */

export const deviceShare = devicesSplit.map((d) => ({
  device: d.label.toLowerCase(),
  share: d.value,
  fill: `var(--color-${d.label.toLowerCase()})`,
}));

/* ------------------------------------------------------------ enquiries --- */

export const enquirySubjects = [...new Set(enquiries.map((e) => e.subject))];

/* Enquiries per day, split by subject, for the stacked bars. The set is small
   and real, so the chart is sparse on purpose rather than padded out. */
export const enquiriesByDay = (() => {
  const byDay = new Map();
  for (const e of enquiries) {
    const key = e.receivedAt.slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, { day: key, total: 0 });
    const row = byDay.get(key);
    row[e.subject] = (row[e.subject] ?? 0) + 1;
    row.total += 1;
  }
  return [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day));
})();

export const recentEnquiries = [...enquiries]
  .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
  .map((e) => ({
    id: e.id,
    customer: e.name,
    email: e.email,
    subject: e.subject,
    receivedAt: e.receivedAt,
    state: e.read ? "read" : "unread",
  }));

export const unreadCount = enquiries.filter((e) => !e.read).length;

/* ------------------------------------------------------- rooms & halls --- */

/* Fills the slot the block used for teammates: the property's own bookable
   spaces, with the room photograph standing in for the avatar. */
export const bookableSpaces = catalogue.map((item) => ({
  id: item.id,
  name: item.name,
  status: item.category,
  detail: `${currency(item.price)}/${item.unit}`,
  // The card's meta line is narrow, so it takes the short badge — a room's
  // size, a hall's seat count — rather than the full sentence.
  capacity: item.badge,
  image: `/img/${item.images[0]}.webp`,
  href: item.href,
}));

/* ------------------------------------------------------------ activity --- */

export const activityFeed = recentEnquiries.slice(0, 4).map((e) => ({
  title: `${e.customer} asked about ${e.subject.toLowerCase()}`,
  at: e.receivedAt,
  kind: e.subject,
}));

export const topPagesList = topPages;
