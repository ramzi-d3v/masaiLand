"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsapClient";

/*
  Runs once, on the first full page load only (mounted from the root layout,
  which Next.js keeps in place across client-side navigations — it never
  remounts on an internal Link click).

  Reveal borrows the layered-disc technique from the studio's own TMS-style
  preloader: two stacked discs, each gathering outward fast then retracting
  on a circular clip-path toward a different offset point, staggered a beat
  apart, so the wipe reads as two distinct pulses rather than one flat wipe.
  Kept to the site's own basalt/paper palette rather than that reference's
  brand colours.
*/
export default function Preloader() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const rootRef = useRef(null);
  const logoRef = useRef(null);
  const ringRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // The admin dashboard is its own tool, not the marketing site's
    // cinematic entrance — skip the reveal there entirely.
    if (isAdmin) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";
    const main = document.getElementById("main");

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(safety);
      document.body.style.overflow = "";
      if (main) gsap.set(main, { clearProps: "all" });
      window.dispatchEvent(new CustomEvent("preloader:complete"));
      setGone(true);
    };

    // Safety net: GSAP's ticker rides on requestAnimationFrame, which a
    // backgrounded/throttled tab can stall indefinitely. Never let that trap
    // a visitor behind a locked, invisible page — force the reveal open
    // after a ceiling no real run of this timeline should ever reach.
    const safety = setTimeout(finish, 6000);

    if (reduce) {
      if (main) gsap.set(main, { opacity: 1, y: 0, scale: 1 });
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(rootRef.current, { opacity: 0, duration: 0.35, delay: 0.2 });
      return () => {
        tl.kill();
        clearTimeout(safety);
      };
    }

    if (main) gsap.set(main, { opacity: 0, y: 28, scale: 1.035, transformOrigin: "50% 40%" });
    gsap.set([frontRef.current, backRef.current], { clipPath: "circle(150% at 50% 50%)" });
    gsap.set(logoRef.current, { opacity: 0, scale: 0.9 });
    gsap.set(ringRef.current, { opacity: 0, scale: 0.2 });

    const tl = gsap.timeline({ onComplete: finish });

    // Logo in, hold, then a small confident pulse to cue the reveal.
    tl.to(logoRef.current, { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" })
      .to(logoRef.current, {}, "+=0.45")
      .to(logoRef.current, { scale: 1.1, duration: 0.22, ease: "power2.out" })
      .to(logoRef.current, { opacity: 0, scale: 1.3, duration: 0.5, ease: "power2.in" }, "-=0.02")

      // Front disc (basalt): gathers toward the top-left, then retracts there.
      .to(
        frontRef.current,
        { clipPath: "circle(160% at 20% 15%)", duration: 0.24, ease: "power1.in" },
        "-=0.42"
      )
      .to(frontRef.current, { clipPath: "circle(0% at 20% 15%)", duration: 0.95, ease: "power4.inOut" })

      // Back disc (basalt-raised, one step lighter): a beat behind, toward
      // the bottom-right — the second pulse.
      .to(
        backRef.current,
        { clipPath: "circle(160% at 82% 88%)", duration: 0.24, ease: "power1.in" },
        "-=0.75"
      )
      .to(
        backRef.current,
        { clipPath: "circle(0% at 82% 88%)", duration: 1.05, ease: "power4.inOut" },
        "-=0.7"
      )

      // A ring shockwave rides out from the centre, under both discs.
      .to(ringRef.current, { opacity: 0.5, scale: 1, duration: 0.35, ease: "power2.out" }, "-=1.55")
      .to(ringRef.current, { opacity: 0, scale: 2.6, duration: 0.9, ease: "power3.out" }, "-=1.5")

      // The page rises, scales down to rest and settles — met rather than
      // just uncovered.
      .to(
        main || {},
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out", clearProps: "transform" },
        "-=1.1"
      );

    return () => {
      tl.kill();
      clearTimeout(safety);
    };
  }, [isAdmin]);

  if (gone || isAdmin) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {/* Back disc: retracts second, toward the bottom-right. */}
      <div
        ref={backRef}
        className="absolute inset-0 bg-basalt-raised"
        style={{ willChange: "clip-path" }}
      />
      {/* Front disc: the drawing canvas, retracts first, toward the top-left. */}
      <div
        ref={frontRef}
        className="absolute inset-0 grid place-items-center bg-basalt"
        style={{ willChange: "clip-path" }}
      >
        <div
          ref={ringRef}
          className="pointer-events-none absolute h-[220px] w-[220px] rounded-full border border-paper/50 sm:h-[280px] sm:w-[280px]"
        />
        <div ref={logoRef}>
          <Image
            src="/brand/logo-masailand-light.png"
            alt=""
            width={300}
            height={189}
            priority
            className="h-16 w-auto sm:h-20"
          />
        </div>
      </div>
    </div>
  );
}
