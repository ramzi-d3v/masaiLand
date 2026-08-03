"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/*
  Counts once, when the figure first scrolls into view. Motivation: the numbers
  are the claim this section makes, so they arrive rather than sit there.
  Reduced motion gets the final value immediately, and the accessible name is
  always the final value so a screen reader never hears the tick.
*/
export default function CountUp({ value, suffix = "", duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setDisplay(value);
      return;
    }

    let frame;
    const start = performance.now();
    const ms = duration * 1000;
    // easeOutExpo, so it sprints then settles on the number.
    const ease = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const tick = (now) => {
      const t = Math.min((now - start) / ms, 1);
      setDisplay(Math.round(ease(t) * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      <span aria-hidden>
        {display}
        {suffix}
      </span>
    </span>
  );
}
