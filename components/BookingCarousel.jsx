"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import Reveal from "@/components/Reveal";
import { rooms, halls } from "@/lib/content";

/*
  Rooms and halls, side by side in one carousel, each card carrying a price
  the way a booking listing would. The price is illustrative (see the NOTE
  in lib/content.js) until the property supplies a real rate card; the point
  of this section is the pattern, not the number.

  Card layout is the "overlay" tourism-card: full-bleed photo, a capacity
  badge over the top corner, and the title, price and an outlined booking
  button sitting in the scrim at the bottom. The section itself carries no
  background of its own, same as the trust marquee above it, so this reads
  as part of the page rather than a boxed-off block.
*/
export default function BookingCarousel() {
  const ref = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);

  const cards = useMemo(
    () => [
      ...rooms.map((r) => ({
        key: `room-${r.slug}`,
        name: r.name,
        image: r.images[0],
        price: r.price,
        priceUnit: r.priceUnit,
        badge: r.area,
        lead: r.lead,
        cta: "View room",
        href: `/rooms-suites#${r.slug}`,
      })),
      ...halls.map((h) => ({
        key: `hall-${h.name}`,
        name: `${h.name} Hall`,
        image: h.image,
        price: h.price,
        priceUnit: h.priceUnit,
        badge: `${h.top} seats`,
        lead: h.lead,
        cta: "View hall",
        href: `/conferences#${h.name.toLowerCase()}`,
      })),
    ],
    []
  );

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  const nudge = useCallback((dir) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const step = card ? card.clientWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  return (
    <section className="">
      <div className="mx-auto mb-8 flex max-w-[1400px] flex-wrap items-end justify-between gap-6 px-10">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-basalt/15 px-4 py-1.5 text-sm text-sage">
            Rooms & Halls
          </p>
          <h2 className="max-w-xl font-display text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.08]">
            Rates at a glance
          </h2>
        </div>

        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={atStart}
            className="grid h-12 w-12 place-items-center rounded-full border border-basalt/20 text-basalt transition-colors hover:border-basalt hover:bg-basalt hover:text-paper disabled:opacity-30 disabled:hover:border-basalt/20 disabled:hover:bg-transparent disabled:hover:text-basalt"
          >
            <span className="sr-only">Previous</span>
            <ArrowLeft size={18} weight="light" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={atEnd}
            className="grid h-12 w-12 place-items-center rounded-full border border-basalt/20 text-basalt transition-colors hover:border-basalt hover:bg-basalt hover:text-paper disabled:opacity-30 disabled:hover:border-basalt/20 disabled:hover:bg-transparent disabled:hover:text-basalt"
          >
            <span className="sr-only">Next</span>
            <ArrowRight size={18} weight="light" />
          </button>
        </div>
      </div>

      {/*
        Padding lives on this non-scrolling wrapper, not on the <ul> itself.
        A snap-x container with its own padding gets pre-scrolled by exactly
        that padding amount in some browsers (Chromium included), which
        silently cancels the visual inset out. Padding on an ancestor sidesteps
        the quirk entirely and keeps the rail's edges lined up with the
        header and the pagination line below, which share the same wrapper.
      */}
      <div className="mx-auto max-w-[1400px] px-10">
        <ul
          ref={ref}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden pb-4"
        >
          {cards.map((c, i) => (
          <Reveal
            as="li"
            key={c.key}
            delay={i * 0.05}
            className="snap-start shrink-0 w-[76vw] sm:w-[42vw] lg:w-[calc((100%-60px)/4)]"
          >
            <Link
              href={c.href}
              data-card
              className="group relative block aspect-[4/5] overflow-hidden rounded-surface"
            >
              <Image
                src={`/img/${c.image}.webp`}
                alt={c.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />

              <span className="absolute left-4 top-4 rounded-full border border-paper/70 bg-basalt/30 px-3.5 py-1.5 text-xs font-medium text-paper backdrop-blur-sm">
                {c.badge}
              </span>

              <span className="absolute inset-0 bg-gradient-to-t from-basalt/92 via-basalt/45 to-transparent" />

              <span className="absolute inset-x-0 bottom-0 p-6">
                <span className="block font-display text-xl leading-tight text-paper">
                  {c.name}
                </span>
                <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-paper/75">
                  {c.lead}
                </span>

                <span className="mt-5 flex items-center justify-between gap-3">
                  <span className="leading-tight">
                    <span className="block text-xs text-paper/60">from</span>
                    <span className="font-display text-xl text-paper">
                      ${c.price}
                      <span className="ml-1 text-xs text-paper/60">/{c.priceUnit}</span>
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-paper/60 px-4 py-2.5 text-sm font-medium text-paper transition-colors duration-200 group-hover:bg-paper group-hover:text-basalt">
                    {c.cta}
                    <ArrowUpRight size={13} weight="bold" />
                  </span>
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
        </ul>
      </div>

      {/* Pagination line: a plain scroll progress indicator rather than a
          row of dots, since seven cards is too many for dots to stay legible
          at a glance. */}
      <div className="mx-auto mt-8 max-w-[1400px] px-10">
        <div className="relative h-px w-full bg-basalt/10">
          <span
            className="absolute inset-y-0 left-0 bg-basalt transition-[width] duration-150 ease-out"
            style={{ width: `${8 + progress * 92}%` }}
          />
        </div>
      </div>
    </section>
  );
}