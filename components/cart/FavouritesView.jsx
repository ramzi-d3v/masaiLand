"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bag, Heart } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/CartProvider";
import { useFavourites } from "@/components/cart/FavouritesProvider";
import { catalogue, currency } from "@/lib/catalogue";

/*
  Saved rooms and halls. Only slugs are stored, so everything shown here is
  looked up fresh from the catalogue — a room that changed name or rate shows
  its current one, and a room that no longer exists simply drops out.
*/
export default function FavouritesView() {
  const { slugs, hydrated, remove, clear } = useFavourites();
  const { add } = useCart();

  const items = slugs.map((slug) => catalogue.find((i) => i.slug === slug)).filter(Boolean);

  if (!hydrated) {
    return (
      <div className="rounded-surface border border-basalt/12 p-10">
        <p className="text-sage">Loading your favourites…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-surface border border-basalt/12 bg-paper-raised p-10 text-center sm:p-16">
        <Heart size={26} weight="light" className="mx-auto text-sage" />
        <h2 className="mt-5 font-display text-3xl">Nothing saved yet</h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-sage">
          Tap the heart on any room or hall and it waits here until you are ready
          to decide.
        </p>
        <Link
          href="/book"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-basalt px-7 py-3.5 font-medium text-paper transition-colors hover:bg-basalt-raised"
        >
          Browse rooms and halls
          <ArrowRight size={15} weight="bold" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <p className="text-sm text-sage">
          {items.length} saved {items.length === 1 ? "space" : "spaces"}
        </p>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-sage underline-offset-2 hover:text-basalt hover:underline"
        >
          Clear all
        </button>
      </div>

      <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id} className="group">
            <Link href={item.href} className="block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-surface bg-paper-deep">
                <Image
                  src={`/img/${item.images[0]}.webp`}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
                <span className="absolute left-4 top-4 rounded-full border border-paper/70 bg-basalt/30 px-3 py-1 text-xs font-medium text-paper backdrop-blur-sm">
                  {item.badge}
                </span>
              </div>
              <h2 className="mt-4 font-display text-xl leading-snug">{item.name}</h2>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-sage">{item.lead}</p>
            </Link>

            <div className="mt-4 flex items-center gap-2">
              <p className="rounded-full bg-basalt px-4 py-2 text-sm font-medium text-paper">
                {currency(item.price)}
                <span className="ml-1 text-paper/60">/{item.unit}</span>
              </p>
              <button
                type="button"
                onClick={() => add(item, { option: item.option.values[0], qty: 1 })}
                aria-label={`Add ${item.name} to the booking`}
                className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-basalt/20 transition-colors hover:border-basalt hover:bg-basalt hover:text-paper"
              >
                <Bag size={16} weight="light" />
              </button>
              <button
                type="button"
                onClick={() => remove(item.slug)}
                aria-label={`Remove ${item.name} from favourites`}
                className="grid h-10 w-10 place-items-center rounded-full border border-basalt bg-basalt text-paper transition-colors hover:bg-transparent hover:text-basalt"
              >
                <Heart size={16} weight="fill" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
