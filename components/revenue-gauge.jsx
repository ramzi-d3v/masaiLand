"use client";

import { useEffect, useState } from "react";
import { ArrowRightIcon, WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currency } from "@/lib/catalogue";
import { enquiries } from "@/lib/adminContent";
import { readOrders } from "@/lib/orders";
import { splitByKind } from "@/lib/earnings";

/*
  The radial tick gauge from the reference, over the demo bookings.

  The dial is drawn as individual ticks rather than an arc so the two series
  read as counted segments: ticks are handed out in proportion to what each
  category earned, brightest first, and the remainder sits dim. With no
  bookings yet the whole ring is dim and the card says why rather than
  inventing a figure to fill it.
*/

const TICKS = 56;
const GAP_DEGREES = 90; // the opening, centred on the bottom of the dial
const SWEEP = 360 - GAP_DEGREES;
/* In SVG coordinates 0° points right and angles run clockwise, so the sweep
   starts past the bottom-left and comes round to the bottom-right. */
const START = 90 + GAP_DEGREES / 2;

/* Coordinates are rounded before they reach the DOM. Unrounded floats
   stringify to slightly different decimals under Node and under the browser
   ("50.56291066169344" vs "…444"), which React reports as a hydration
   mismatch on every tick. */
const at = (deg, r) => {
  const rad = (deg * Math.PI) / 180;
  return [Number((100 + r * Math.cos(rad)).toFixed(2)), Number((100 + r * Math.sin(rad)).toFixed(2))];
};

function Dial({ split, total }) {
  const lit = total > 0 ? Math.round((split.rooms / total) * TICKS) : 0;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px]">
      <svg className="h-full w-full" viewBox="0 0 200 200">
        <title>Revenue split between rooms and halls</title>
        {Array.from({ length: TICKS }).map((_, i) => {
          const angle = START + (i / (TICKS - 1)) * SWEEP;
          const [x1, y1] = at(angle, 72);
          const [x2, y2] = at(angle, 92);
          const on = total > 0 && i < lit;
          const halls = total > 0 && !on;
          return (
            <line
              key={i}
              opacity={on ? 0.95 : halls ? 0.45 : 0.16}
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="5"
              x1={x1}
              x2={x2}
              y1={y1}
              y2={y2}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-muted">
          <WalletIcon className="size-5 text-muted-foreground" />
        </span>
        <span className="text-muted-foreground text-sm">Total revenue</span>
        <span className="font-semibold text-2xl tabular-nums">{currency(total)}</span>
      </div>
    </div>
  );
}

function LegendDot({ label, dim }) {
  return (
    <span className="flex items-center gap-2 text-sm">
      <span
        aria-hidden
        className={`size-1.5 rounded-full bg-current ${dim ? "opacity-40" : ""}`}
      />
      <span className="text-muted-foreground underline decoration-dotted underline-offset-4">
        {label}
      </span>
    </span>
  );
}

export function RevenueGauge({ className }) {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    setOrders(readOrders());
  }, []);

  const split = splitByKind(orders ?? []);
  const total = split.rooms + split.halls;

  /* The meter underneath: enquiries answered versus still waiting. Real
     counts, from the same enquiries the inbox lists. */
  const answered = enquiries.filter((e) => e.read).length;
  const pct = enquiries.length ? Math.round((answered / enquiries.length) * 100) : 0;

  return (
    <Card className={`shadow-none dark:ring-0 ${className ?? ""}`}>
      <CardContent className="flex flex-col gap-6">
        <div>
          <Dial split={split} total={total} />

          <div className="mt-2 flex items-center justify-center gap-6">
            <LegendDot label="Rooms & suites" />
            <LegendDot dim label="Conference halls" />
          </div>

          {total === 0 ? (
            <p className="mt-4 text-center text-muted-foreground text-xs leading-relaxed">
              Nothing booked in this browser yet. Complete the demo checkout and
              the dial fills in.
            </p>
          ) : (
            <p className="mt-4 text-center text-muted-foreground text-xs">
              {currency(split.rooms)} rooms · {currency(split.halls)} halls
            </p>
          )}

          <Button asChild className="mt-4 w-full" variant="secondary">
            <a href="/admin/orders">
              View detail
              <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
            </a>
          </Button>
        </div>

        <Separator />

        <div>
          <p className="text-muted-foreground text-sm">Enquiries</p>
          <p className="mt-1 font-semibold text-3xl tabular-nums">{enquiries.length}</p>

          {/* The same counted-bars idea as the dial, laid flat, with the
              answered share marked. */}
          <div className="relative mt-6">
            <span
              className="absolute -top-5 -translate-x-1/2 font-medium text-xs tabular-nums"
              style={{ left: `${pct}%` }}
            >
              {pct}%
            </span>
            <span
              aria-hidden
              className="absolute -top-1 h-2 w-px bg-foreground"
              style={{ left: `${pct}%` }}
            />
            <div aria-hidden className="flex h-10 items-stretch gap-[3px] overflow-hidden">
              {Array.from({ length: 48 }).map((_, i) => (
                <span
                  className="flex-1 bg-current"
                  key={i}
                  style={{ opacity: i / 48 < pct / 100 ? 0.9 : 0.18 }}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-6">
            <LegendDot label="Answered" />
            <LegendDot dim label="Waiting" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
