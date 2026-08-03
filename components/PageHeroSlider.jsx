"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsapClient";

const AUTOPLAY = 6;
const EASE = "power3.inOut";

const pad = (n) => String(n + 1).padStart(2, "0");
const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
  The homepage Hero, generalised: same full-bleed clip-path slide transition,
  headline reveal, counter/progress/arrows and thumbnail rail, driven by
  whatever `slides` array a page passes in (same shape as `heroSlides`).
  Used to open inner pages that have three or four real sub-destinations to
  rotate through, in place of the single static PageHero photograph.
*/
export default function PageHeroSlider({ slides, ariaLabel }) {
  const N = slides.length;
  const root = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const curRef = useRef(null);
  const animating = useRef(false);
  const indexRef = useRef(0);
  const trackPos = useRef(1);
  const autoplayTl = useRef(null);
  const [index, setIndex] = useState(0);

  const step = useCallback(() => {
    const card = trackRef.current?.children[0];
    if (!card || !trackRef.current) return 0;
    const gap = parseFloat(getComputedStyle(trackRef.current).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }, []);

  const xFor = useCallback((pos) => -pos * step(), [step]);

  const startAutoplay = useCallback(() => {
    autoplayTl.current?.kill();
    if (!barRef.current || prefersReduced() || N < 2) return;
    gsap.set(barRef.current, { width: 0 });
    autoplayTl.current = gsap.to(barRef.current, {
      width: "100%",
      duration: AUTOPLAY,
      ease: "none",
      onComplete: () => goTo((indexRef.current + 1) % N, 1),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N]);

  const goTo = useCallback(
    (next, dir) => {
      const cur = indexRef.current;
      if (animating.current || next === cur || !root.current) return;

      const q = gsap.utils.selector(root.current);
      const bgs = q(".bg-slide");
      dir = dir ?? (next > cur ? 1 : -1);

      if (prefersReduced()) {
        gsap.set(bgs, { opacity: 0, zIndex: 0, clipPath: "none", scale: 1 });
        gsap.set(bgs[next], { opacity: 1, zIndex: 1 });
        if (curRef.current) curRef.current.textContent = pad(next);
        indexRef.current = next;
        setIndex(next);
        return;
      }

      animating.current = true;
      const oldBg = bgs[cur];
      const newBg = bgs[next];
      const oldLines = q(".headline .rl > span");

      const tl = gsap.timeline({
        defaults: { ease: EASE },
        onComplete() {
          animating.current = false;
          startAutoplay();
        },
      });

      tl.to(oldLines, { yPercent: -110, duration: 0.55, stagger: 0.06 }, 0).to(
        q(".hero-fade"),
        { opacity: 0, y: -12, duration: 0.4 },
        0
      );

      tl.to(curRef.current, { yPercent: -100, opacity: 0, duration: 0.35 }, 0)
        .add(() => {
          if (curRef.current) {
            curRef.current.textContent = pad(next);
            gsap.set(curRef.current, { yPercent: 100 });
          }
        })
        .to(curRef.current, { yPercent: 0, opacity: 1, duration: 0.35 });

      if (oldBg && newBg) {
        tl.set(
          newBg,
          {
            opacity: 1,
            zIndex: 2,
            scale: 1.12,
            clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
          },
          0
        )
          .to(newBg, { clipPath: "inset(0 0% 0 0%)", duration: 1.05 }, 0.15)
          .to(newBg, { scale: 1, duration: 2.2, ease: "power2.out" }, 0.15)
          .to(oldBg, { scale: 1.06, duration: 1.05 }, 0.15)
          .add(() => {
            gsap.set(oldBg, { opacity: 0, zIndex: 0, clearProps: "clip-path,transform" });
            gsap.set(newBg, { zIndex: 1 });
          });
      }

      tl.add(() => {
        setIndex(next);
        requestAnimationFrame(() => {
          const lines = q(".headline .rl > span");
          gsap.set(lines, { yPercent: 110 });
          gsap.to(lines, { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.08 });
          gsap.fromTo(
            q(".hero-fade"),
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.18, stagger: 0.06 }
          );
        });
      }, 0.62);

      let targetPos = trackPos.current + (dir > 0 ? (next - cur + N) % N : -((cur - next + N) % N));

      if (targetPos >= N) {
        trackPos.current -= N;
        targetPos -= N;
        gsap.set(trackRef.current, { x: xFor(trackPos.current) });
      }
      if (targetPos < 0) {
        trackPos.current += N;
        targetPos += N;
        gsap.set(trackRef.current, { x: xFor(trackPos.current) });
      }

      tl.to(trackRef.current, { x: xFor(targetPos), duration: 0.9, ease: "power3.inOut" }, 0.25);
      trackPos.current = targetPos;
      indexRef.current = next;
    },
    [startAutoplay, xFor, N]
  );

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      gsap.set(trackRef.current, { x: xFor(1) });
      if (prefersReduced()) return;

      const lines = q(".headline .rl > span");
      gsap.set(lines, { yPercent: 115 });
      gsap.set(q(".hero-fade"), { opacity: 0, y: 16 });
      gsap.set(q(".slider-ui"), { y: 20, opacity: 0 });
      gsap.set(q(".thumbs"), { opacity: 0, x: 60 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, onComplete: startAutoplay });
      tl.fromTo(q(".bg-slide")[0], { scale: 1.18 }, { scale: 1, duration: 2.4, ease: "power2.out" }, 0)
        .to(lines, { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.4)
        .to(q(".hero-fade"), { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.8)
        .to(q(".slider-ui"), { y: 0, opacity: 1, duration: 0.7 }, 1.05)
        .to(q(".thumbs"), { opacity: 1, x: 0, duration: 1 }, 0.95);

      return () => autoplayTl.current?.kill();
    },
    { scope: root }
  );

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let visible = false;

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
      threshold: 0.5,
    });
    io.observe(el);

    const onKey = (e) => {
      if (!visible) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") goTo((indexRef.current + 1) % N, 1);
      if (e.key === "ArrowLeft") goTo((indexRef.current - 1 + N) % N, -1);
    };

    document.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      document.removeEventListener("keydown", onKey);
    };
  }, [goTo, N]);

  const s = slides[index] ?? slides[0];
  const doubled = [...slides, ...slides];

  return (
    <section
      ref={root}
      aria-roledescription={N > 1 ? "carousel" : undefined}
      aria-label={ariaLabel}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-basalt text-paper"
    >
      <div className="absolute inset-0 z-0">
        {slides.map((slide, i) => (
          <div
            key={slide.img}
            className="bg-slide absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0, willChange: "transform, opacity, clip-path" }}
          >
            <Image
              src={`/img/${slide.img}.webp`}
              alt={i === 0 ? slide.alt : ""}
              aria-hidden={i === 0 ? undefined : true}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-basalt/30" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(96deg,rgba(23,26,25,.82) 0%,rgba(23,26,25,.62) 26%,rgba(23,26,25,.18) 56%,rgba(23,26,25,0) 78%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg,rgba(23,26,25,.62) 0%,rgba(23,26,25,.12) 26%,rgba(23,26,25,.20) 58%,rgba(23,26,25,.78) 100%)",
              }}
            />
          </div>
        ))}
      </div>

      <div className="absolute left-5 right-5 top-1/2 z-10 max-w-[900px] -translate-y-1/2 md:left-10 md:right-auto">
        <h1 className="headline font-hero text-[clamp(2.4rem,5.6vw,4.6rem)] leading-[1.12]" aria-live="polite">
          <span className="rl">
            <span>{s.titleA}</span>
          </span>
          {s.titleB && (
            <span className="rl">
              <span>
                {s.titleB.pre}
                {s.titleB.em && <em>{s.titleB.em}</em>}
                {s.titleB.post}
              </span>
            </span>
          )}
        </h1>
        <p className="hero-fade mt-7 max-w-[430px] leading-[1.7] text-paper/75">{s.sub}</p>
      </div>

      {N > 1 && (
        <div className="slider-ui absolute bottom-12 left-5 z-10 hidden items-center gap-6 sm:flex md:left-10">
          <p className="flex items-baseline">
            <span className="sr-only">Slide </span>
            <span className="inline-block h-10 overflow-hidden">
              <span ref={curRef} className="inline-block font-mono text-[34px] leading-[40px]">
                01
              </span>
            </span>
            <span className="ml-1.5 font-mono text-[14px] text-paper/55">
              /{String(N).padStart(2, "0")}
            </span>
          </p>
          <div className="h-px w-[120px] overflow-hidden bg-paper/25">
            <i ref={barRef} className="block h-full w-0 bg-paper" />
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => goTo((indexRef.current - 1 + N) % N, -1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-paper/30 transition-colors hover:bg-paper hover:text-basalt active:scale-90"
            >
              <span className="sr-only">Previous slide</span>
              <ArrowLeft size={16} weight="light" />
            </button>
            <button
              type="button"
              onClick={() => goTo((indexRef.current + 1) % N, 1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-paper/30 transition-colors hover:bg-paper hover:text-basalt active:scale-90"
            >
              <span className="sr-only">Next slide</span>
              <ArrowRight size={16} weight="light" />
            </button>
          </div>
        </div>
      )}

      {N > 1 && (
        <div
          className="thumbs absolute bottom-10 right-5 z-10 hidden w-[calc(260px*1.5+16px)] overflow-hidden md:right-10 md:block xl:w-[calc(300px*1.5+20px)]"
          style={{
            maskImage: "linear-gradient(90deg,#000 74%,transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg,#000 74%,transparent 100%)",
          }}
        >
          <ul ref={trackRef} className="flex gap-4 xl:gap-5" style={{ willChange: "transform" }}>
            {doubled.map((slide, i) => (
              <li key={`${slide.img}-${i}`} className="w-[260px] shrink-0 xl:w-[300px]">
                <Link href={slide.href} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-surface">
                    <Image
                      src={`/img/${slide.img}.webp`}
                      alt=""
                      aria-hidden
                      fill
                      sizes="300px"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="mt-3.5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-paper">{slide.place}</p>
                      <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-paper/65">
                        {slide.desc}
                      </p>
                    </div>
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-paper/30 transition-colors group-hover:bg-paper group-hover:text-basalt">
                      <ArrowUpRight size={13} weight="bold" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
