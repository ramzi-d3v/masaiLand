"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { diningSlides } from "@/lib/content";

const AUTOPLAY_MS = 5500;
const N = diningSlides.length;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
  A smaller, quieter cousin of the hero slider: the photograph is the
  background rather than the whole viewport, the copy sits left instead of
  bottom-left, and slide changes crossfade instead of wiping, so this reads
  as a supporting moment rather than repeating the hero's own entrance.
*/
export default function DiningSlider() {
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((next) => {
    setIndex(((next % N) + N) % N);
    setKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (prefersReduced()) return;
    timerRef.current = setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(timerRef.current);
  }, [index, goTo]);

  const s = diningSlides[index];

  return (
    <section className="mx-auto max-w-[1600px] py-10 px-5 lg:px-10">
      <div className="relative overflow-hidden rounded-surface bg-basalt">
        <div className="relative min-h-[46dvh] sm:min-h-[50dvh] lg:min-h-[54dvh]">
          {diningSlides.map((slide, i) => (
            <div
              key={slide.image}
              aria-hidden={i === index ? undefined : true}
              className="absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ opacity: i === index ? 1 : 0 }}
            >
              <Image
                src={`/img/${slide.image}.webp`}
                alt={i === index ? slide.title : ""}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 1600px"
                className="object-cover"
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-r from-basalt/88 via-basalt/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-basalt/55 via-transparent to-transparent" />

          {/* Left overlay: title and copy swap with the slide, the button
              and pagination cluster stay put. */}
          <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center px-6 sm:px-10 lg:px-14">
            <h2
              key={index}
              className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.12] text-paper"
            >
              {s.title}
            </h2>
            <p key={`${index}-body`} className="mt-4 leading-relaxed text-paper/78">
              {s.body}
            </p>
            <Link
              href="/wine-dine"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-paper px-7 py-3.5 font-medium text-basalt transition-colors hover:bg-white"
            >
              Wine & Dine
              <ArrowUpRight size={16} weight="bold" />
            </Link>
          </div>

          {/* Pagination: counter, progress line, arrows. */}
          <div className="absolute bottom-6 left-6 flex items-center gap-5 sm:bottom-8 sm:left-10 lg:left-14">
            <p className="flex items-baseline font-mono text-paper">
              <span className="text-xl">{String(index + 1).padStart(2, "0")}</span>
              <span className="ml-1 text-sm text-paper/55">/{String(N).padStart(2, "0")}</span>
            </p>
            <div className="h-px w-16 overflow-hidden bg-paper/25 sm:w-20">
              <span
                key={key}
                className="block h-full w-full bg-paper motion-safe:w-0 motion-safe:animate-[diningProgress_5500ms_linear_forwards]"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                className="grid h-9 w-9 place-items-center rounded-full border border-paper/30 text-paper transition-colors hover:bg-paper hover:text-basalt"
              >
                <span className="sr-only">Previous</span>
                <ArrowLeft size={14} weight="light" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className="grid h-9 w-9 place-items-center rounded-full border border-paper/30 text-paper transition-colors hover:bg-paper hover:text-basalt"
              >
                <span className="sr-only">Next</span>
                <ArrowRight size={14} weight="light" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
