"use client";

import { motion, useReducedMotion } from "motion/react";
import { circuit } from "@/lib/content";

/*
  The lodge sells its position before it sells its rooms, so the distances get
  a real chart rather than a paragraph. Ring radius encodes distance by road,
  using the figures the property publishes. Angles space the labels out, they
  are not bearings, and the rings are annotated in km so the scale is legible.

  Every destination is also listed as text beside the chart, so nothing here
  is only available to people who can see the drawing.
*/

const SIZE = 620;
const C = SIZE / 2;
const R_MIN = 62;
const R_MAX = 252;
const MAX_KM = 348;

const RINGS = [100, 200, 300];
const ANGLES = [-68, 18, 152, 222];

const radiusFor = (km) => R_MIN + (km / MAX_KM) * (R_MAX - R_MIN);

function point(km, angleDeg) {
  const r = radiusFor(km);
  const a = (angleDeg * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a), r };
}

export default function CircuitDial() {
  const reduce = useReducedMotion();

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      <div className="relative mx-auto w-full max-w-[560px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full overflow-visible"
          role="img"
          aria-label="Distance from Masailand Safari and Lodge to Kilimanjaro International Airport, Mount Kilimanjaro, the Ngorongoro Crater and the Serengeti."
        >
          {RINGS.map((km, i) => (
            <motion.circle
              key={km}
              cx={C}
              cy={C}
              r={radiusFor(km)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-paper/15"
              initial={reduce ? false : { scale: 0.86, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: reduce ? 0 : 0.9,
                delay: reduce ? 0 : i * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: `${C}px ${C}px` }}
            />
          ))}

          {RINGS.map((km) => (
            <text
              key={`lbl-${km}`}
              x={C}
              y={C - radiusFor(km) + 16}
              textAnchor="middle"
              className="fill-paper/30 font-mono text-[13px] tracking-widest"
            >
              {km} km
            </text>
          ))}

          {circuit.map((d, i) => {
            const p = point(d.km, ANGLES[i]);
            const flip = p.x < C;
            return (
              <motion.g
                key={d.name}
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: reduce ? 0 : 0.6,
                  delay: reduce ? 0 : 0.35 + i * 0.13,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <motion.line
                  x1={C}
                  y1={C}
                  x2={p.x}
                  y2={p.y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-paper/20"
                  initial={reduce ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: reduce ? 0 : 0.7,
                    delay: reduce ? 0 : 0.35 + i * 0.13,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
                <circle cx={p.x} cy={p.y} r="7" className="fill-paper" />
                <circle cx={p.x} cy={p.y} r="15" className="fill-paper/20" />
                <text
                  x={flip ? p.x - 26 : p.x + 26}
                  y={p.y - 2}
                  textAnchor={flip ? "end" : "start"}
                  className="hidden fill-paper font-sans text-[19px] sm:block"
                >
                  {d.name.replace("Kilimanjaro International Airport", "Kilimanjaro Airport")}
                </text>
                <text
                  x={flip ? p.x - 26 : p.x + 26}
                  y={p.y + 22}
                  textAnchor={flip ? "end" : "start"}
                  className="hidden fill-paper font-mono text-[15px] tracking-wide sm:block"
                >
                  {d.distance} {d.unit}
                </text>
              </motion.g>
            );
          })}

          <circle cx={C} cy={C} r="46" className="fill-paper" />
          <text
            x={C}
            y={C + 2}
            textAnchor="middle"
            className="fill-basalt font-sans text-[17px] font-medium"
          >
            The
          </text>
          <text
            x={C}
            y={C + 22}
            textAnchor="middle"
            className="fill-basalt font-sans text-[17px] font-medium"
          >
            lodge
          </text>
        </svg>
      </div>

      <div>
        <h2 className="font-display text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.08] text-paper">
          Everything north of here is{" "}
          <em className="text-paper">a morning's drive</em>
        </h2>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/70">
          The lodge sits on a hill outside Arusha, at the mouth of the northern
          safari circuit. You unpack once and drive out from here.
        </p>

        <dl className="mt-10 divide-y divide-basalt-line border-t border-basalt-line">
          {circuit.map((d) => (
            <div key={d.name} className="flex items-baseline justify-between gap-6 py-5">
              <div>
                <dt className="text-lg text-paper">{d.name}</dt>
                <p className="mt-1 text-sm text-paper/50">{d.note}</p>
              </div>
              <dd className="shrink-0 font-mono text-xl text-paper">
                {d.distance}
                <span className="ml-1 text-sm text-paper/50">{d.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
