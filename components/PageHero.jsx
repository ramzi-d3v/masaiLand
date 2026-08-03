"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Barbell,
  Bathtub,
  Bed,
  Binoculars,
  CalendarBlank,
  Camera,
  Car,
  Clock,
  Compass,
  EnvelopeSimple,
  FileText,
  Flower,
  ForkKnife,
  Images,
  Leaf,
  MapPin,
  Martini,
  Mountains,
  PersonSimpleSwim,
  Phone,
  Presentation,
  SealCheck,
  Snowflake,
  SpeakerHigh,
  Sun,
  Tree,
  UsersThree,
  WifiHigh,
  Wine,
} from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsapClient";

/*
  The inner-page hero. Unlike the homepage, which stays full-bleed and edge to
  edge, every page below it opens on an inset photograph: a rounded card held
  inside the same 1400px gutter the rest of the site uses, sitting on paper,
  with the header solid above it rather than floating over the picture.

  Everything the page needs to say sits inside that card. The headline is set
  along the bottom left, the standfirst holds the right-hand column beside it,
  and a single meta rail runs across the foot of the frame: a two-line figure
  on the left, a segmented pill next to it, a hairline through the middle, and
  the page's facts as chips on the right.

  Pages with more than one real sub-destination pass several slides and the
  frame rotates through them. The rotation reuses the two controls the rail
  already has rather than adding furniture of its own: the pill's segments
  become the slide buttons, and the hairline becomes the autoplay track.
*/

const AUTOPLAY = 6;
const EASE = "power3.inOut";

/* Chips and the static pill name their icon, so pages stay server components
   and never have to import an icon set of their own. */
const ICONS = {
  barbell: Barbell,
  bathtub: Bathtub,
  bed: Bed,
  binoculars: Binoculars,
  calendar: CalendarBlank,
  camera: Camera,
  car: Car,
  clock: Clock,
  compass: Compass,
  email: EnvelopeSimple,
  file: FileText,
  flower: Flower,
  fork: ForkKnife,
  images: Images,
  leaf: Leaf,
  map: MapPin,
  martini: Martini,
  mountains: Mountains,
  phone: Phone,
  pool: PersonSimpleSwim,
  presentation: Presentation,
  seal: SealCheck,
  snowflake: Snowflake,
  speaker: SpeakerHigh,
  sun: Sun,
  tree: Tree,
  users: UsersThree,
  wifi: WifiHigh,
  wine: Wine,
};

function Glyph({ name, size = 14 }) {
  const Icon = ICONS[name] ?? SealCheck;
  return <Icon size={size} weight="light" aria-hidden />;
}

