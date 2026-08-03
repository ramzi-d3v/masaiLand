"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bag,
  CaretDown,
  Heart,
  MagnifyingGlass,
  SlidersHorizontal,
  X,
} from "@phosphor-icons/react";
import { useCart } from "@/components/cart/CartProvider";
import { useFavourites } from "@/components/cart/FavouritesProvider";
import { capacityBands, catalogueTabs, currency, priceBounds } from "@/lib/catalogue";
import { visibleCatalogue } from "@/lib/storefront";

const PER_PAGE = 6;

const SORTS = [
  { label: "Price, low to high", value: "price-asc" },
  { label: "Price, high to low", value: "price-desc" },
  { label: "Capacity, largest first", value: "capacity-desc" },
  { label: "Name, A to Z", value: "name-asc" },
];

function inBand(capacity, band) {
  const [min, max] = band.split("-").map(Number);
  return capacity >= min && capacity <= max;
}

/* One filter group. Same checkbox row as the reference: a small square box,
   the label, and the count of matching entries on the right. */
function CheckGroup({ title, options, selected, onToggle, onReset }) {
  return (
    <div className="border-t border-basalt/10 pt-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="label text-basalt">{title}</h3>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-sage underline-offset-2 hover:text-basalt hover:underline"
          >
            Reset
          </button>
        )}
      </div>
      <ul className="space-y-2.5">
        {options.map((opt) => {
          const on = selected.includes(opt.value);
          return (
            <li key={opt.value}>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => onToggle(opt.value)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors ${
                    on ? "border-basalt bg-basalt text-paper" : "border-basalt/25 bg-transparent"
                  }`}
                >
                  {on && (
                    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                      <path
                        d="M2 6.2 4.6 8.8 10 3.4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className={on ? "text-basalt" : "text-sage"}>{opt.label}</span>
                <span className="ml-auto font-mono text-[11px] text-sage-soft">{opt.count}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Card({ item, onAdd, added, saved, onSave }) {
  /* A listing added from the admin screen has no prerendered detail page, so
     its card is not a link. Everything else on it still works. */
  const Frame = item.isCustom ? "div" : Link;
  const frameProps = item.isCustom ? {} : { href: item.href };

  return (
    <article className="group">
      <Frame {...frameProps} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-surface bg-paper-deep">
          <Image
            src={`/img/${item.images[0]}.webp`}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
          <span className="absolute left-4 top-4 rounded-full border border-paper/70 bg-basalt/30 px-3 py-1 text-xs font-medium text-paper backdrop-blur-sm">
            {item.badge}
          </span>
        </div>
        <h3 className="mt-4 font-display text-xl leading-snug">{item.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-sage">{item.lead}</p>
      </Frame>

      <div className="mt-4 flex items-center gap-2">
        <p className="rounded-full bg-basalt px-4 py-2 text-sm font-medium text-paper">
          {currency(item.price)}
          <span className="ml-1 text-paper/60">/{item.unit}</span>
        </p>
        <button
          type="button"
          onClick={() => onAdd(item)}
          aria-label={`Add ${item.name} to the booking cart`}
          className={`ml-auto grid h-10 w-10 place-items-center rounded-full border transition-colors ${
            added
              ? "border-basalt bg-basalt text-paper"
              : "border-basalt/20 text-basalt hover:border-basalt hover:bg-basalt hover:text-paper"
          }`}
        >
          <Bag size={16} weight="light" />
        </button>
        <button
          type="button"
          onClick={() => onSave(item.slug)}
          aria-pressed={saved}
          aria-label={
            saved ? `Remove ${item.name} from favourites` : `Save ${item.name} to favourites`
          }
          className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
            saved
              ? "border-basalt bg-basalt text-paper"
              : "border-basalt/20 text-basalt hover:border-basalt hover:bg-basalt hover:text-paper"
          }`}
        >
          <Heart size={16} weight={saved ? "fill" : "light"} />
        </button>
      </div>
    </article>
  );
}

/*
  The listing: category tabs and a search across the top, a filter column down
  the left, a card grid, and pagination at the foot. Everything filters in the
  browser — the whole catalogue is seven entries, so there is nothing to gain
  from round trips to the server, and the page stays usable with the URL
  untouched.
*/
export default function CatalogueBrowser({ items }) {
  const { add } = useCart();
  const { has, toggle } = useFavourites();

  /* The server renders the full catalogue. Once mounted, the admin screen's
     edits are applied on top: anything taken off the shop drops out, anything
     added there appears. Read after mount so the first client render still
     matches what the server sent. */
  const [shop, setShop] = useState(items);
  useEffect(() => setShop(visibleCatalogue()), []);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [bands, setBands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(priceBounds.max);
  const [sort, setSort] = useState("price-asc");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(null);

  const onAdd = useCallback(
    (item) => {
      add(item, { option: item.option.values[0], qty: 1 });
      setJustAdded(item.slug);
      window.setTimeout(() => setJustAdded((s) => (s === item.slug ? null : s)), 1400);
    },
    [add]
  );

  const reset = useCallback((fn) => (...args) => {
    fn(...args);
    setPage(1);
  }, []);

  const bandOptions = useMemo(
    () =>
      capacityBands.map((b) => ({
        ...b,
        count: shop.filter((i) => inBand(i.capacity, b.value)).length,
      })),
    [shop]
  );

  const typeOptions = useMemo(
    () =>
      catalogueTabs
        .filter((t) => t.value !== "all")
        .map((t) => ({
          label: t.label,
          value: t.value,
          count: shop.filter((i) => i.kind === t.value).length,
        })),
    [shop]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = shop.filter((item) => {
      if (tab !== "all" && item.kind !== tab) return false;
      if (bands.length && !bands.some((b) => inBand(item.capacity, b))) return false;
      if (item.price > maxPrice) return false;
      if (q && !`${item.name} ${item.lead} ${item.category}`.toLowerCase().includes(q)) return false;
      return true;
    });

    const by = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "capacity-desc": (a, b) => b.capacity - a.capacity,
      "name-asc": (a, b) => a.name.localeCompare(b.name),
    }[sort];

    return [...out].sort(by);
  }, [shop, tab, bands, maxPrice, query, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const goTo = (n) => {
    setPage(n);
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearAll = () => {
    setTab("all");
    setQuery("");
    setBands([]);
    setMaxPrice(priceBounds.max);
    setPage(1);
  };

  const filterColumn = (
    <div className="space-y-6">
      <CheckGroup
        title="Type"
        options={typeOptions}
        selected={tab === "all" ? [] : [tab]}
        onToggle={reset((v) => setTab((t) => (t === v ? "all" : v)))}
        onReset={reset(() => setTab("all"))}
      />

      <CheckGroup
        title="Sleeps / seats"
        options={bandOptions}
        selected={bands}
        onToggle={reset((v) =>
          setBands((prev) => (prev.includes(v) ? prev.filter((b) => b !== v) : [...prev, v]))
        )}
        onReset={reset(() => setBands([]))}
      />

      <div className="border-t border-basalt/10 pt-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="label text-basalt">Price</h3>
          {maxPrice !== priceBounds.max && (
            <button
              type="button"
              onClick={reset(() => setMaxPrice(priceBounds.max))}
              className="text-xs text-sage underline-offset-2 hover:text-basalt hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={5}
          value={maxPrice}
          onChange={reset((e) => setMaxPrice(Number(e.target.value)))}
          aria-label="Maximum price"
          className="w-full accent-[var(--basalt)]"
        />
        <div className="mt-2 flex justify-between font-mono text-[11px] text-sage">
          <span>{currency(priceBounds.min)}</span>
          <span className="text-basalt">up to {currency(maxPrice)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 lg:px-10 lg:pb-32">
      {/* Tabs and search, on the same row the reference runs them. */}
      <div className="flex flex-wrap items-center gap-3 border-b border-basalt/10 pb-6">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Booking categories">
          {catalogueTabs.map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={tab === t.value}
              onClick={reset(() => setTab(t.value))}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                tab === t.value
                  ? "border-basalt bg-basalt text-paper"
                  : "border-basalt/20 text-sage hover:border-basalt hover:text-basalt"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label className="relative ml-auto w-full min-w-[220px] sm:w-auto sm:flex-1 sm:max-w-[320px]">
          <span className="sr-only">Search rooms and halls</span>
          <MagnifyingGlass
            size={15}
            weight="light"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sage"
          />
          <input
            value={query}
            onChange={reset((e) => setQuery(e.target.value))}
            placeholder="Search rooms and halls"
            className="w-full rounded-full border border-basalt/20 bg-transparent py-2.5 pl-10 pr-4 text-sm placeholder:text-sage-soft focus:border-basalt focus:outline-none"
          />
        </label>

        <label className="relative">
          <span className="sr-only">Sort by</span>
          <select
            value={sort}
            onChange={reset((e) => setSort(e.target.value))}
            className="appearance-none rounded-full border border-basalt/20 bg-transparent py-2.5 pl-4 pr-9 text-sm text-basalt focus:border-basalt focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <CaretDown
            size={11}
            weight="bold"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sage"
          />
        </label>

        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-basalt/20 px-4 py-2.5 text-sm lg:hidden"
        >
          <SlidersHorizontal size={15} weight="light" />
          Filters
        </button>
      </div>

      <div id="results" className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
        <aside className="hidden lg:block">{filterColumn}</aside>

        <div>
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <p className="text-sm text-sage">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
              {filtered.length > PER_PAGE && (
                <>
                  {" "}
                  · page {current} of {pages}
                </>
              )}
            </p>
            {(tab !== "all" || bands.length > 0 || query || maxPrice !== priceBounds.max) && (
              <button
                type="button"
                onClick={clearAll}
                className="text-sm text-sage underline-offset-2 hover:text-basalt hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {shown.length === 0 ? (
            <div className="rounded-surface border border-basalt/12 bg-paper-raised p-10 text-center">
              <p className="font-display text-2xl">Nothing matches that</p>
              <p className="mt-3 text-sage">
                Widen the price or the capacity and the rooms come back.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-6 rounded-full border border-basalt px-6 py-3 text-sm font-medium transition-colors hover:bg-basalt hover:text-paper"
              >
                Clear the filters
              </button>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  onAdd={onAdd}
                  added={justAdded === item.slug}
                  saved={has(item.slug)}
                  onSave={toggle}
                />
              ))}
            </div>
          )}

          {pages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-16 flex items-center justify-center gap-2 border-t border-basalt/10 pt-10"
            >
              <button
                type="button"
                onClick={() => goTo(Math.max(1, current - 1))}
                disabled={current === 1}
                className="grid h-10 w-10 place-items-center rounded-full border border-basalt/20 transition-colors hover:border-basalt hover:bg-basalt hover:text-paper disabled:opacity-30 disabled:hover:border-basalt/20 disabled:hover:bg-transparent disabled:hover:text-basalt"
              >
                <span className="sr-only">Previous page</span>
                <ArrowLeft size={15} weight="light" />
              </button>

              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => goTo(n)}
                  aria-current={n === current ? "page" : undefined}
                  className={`h-10 min-w-10 rounded-full border px-3 font-mono text-sm transition-colors ${
                    n === current
                      ? "border-basalt bg-basalt text-paper"
                      : "border-basalt/20 text-sage hover:border-basalt hover:text-basalt"
                  }`}
                >
                  {String(n).padStart(2, "0")}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goTo(Math.min(pages, current + 1))}
                disabled={current === pages}
                className="grid h-10 w-10 place-items-center rounded-full border border-basalt/20 transition-colors hover:border-basalt hover:bg-basalt hover:text-paper disabled:opacity-30 disabled:hover:border-basalt/20 disabled:hover:bg-transparent disabled:hover:text-basalt"
              >
                <span className="sr-only">Next page</span>
                <ArrowRight size={15} weight="light" />
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* The same filter column as a sheet on small screens. */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-basalt/40 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 w-[86vw] max-w-[360px] overflow-y-auto bg-paper p-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-display text-2xl">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-basalt/20"
              >
                <span className="sr-only">Close</span>
                <X size={16} weight="light" />
              </button>
            </div>
            {filterColumn}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-8 w-full rounded-full bg-basalt py-3.5 text-sm font-medium text-paper"
            >
              Show {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
