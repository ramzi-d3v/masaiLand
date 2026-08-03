"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, SealCheck, Trash } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/CartProvider";
import { currency } from "@/lib/catalogue";

/*
  The cart, which on a lodge site is a booking enquiry rather than a checkout.
  Lines carry nights for rooms and days for halls, the summary totals what the
  stay would come to at the published rates, and the only action out of here is
  to send the whole thing to the front desk. No card fields, no deposit, no
  cancellation terms — none of that is settled, and inventing it would be
  inventing policy.
*/
export default function CartView() {
  const { lines, subtotal, count, hydrated, setQty, remove, clear } = useCart();

  if (!hydrated) {
    return (
      <div className="rounded-surface border border-basalt/12 p-10">
        <p className="text-sage">Loading your booking…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-surface border border-basalt/12 bg-paper-raised p-10 text-center sm:p-16">
        <h2 className="font-display text-3xl">Nothing here yet</h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-sage">
          Pick a room by the night or a hall by the day, and it lands here ready
          to send to the lodge.
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
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
      <div>
        <ul className="divide-y divide-basalt/10 border-y border-basalt/10">
          {lines.map((line) => (
            <li key={line.key} className="flex gap-5 py-6">
              <Link
                href={`/book/${line.slug}`}
                className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-field bg-paper-deep sm:w-28"
              >
                <Image
                  src={`/img/${line.image}.webp`}
                  alt={line.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/book/${line.slug}`}
                      className="font-display text-xl leading-snug hover:underline"
                    >
                      {line.name}
                    </Link>
                    {line.option && <p className="mt-1 text-sm text-sage">{line.option}</p>}
                    <p className="mt-1 text-sm text-sage">
                      {currency(line.price)} per {line.unit}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.key)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-basalt/15 text-sage transition-colors hover:border-danger hover:text-danger"
                  >
                    <span className="sr-only">Remove {line.name}</span>
                    <Trash size={15} weight="light" />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                  <div className="inline-flex items-center gap-1 rounded-full border border-basalt/20 p-1">
                    <button
                      type="button"
                      onClick={() => setQty(line.key, line.qty - 1)}
                      className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-basalt hover:text-paper"
                    >
                      <span className="sr-only">One fewer {line.unitPlural}</span>
                      <Minus size={13} weight="light" />
                    </button>
                    <span className="min-w-[52px] text-center font-mono text-[13px]">
                      {line.qty} {line.qty === 1 ? line.unit : line.unitPlural}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(line.key, line.qty + 1)}
                      className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-basalt hover:text-paper"
                    >
                      <span className="sr-only">One more {line.unitPlural}</span>
                      <Plus size={13} weight="light" />
                    </button>
                  </div>

                  <p className="font-display text-xl leading-none">
                    {currency(line.price * line.qty)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Link href="/book" className="link-draw text-sm text-sage hover:text-basalt">
            Keep browsing rooms and halls
          </Link>
          <button
            type="button"
            onClick={clear}
            className="text-sm text-sage underline-offset-2 hover:text-basalt hover:underline"
          >
            Empty the cart
          </button>
        </div>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-surface border border-basalt/12 bg-paper-raised p-7">
          <h2 className="font-display text-2xl">Your enquiry</h2>

          <dl className="mt-7 space-y-3.5 border-b border-basalt/10 pb-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-sage">Lines</dt>
              <dd>{lines.length}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sage">Nights and days</dt>
              <dd>{count}</dd>
            </div>
          </dl>

          <div className="flex items-baseline justify-between gap-4 py-6">
            <span className="text-sage">At published rates</span>
            <span className="font-display text-3xl leading-none">{currency(subtotal)}</span>
          </div>

          <Link
            href="/checkout"
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-basalt px-6 py-4 font-medium text-paper transition-colors hover:bg-basalt-raised active:scale-[0.99]"
          >
            Continue to checkout
            <ArrowRight size={15} weight="bold" />
          </Link>

          <Link
            href="/contact"
            className="mt-3 flex w-full items-center justify-center rounded-full border border-basalt/20 px-6 py-3.5 text-sm font-medium transition-colors hover:border-basalt"
          >
            Or send it as an enquiry
          </Link>

          <p className="mt-5 flex items-start gap-2.5 text-sm leading-relaxed text-sage">
            <SealCheck size={16} weight="light" className="mt-0.5 shrink-0" />
            The checkout is a demonstration: no payment is taken and nothing is
            sent anywhere. To book for real, send the enquiry — the lodge
            confirms availability and the rate directly.
          </p>
        </div>

        <p className="mt-5 px-1 text-xs leading-relaxed text-sage-soft">
          Rates shown are the illustrative figures held in the site&rsquo;s
          content file, not the property&rsquo;s published rate card.
        </p>
      </aside>
    </div>
  );
}