const pad = (n) => String(n + 1).padStart(2, "0");
const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PageHero({
  slides,
  meta,
  chips = [],
  icons = [],
  included,
  ariaLabel,
}) {
  const N = slides.length;
  const root = useRef(null);
  const barRef = useRef(null);
  const animating = useRef(false);
  const indexRef = useRef(0);
  const autoplayTl = useRef(null);
  const [index, setIndex] = useState(0);

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

      /* The copy clears the frame first, so the wipe never runs underneath
         a headline that belongs to the outgoing slide. */
      tl.to(oldLines, { yPercent: -110, duration: 0.55, stagger: 0.06 }, 0).to(
        q(".hero-fade"),
        { opacity: 0, y: -12, duration: 0.4 },
        0
      );

      if (oldBg && newBg) {
        tl.set(
          newBg,
          {
            opacity: 1,
            zIndex: 2,
            scale: 1.1,
            clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
          },
          0
        )
          .to(newBg, { clipPath: "inset(0 0% 0 0%)", duration: 1.05 }, 0.15)
          .to(newBg, { scale: 1, duration: 2, ease: "power2.out" }, 0.15)
          .to(oldBg, { scale: 1.05, duration: 1.05 }, 0.15)
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
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.18 }
          );
        });
      }, 0.6);

      indexRef.current = next;
    },
    [startAutoplay]
  );

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      if (prefersReduced()) return;

      const lines = q(".headline .rl > span");
      gsap.set(lines, { yPercent: 115 });
      gsap.set(q(".hero-fade"), { opacity: 0, y: 16 });
      gsap.set(q(".hero-rail"), { opacity: 0, y: 22 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, onComplete: startAutoplay });
      /* The card opens as a band and grows to full height while the first
         photograph eases back out of its own zoom. */
      tl.fromTo(
        q(".hero-card"),
        { clipPath: "inset(38% 0% 38% 0% round var(--r-surface))" },
        { clipPath: "inset(0% 0% 0% 0% round var(--r-surface))", duration: 1.2 },
        0
      )
        .fromTo(q(".bg-slide")[0], { scale: 1.16 }, { scale: 1, duration: 2.2, ease: "power2.out" }, 0)
        .to(lines, { yPercent: 0, duration: 1, stagger: 0.1 }, 0.5)
        .to(q(".hero-fade"), { opacity: 1, y: 0, duration: 0.8 }, 0.8)
        .to(q(".hero-rail"), { opacity: 1, y: 0, duration: 0.8 }, 0.9);

      return () => autoplayTl.current?.kill();
    },
    { scope: root }
  );

  useEffect(() => {
    const el = root.current;
    if (!el || N < 2) return;
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

  return (
    <section
      ref={root}
      aria-roledescription={N > 1 ? "carousel" : undefined}
      aria-label={ariaLabel}
      className="bg-paper px-5 pb-2 pt-[84px] lg:px-10 lg:pb-4 lg:pt-[92px]"
    >
      <div className="mx-auto max-w-[1400px]">
        <div
          className="hero-card relative isolate flex h-[clamp(520px,74dvh,780px)] flex-col justify-end overflow-hidden rounded-surface bg-basalt text-paper"
          style={{ clipPath: "inset(0% 0% 0% 0% round var(--r-surface))" }}
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
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  className="object-cover"
                />
                {/* Two layers only. The card is already framed by paper, so it
                    needs a floor under the type rather than the homepage's
                    full three-sided wash. */}
                <div className="absolute inset-0 bg-basalt/25" />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg,rgba(23,26,25,0) 14%,rgba(23,26,25,.30) 34%,rgba(23,26,25,.72) 48%,rgba(23,26,25,.86) 62%,rgba(23,26,25,.93) 80%,rgba(23,26,25,.96) 100%)",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,330px)] lg:gap-12">
              <h1
                className="headline max-w-[16ch] font-hero text-[clamp(2.3rem,5.6vw,4.5rem)] leading-[1.04]"
                aria-live={N > 1 ? "polite" : undefined}
              >
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
              {(s.sub || s.note) && (
                <div className="hero-fade lg:pb-3">
                  {s.sub && <p className="text-[13.5px] leading-[1.7] text-paper/80">{s.sub}</p>}
                  {/* The second line carries the plain facts of the frame:
                      the size and the outlook of a room, a hall's seating,
                      an opening time. Set below a rule so it reads as a
                      caption to the standfirst rather than more of it. */}
                  {s.note && (
                    <p className="mt-3.5 border-t border-paper/20 pt-3 text-[12px] leading-[1.6] text-paper/60">
                      {s.note}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* The meta rail. Figure, pill, hairline, and then whatever the
                page puts on the right: a short static cluster of chips, or the
                sliding "what's included" rail when the list is long enough to
                be worth reading through. */}
            <div className="hero-rail mt-8 flex flex-wrap items-end gap-x-5 gap-y-5 lg:mt-10 lg:flex-nowrap">
              {meta && (
                <p className="shrink-0 text-[11.5px] leading-[1.35]">
                  <span className="block text-paper">{meta.value}</span>
                  <span className="block text-paper/65">{meta.label}</span>
                </p>
              )}

              {N > 1 ? (
                <div className="glass flex shrink-0 items-center gap-1 rounded-full p-1">
                  {slides.map((slide, i) => (
                    <button
                      key={slide.img}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === index ? "true" : undefined}
                      className={`grid h-8 w-8 place-items-center rounded-full font-mono text-[11px] transition-colors ${
                        i === index
                          ? "bg-paper text-basalt"
                          : "text-paper/70 hover:bg-paper/15 hover:text-paper"
                      }`}
                    >
                      <span className="sr-only">Show </span>
                      {pad(i)}
                      <span className="sr-only">, {slide.place ?? slide.titleA}</span>
                    </button>
                  ))}
                </div>
              ) : (
                icons.length > 0 && (
                  <div className="glass flex shrink-0 items-center gap-1 rounded-full p-1">
                    {icons.map((name) => (
                      <span key={name} className="grid h-8 w-8 place-items-center rounded-full">
                        <Glyph name={name} />
                      </span>
                    ))}
                  </div>
                )
              )}

              {/* Plain rule when the frame is static, autoplay track when it
                  rotates. Either way it is the same hairline. */}
              <div className="mb-4 hidden h-px flex-1 overflow-hidden bg-paper/25 lg:block">
                <i ref={barRef} className="block h-full w-0 bg-paper" />
              </div>

              {included ? (
                <div className="min-w-0 grow basis-full lg:w-[560px] lg:shrink-0 lg:grow-0 lg:basis-auto">
                  <p className="label mb-3 text-paper/55">{included.label ?? "What's included"}</p>
                  {/* Too many entries to sit still, so they run past instead.
                      Hover or tab into the rail and it stops. */}
                  <div
                    className="chip-strip relative overflow-hidden"
                    style={{
                      maskImage:
                        "linear-gradient(90deg,transparent 0,#000 5%,#000 86%,transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(90deg,transparent 0,#000 5%,#000 86%,transparent 100%)",
                    }}
                  >
                    <ul className="chip-strip-track flex w-max">
                      {[...included.items, ...included.items].map((item, i) => {
                        const label = item.label ?? item;
                        return (
                          <li
                            key={`${label}-${i}`}
                            aria-hidden={i >= included.items.length ? true : undefined}
                            className="glass mr-2 inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[12.5px] leading-none text-paper/90"
                          >
                            <Glyph name={item.icon ?? "seal"} size={13} />
                            {label}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ) : (
                chips.length > 0 && (
                  <ul className="flex flex-wrap items-center gap-2 lg:shrink-0">
                    {chips.map((chip) => (
                      <li
                        key={chip.label}
                        className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12.5px] leading-none text-paper/90"
                      >
                        <Glyph name={chip.icon} size={13} />
                        {chip.label}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
