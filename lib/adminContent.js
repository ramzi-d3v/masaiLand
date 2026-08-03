/*
  NOTE: everything in this file is placeholder data for the admin dashboard's
  UI-first build. There is no analytics pipeline or enquiries backend behind
  it yet — every number, name and message below is invented for layout
  purposes and must be replaced once the site is wired to a real data source
  (page-view tracking, and the contact form actually persisting submissions).
*/

export const analyticsRange = ["24h", "7d", "30d", "3m", "6m", "1y"];

export const analyticsSummary = [
  { label: "Total visits", value: 8420, delta: "+12.4%", trend: "up" },
  { label: "Unique visitors", value: 5180, delta: "+8.1%", trend: "up" },
  { label: "Enquiries received", value: 47, delta: "+3", trend: "up" },
  { label: "Avg. session", value: "3m 12s", delta: "-0.4%", trend: "down" },
];

/* One point per day, last 30 days. visits / visitors / enquiries. */
export const analyticsTimeline = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 180 + Math.round(60 * Math.sin(i / 4)) + (i % 7 === 5 || i % 7 === 6 ? 40 : 0);
  return {
    day: `Day ${day}`,
    visits: Math.max(60, base + (i % 5) * 6),
    visitors: Math.max(40, Math.round((base + (i % 5) * 6) * 0.62)),
    enquiries: (i % 4 === 0 ? 2 : 0) + (i % 9 === 0 ? 1 : 0),
  };
});

export const topPages = [
  { path: "/", views: 3120, share: 37 },
  { path: "/rooms-suites", views: 1840, share: 22 },
  { path: "/gallery", views: 1120, share: 13 },
  { path: "/wine-dine", views: 860, share: 10 },
  { path: "/conferences", views: 640, share: 8 },
  { path: "/wellness", views: 520, share: 6 },
  { path: "/contact", views: 340, share: 4 },
];

/* Visits by hour of day, 0-23. Shaped like a lodge site: quiet overnight,
   two bumps around late morning and evening browsing. */
export const viewsByHour = Array.from({ length: 24 }, (_, h) => {
  const morning = Math.exp(-((h - 10) ** 2) / 18) * 90;
  const evening = Math.exp(-((h - 20) ** 2) / 14) * 110;
  return { hour: `${String(h).padStart(2, "0")}:00`, views: Math.round(20 + morning + evening) };
});

export const devicesSplit = [
  { label: "Mobile", value: 58 },
  { label: "Desktop", value: 34 },
  { label: "Tablet", value: 8 },
];

/*
  Dummy enquiries — shaped like what the live Contact form on /contact
  actually collects (name, email, subject, message), plus admin-only
  bookkeeping fields (id, read, receivedAt).
*/
export const enquiries = [
  {
    id: "enq-1",
    name: "Amara Ndegwa",
    email: "amara.n@example.com",
    subject: "Rooms & Suites",
    message:
      "Hello, we're a family of four looking at an executive suite for the last week of August. Could you confirm availability and the best rate for 6 nights?",
    receivedAt: "2026-07-29T09:14:00Z",
    read: false,
  },
  {
    id: "enq-2",
    name: "Peter Kariuki",
    email: "peter.k@example.com",
    subject: "A conference or event",
    message:
      "We're planning a two-day offsite for about 25 people in mid-September. Would the Manyara hall be available, and can you send the full equipment list?",
    receivedAt: "2026-07-28T15:42:00Z",
    read: false,
  },
  {
    id: "enq-3",
    name: "Sofia Reyes",
    email: "sofia.reyes@example.com",
    subject: "Something else",
    message:
      "Do you offer airport transfers from Kilimanjaro International, and is there a charge for guests arriving after 22:00?",
    receivedAt: "2026-07-28T08:05:00Z",
    read: true,
  },
  {
    id: "enq-4",
    name: "James Mwangi",
    email: "james.mwangi@example.com",
    subject: "The restaurant",
    message:
      "Hoping to arrange a private dinner on the terrace for an anniversary. Is that something the restaurant can put together, and roughly what would it cost for two?",
    receivedAt: "2026-07-27T18:20:00Z",
    read: true,
  },
  {
    id: "enq-5",
    name: "Lisa Thompson",
    email: "lisa.t@example.com",
    subject: "Rooms & Suites",
    message:
      "Checking whether the deluxe rooms take a cot, we'll be travelling with a toddler. Also interested in the garden pool hours.",
    receivedAt: "2026-07-26T11:33:00Z",
    read: false,
  },
  {
    id: "enq-6",
    name: "David Ochieng",
    email: "d.ochieng@example.com",
    subject: "A conference or event",
    message:
      "Requesting a quote for the Selous hall, banquet layout, 120 guests, for a corporate year-end function in December.",
    receivedAt: "2026-07-25T13:10:00Z",
    read: true,
  },
  {
    id: "enq-7",
    name: "Grace Mollel",
    email: "grace.mollel@example.com",
    subject: "Something else",
    message:
      "Is the lodge able to arrange a driver for a day trip to Ngorongoro Crater during our stay?",
    receivedAt: "2026-07-24T07:48:00Z",
    read: true,
  },
];
