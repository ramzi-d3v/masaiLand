"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import Reveal from "@/components/Reveal";

/*
  The spotlight rail at the foot of each inner page. Same snap-x scroller the
  booking carousel uses, so it still drags and swipes natively, but this one
  never reaches an end: the items are laid out three times over and the
  scroller silently jumps back a copy whenever it crosses into the third, or
  forward a copy when it runs off the front. Because the copies are identical,
  the jump lands on a pixel-identical frame and the loop is invisible.

  The consequences of that: the arrows are never disabled, and the hairline
  underneath tracks the position inside the current copy rather than progress
  towards an end that no longer exists.

  Cards keep the tall overlay shape they had as a plain strip, with a line of
  description under the title.
*/
export default function SpotlightCarousel({ title = "Spotlight", items }) {
  const ref = useRef(null);
  // Set while a wrap is being applied, so the jump does not re-enter onScroll
  // and wrap a second time.
  const wrapping = useRef(false);
  const [progress, setProgress] = useState(0);

  const copyWidth = useCallback(() => {
    const el = ref.current;
    return el ? el.scrollWidth / 3 : 0;
  }, []);

  /* Start in the middle copy, so there is a full set of cards to run through
     in either direction before the first wrap is needed. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = () => {
      const w = el.scrollWidth / 3;
      if (w > 0) el.scrollLeft = w;
    };
    start();
    // Images and fonts change the track's width as they land, so re-seat once
    // the layout has settled.
    const ro = new ResizeObserver(start);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el || wrapping.current) return;
    const w = copyWidth();
    if (w > 0) {
      if (el.scrollLeft >= 2 * w) {
        wrapping.current = true;
        el.scrollLeft -= w;
        wrapping.current = false;
      } else if (el.scrollLeft <= 0) {
        wrapping.current = true;
        el.scrollLeft += w;
        wrapping.current = false;
      }
      setProgress((el.scrollLeft % w) / w);
    }
  }, [copyWidth]);

  const nudge = useCallback((dir) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const step = card ? card.clientWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  /* Three passes over the same items. Only the middle one is exposed to
     assistive tech and the tab order; the outer two are scenery that makes
     the loop continuous. */
  const loop = [...items, ...items, ...items];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto mb-10 flex max-w-[1400px] flex-wrap items-end justify-between gap-6 px-5 lg:px-10">
        <Reveal>
          <h2 className="font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.06]">
            {title}
          </h2>
        </Reveal>

        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            type="button"
            onClick={() => nudge(-1)}
            className="grid h-12 w-12 place-items-center rounded-full border border-basalt/20 text-basalt transition-colors hover:border-basalt hover:bg-basalt hover:text-paper active:scale-95"
          >
            <span className="sr-only">Previous</span>
            <ArrowLeft size={18} weight="light" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            className="grid h-12 w-12 place-items-center rounded-full border border-basalt/20 text-basalt transition-colors hover:border-basalt hover:bg-basalt hover:text-paper active:scale-95"
          >
            <span className="sr-only">Next</span>
            <ArrowRight size={18} weight="light" />
          </button>
        </div>
      </div>

      {/* Padding sits on this wrapper rather than the scroller itself: a
          snap-x container with its own padding gets pre-scrolled by that
          amount in Chromium, which cancels the inset out. */}
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <ul
          ref={ref}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden pb-4"
        >
          {loop.map((it, i) => {
            const clone = i < items.length || i >= items.length * 2;
            return (
              <li
                key={`${it.title}-${i}`}
                aria-hidden={clone ? true : undefined}
                className="w-[76vw] shrink-0 snap-start sm:w-[42vw] lg:w-[calc((100%-60px)/4)]"
              >
                <Link
                  href={it.href}
                  data-card
                  tabIndex={clone ? -1 : undefined}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-surface bg-paper-deep"
                >
                  <Image
                    src={`/img/${it.src}.webp`}
                    alt={clone ? "" : it.alt}
                    fill
                    sizes="(max-width: 640px) 76vw, (max-width: 1024px) 42vw, 25vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-basalt/92 via-basalt/35 to-transparent" />

                  {it.tag && (
                    <span className="absolute left-4 top-4 rounded-full border border-paper/70 bg-basalt/30 px-3 py-1 text-xs font-medium uppercase tracking-wide text-paper backdrop-blur-sm">
                      {it.tag}
                    </span>
                  )}

                  <span className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <span className="block font-display text-lg leading-tight text-paper">
                      {it.title}
                    </span>
                    {it.desc && (
                      <span className="mt-2 block text-[13px] leading-[1.6] text-paper/75">
                        {it.desc}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Position within one pass rather than progress towards an end. */}
      <div className="mx-auto mt-8 max-w-[1400px] px-5 lg:px-10">
        <div className="relative h-px w-full bg-basalt/10">
          <span
            className="absolute inset-y-0 left-0 bg-basalt"
            style={{ width: `${8 + progress * 92}%` }}
          />
        </div>
      </div>
    </section>
  );
}
