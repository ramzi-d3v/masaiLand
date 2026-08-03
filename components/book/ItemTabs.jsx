"use client";

import { useState } from "react";
import { Info, SealCheck } from "@phosphor-icons/react";
import { testimonials } from "@/lib/content";

/*
  Details / What's included / Reviews, on the same tab row the reference puts
  under its gallery.

  On reviews: lib/content.js is explicit that its testimonials are illustrative
  placeholders, not real guest reviews, so nothing here invents an aggregate
  score or a review count to sit beside them. The star summary the reference
  shows in this slot stays out until real reviews are connected — Tripadvisor
  is the obvious source, and the footer already links to it. What the panel
  does carry is the layout, ready for that data, and a plain statement of what
  the quotes currently are.
*/

const TABS = ["Details", "What's included", "Reviews"];

export default function ItemTabs({ item }) {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28">
      <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-basalt/12">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 pb-4 font-display text-2xl leading-none transition-colors ${
              tab === t ? "border-basalt text-basalt" : "border-transparent text-sage hover:text-basalt"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="pt-10">
        {tab === "Details" && (
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <div>
              <p className="max-w-2xl text-lg leading-relaxed text-sage">{item.body}</p>
              <p className="mt-5 max-w-2xl leading-relaxed text-sage">
                {item.kind === "room"
                  ? "Every room at Masailand opens onto a balcony, and the lodge sits at the top of a hill outside Arusha with Mount Meru filling the horizon to the east."
                  : "The hall sits on the same hilltop property as the rooms, so delegates stay, eat and meet without leaving the grounds."}
              </p>
            </div>
            <dl className="divide-y divide-basalt/10 border-t border-basalt/10">
              {item.specs.map((spec) => (
                <div key={spec.label} className="flex items-baseline justify-between gap-6 py-3.5">
                  <dt className="text-sm text-sage">{spec.label}</dt>
                  <dd className="text-right text-sm">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {tab === "What's included" && (
          <ul className="grid gap-x-10 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {item.included.map((entry) => (
              <li key={entry} className="flex items-start gap-3 text-sage">
                <SealCheck size={16} weight="light" className="mt-1 shrink-0 text-basalt" />
                {entry}
              </li>
            ))}
          </ul>
        )}

        {tab === "Reviews" && (
          <div>
            <div className="mb-8 flex max-w-2xl items-start gap-3 rounded-surface border border-basalt/12 bg-paper-raised p-5">
              <Info size={17} weight="light" className="mt-0.5 shrink-0 text-sage" />
              <p className="text-sm leading-relaxed text-sage">
                These quotes are illustrative placeholders, not real guest
                reviews, so no rating or review count is shown beside them. Wire
                this panel to the lodge&rsquo;s Tripadvisor listing and the
                score belongs here.
              </p>
            </div>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((t) => (
                <li
                  key={t.name}
                  className="rounded-surface border border-basalt/12 p-6"
                >
                  <p className="leading-relaxed text-sage">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-basalt/20 text-sm">
                      {t.name.charAt(0)}
                    </span>
                    <span className="text-sm">
                      <span className="block text-basalt">{t.name}</span>
                      <span className="block text-sage">{t.role}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
