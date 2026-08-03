'use client'
import Image from "next/image";
import { Star } from "@phosphor-icons/react/dist/ssr";
import Reveal from "@/components/Reveal";
import { testimonials, testimonialGallery } from "@/lib/content";
import { useState, useEffect, useRef } from "react";

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

/*
  A bento of five real photographs with the headline as the sixth cell,
  not a separate column beside the photos. Standard col-span/row-span, the
  same technique the About and Wellness sections already use, rather than
  hand-placed grid lines: five images, one headline, six cells, no gaps.
*/
export default function Testimonials() {
  const [p1, p2, p3, p4, p5] = testimonialGallery;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Number of reviews to show per slide (3 on desktop, 1 on mobile)
  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 1 : 3;
    }
    return 3;
  };

  const itemsPerSlide = getItemsPerSlide();
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, totalSlides]);

  // Get current visible reviews
  const getVisibleReviews = () => {
    const start = currentIndex * itemsPerSlide;
    const end = start + itemsPerSlide;
    return testimonials.slice(start, end);
  };

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10 lg:py-36">
      {/* Section Title and Subtitle */}
      <Reveal>
        <div className="mb-12 text-center">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-basalt">
            What Our Guests Say
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sage text-[clamp(1rem,1.2vw,1.2rem)] leading-relaxed">
            Real stories from real people who've experienced the magic of our retreats
          </p>
        </div>
      </Reveal>

      {/* Photo Grid */}
      <Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2 sm:gap-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-surface bg-paper-deep sm:aspect-auto sm:row-span-2">
            <Image src={`/img/${p1}.webp`} alt="" aria-hidden fill sizes="(max-width: 640px) 50vw, 22vw" className="object-cover" />
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-surface bg-paper-deep sm:aspect-auto">
            <Image src={`/img/${p2}.webp`} alt="" aria-hidden fill sizes="(max-width: 640px) 50vw, 22vw" className="object-cover" />
          </div>

          {/* The headline. Photos sit above, to the left, and below it. */}
          <div className="col-span-2 flex flex-col justify-center rounded-surface bg-paper-raised p-6 sm:p-8">
            <h2 className="font-display text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1.15]">
              Trusted by guests
              <br />
              <span className="text-sage">who came back again</span>
            </h2>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-surface bg-paper-deep sm:aspect-auto">
            <Image src={`/img/${p3}.webp`} alt="" aria-hidden fill sizes="(max-width: 640px) 50vw, 22vw" className="object-cover" />
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-surface bg-paper-deep sm:aspect-auto">
            <Image src={`/img/${p4}.webp`} alt="" aria-hidden fill sizes="(max-width: 640px) 50vw, 22vw" className="object-cover" />
          </div>

          <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-surface bg-paper-deep sm:col-span-1 sm:aspect-auto">
            <Image src={`/img/${p5}.webp`} alt="" aria-hidden fill sizes="(max-width: 640px) 100vw, 22vw" className="object-cover" />
          </div>
        </div>
      </Reveal>

      {/* Reviews Slider with Pagination */}
      <div
        className="mt-16"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative overflow-hidden">
          {/* Slide Container — key forces remount per index so the
              slide-in animation replays, direction picks left vs right. */}
          <div
            key={currentIndex}
            className="grid gap-8 sm:grid-cols-3 sm:gap-6"
            style={{
              animation: `${direction === 1 ? "slideInRight" : "slideInLeft"} 500ms cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            {getVisibleReviews().map((t, i) => (
              <Reveal key={`${currentIndex}-${t.name}`} delay={0.05 * i}>
                <div className="flex items-center gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} weight="fill" className="text-basalt" />
                  ))}
                </div>
                <p className="mt-4 line-clamp-3 leading-relaxed text-sage">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-basalt text-xs font-medium text-paper">
                    {initials(t.name)}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-basalt">{t.name}</span>
                    <span className="block text-xs text-sage">{t.role}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Arrow — Pagination Dots — Arrow, all in one row */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prevSlide}
            className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full  hover:bg-white/20 transition-colors duration-200 border border-paper-deep"
            aria-label="Previous reviews"
          >
            <svg className="w-5 h-5 text-basalt" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2.5 bg-basalt'
                    : 'w-2.5 h-2.5 bg-paper-deep hover:bg-sage/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full  hover:bg-white/20 transition-colors duration-200 border border-paper-deep"
            aria-label="Next reviews"
          >
            <svg className="w-5 h-5 text-basalt" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}