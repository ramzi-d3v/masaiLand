/* Shared predicate for the date-range filter: true when `iso` falls on or
   between `range.from` and `range.to` (inclusive of both end days), true for
   everything when no range is set. */
export function inRange(iso, range) {
  if (!range?.from) return true;
  const t = new Date(iso).getTime();
  const from = new Date(range.from).setHours(0, 0, 0, 0);
  const to = range.to ? new Date(range.to).setHours(23, 59, 59, 999) : from + 86399999;
  return t >= from && t <= to;
}
