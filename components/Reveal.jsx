"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

/*
  Scroll reveal. Motivation: sections enter in reading order so the eye lands
  on the headline before the supporting detail. Collapses to static when the
  visitor asks for reduced motion.
*/
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  as = "div",
  className = "",
  amount = 0.25,
}) {
  const reduce = useReducedMotion();
  const MotionTag = useMemo(() => motion[as] ?? motion.div, [as]);

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: reduce ? 0 : 0.7,
        delay: reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
