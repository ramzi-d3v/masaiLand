/*
  Earnings off the demo bookings.

  Pure functions on an array of orders, so the maths is testable and has no
  idea where the orders came from. Today that is localStorage; when a datastore
  arrives the same functions run on whatever it returns.

  A trend needs two windows to compare. With a demo that means the honest
  answer is often "there is no prior period yet" rather than a percentage, and
  summarise() says so with `basis` instead of inventing a baseline.
*/

const DAY = 86400000;

function windowTotals(orders, from, to) {
  const rows = orders.filter((o) => {
    const at = new Date(o.at).getTime();
    return at >= from && at < to;
  });
  return {
    count: rows.length,
    revenue: rows.reduce((n, o) => n + o.amount, 0),
    units: rows.reduce((n, o) => n + o.lines.reduce((m, l) => m + l.qty, 0), 0),
  };
}

/* current vs the window of the same length immediately before it. */
function change(current, prior) {
  if (prior > 0) return { delta: Number((((current - prior) / prior) * 100).toFixed(1)), basis: "period" };
  if (current > 0) return { delta: null, basis: "new" };
  return { delta: null, basis: "empty" };
}

export function summariseEarnings(orders, { days = 7, now = Date.now() } = {}) {
  const span = days * DAY;
  const current = windowTotals(orders, now - span, now + DAY);
  const prior = windowTotals(orders, now - span * 2, now - span);

  const all = {
    count: orders.length,
    revenue: orders.reduce((n, o) => n + o.amount, 0),
    units: orders.reduce((n, o) => n + o.lines.reduce((m, l) => m + l.qty, 0), 0),
  };

  const avg = all.count ? all.revenue / all.count : 0;
  const priorAvg = prior.count ? prior.revenue / prior.count : 0;
  const currentAvg = current.count ? current.revenue / current.count : 0;

  return {
    days,
    all,
    current,
    prior,
    avg,
    revenue: change(current.revenue, prior.revenue),
    bookings: change(current.count, prior.count),
    units: change(current.units, prior.units),
    average: change(currentAvg, priorAvg),
  };
}

/* Split by what was booked, for the dial. A line priced by the night is a
   room; by the day, a hall. */
export function splitByKind(orders) {
  return orders.reduce(
    (acc, o) => {
      for (const line of o.lines) {
        const value = line.price * line.qty;
        if (line.unit === "night") acc.rooms += value;
        else acc.halls += value;
      }
      return acc;
    },
    { rooms: 0, halls: 0 }
  );
}
