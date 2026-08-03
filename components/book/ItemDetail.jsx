"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Bag, Check, Heart, Minus, Plus, SealCheck } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/CartProvider";
import { useFavourites } from "@/components/cart/FavouritesProvider";
import { currency } from "@/lib/catalogue";

/*
  The buying half of a detail page: gallery on the left, everything you choose
  on the right. Modelled on the reference product page — thumbnail column,
  title and price, a row of option chips, then one primary action — with the
  vocabulary swapped for a lodge: layouts and bed setups instead of colours and
  sizes, nights and days instead of quantity.
*/
export default function ItemDetail({ item }) {
  const { add } = useCart();
  const { has, toggle } = useFavourites();
  const saved = has(item.slug);
  const [active, setActive] = useState(0);
  const [option, setOption] = useState(item.option.values[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add(item, { option, qty });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      {/* Gallery */}
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-surface bg-paper-deep">
          <Image
            key={item.images[active]}
            src={`/img/${item.images[active]}.webp`}
            alt={`${item.name}, photograph ${active + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>

        {item.images.length > 1 && (
          <ul className="mt-4 flex gap-3">
            {item.images.map((img, i) => (
              <li key={img} className="flex-1">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={i === active ? "true" : undefined}
                  className={`relative block aspect-square w-full overflow-hidden rounded-field border transition-colors ${
                    i === active ? "border-basalt" : "border-transparent hover:border-basalt/30"
                  }`}
                >
                  <span className="sr-only">
                    Show photograph {i + 1} of {item.images.length}
                  </span>
                  <Image
                    src={`/img/${img}.webp`}
                    alt=""
                    aria-hidden
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Choices */}
      <div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-basalt/20 px-3 py-1 text-xs text-sage">
            {item.category}
          </span>
          <span className="rounded-full border border-basalt/20 px-3 py-1 text-xs text-sage">
            {item.badge}
          </span>
        </div>

        <h1 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.06]">
          {item.name}
        </h1>
        <p className="mt-4 max-w-lg leading-relaxed text-sage">{item.lead}</p>

        <p className="mt-8 font-display text-[2.6rem] leading-none">
          {currency(item.price)}
          <span className="ml-2 align-middle text-base text-sage">/{item.unit}</span>
        </p>

        <div className="mt-9">
          <h2 className="label text-sage">{item.option.label}</h2>
          <ul className="mt-3.5 flex flex-wrap gap-2">
            {item.option.values.map((value) => (
              <li key={value}>
                <button
                  type="button"
                  onClick={() => setOption(value)}
                  aria-pressed={option === value}
                  className={`rounded-full border px-4 py-2.5 text-sm transition-colors ${
                    option === value
                      ? "border-basalt bg-basalt text-paper"
                      : "border-basalt/20 text-basalt hover:border-basalt"
                  }`}
                >
                  {value}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="label text-sage">
            {item.kind === "room" ? "Nights" : "Days"}
          </h2>
          <div className="mt-3.5 inline-flex items-center gap-1 rounded-full border border-basalt/20 p-1">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-basalt hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-basalt"
            >
              <span className="sr-only">One fewer</span>
              <Minus size={14} weight="light" />
            </button>
            <span className="min-w-10 text-center font-mono text-sm" aria-live="polite">
              {String(qty).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(30, q + 1))}
              className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-basalt hover:text-paper"
            >
              <span className="sr-only">One more</span>
              <Plus size={14} weight="light" />
            </button>
          </div>
        </div>

        <div className="mt-9 flex items-center gap-3">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-full bg-basalt px-8 py-4 font-medium text-paper transition-colors hover:bg-basalt-raised active:scale-[0.99]"
          >
            {added ? <Check size={17} weight="bold" /> : <Bag size={17} weight="light" />}
            {added ? "Added to your enquiry" : "Add to booking"}
          </button>
          <button
            type="button"
            onClick={() => toggle(item.slug)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from favourites" : "Save to favourites"}
            className={`grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full border transition-colors ${
              saved
                ? "border-basalt bg-basalt text-paper"
                : "border-basalt/20 hover:border-basalt hover:bg-basalt hover:text-paper"
            }`}
          >
            <Heart size={17} weight={saved ? "fill" : "light"} />
          </button>
        </div>

        <p className="mt-4 flex items-center gap-2 text-sm text-sage">
          <SealCheck size={15} weight="light" className="shrink-0" />
          No payment is taken here. The lodge confirms availability and the rate
          before anything is due.
        </p>

        <dl className="mt-10 divide-y divide-basalt/10 border-t border-basalt/10">
          {item.specs.map((spec) => (
            <div key={spec.label} className="flex items-baseline justify-between gap-6 py-3.5">
              <dt className="text-sm text-sage">{spec.label}</dt>
              <dd className="text-right text-sm text-basalt">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
