import Image from "next/image";
import Link from "next/link";
import {
  Airplane,
  ArrowUpRight,
  Car,
  Compass,
  Mountains,
} from "@phosphor-icons/react/dist/ssr";
import Reveal from "@/components/Reveal";
import VideoCell from "@/components/VideoCell";
import CountUp from "@/components/CountUp";
import { about, positionChips, property } from "@/lib/content";

const chipIcons = { airplane: Airplane, car: Car, mountains: Mountains };

/*
  Four cells of unequal weight, then the property's figures underneath: what
  the lodge is, what it looks like in motion, where it sits, and a taste of
  the gallery. Text takes the tall left column; film runs wide across the
  top right, with the map and the photo fan sitting side by side underneath
  it, so the "45 min from KIA" chips in the text cell have an actual map
  to point at rather than just a claim.
*/
export default function AboutBento() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10 lg:py-32">
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-16">
          <p className="inline-flex h-fit w-fit rounded-full border border-basalt/15 px-4 py-1.5 text-sm text-sage">
            {about.label}
          </p>
          <h2 className="max-w-3xl font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.18]">
            {about.statement}
          </h2>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
        {/* What the lodge is, and the reasons to use it as a base. */}
        <Reveal className="h-full lg:row-span-2">
          <div className="flex h-full flex-col rounded-surface bg-paper-raised p-7 lg:p-8">
            <Compass size={26} weight="light" className="text-basalt" />
            <p className="mt-8 leading-relaxed text-sage">{about.body}</p>

            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              {positionChips.map((chip) => {
                const Icon = chipIcons[chip.icon];
                return (
                  <li key={chip.label} className="flex items-center gap-2 text-[13px] text-basalt">
                    <Icon size={15} weight="light" className="shrink-0 text-sage" />
                    {chip.label}
                  </li>
                );
              })}
            </ul>

            {/* The property's figures, filling the rest of this cell's
                height rather than sitting in their own thin strip below. */}
            <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-basalt/10 pt-9">
              {property.map((p) => (
                <div key={p.label}>
                  <dd className="font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-none">
                    <CountUp value={p.value} suffix={p.suffix} />
                  </dd>
                  <dt className="mt-2 text-sm text-sage">{p.label}</dt>
                </div>
              ))}
            </dl>

            <div className="mt-auto flex items-center gap-2 pt-9">
              <Link
                href="/contact"
                className="rounded-full bg-basalt px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-basalt-raised active:scale-[0.98]"
              >
                Contact us
              </Link>
              <Link
                href="/gallery"
                aria-label="See the gallery"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-basalt text-paper transition-colors hover:bg-basalt-raised active:scale-[0.98]"
              >
                <ArrowUpRight size={16} weight="bold" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* The lodge's own film, behind a poster frame. */}
        <Reveal delay={0.08} className="h-full lg:col-span-2">
          <VideoCell
            src="/video/masailand.mp4"
            poster={about.feature.image}
            alt={about.feature.alt}
            title={about.feature.title}
          />
        </Reveal>

        {/* Where the lodge actually sits, for the "45 min from KIA" chips in
            the text cell to point at. A plain embed, no API key needed, and
            no grayscale here since a map has to stay legible to be useful. */}
        <Reveal delay={0.12} className="h-full">
          <div className="relative h-full min-h-[220px] overflow-hidden rounded-surface bg-paper-raised">
            <iframe
              title="Masailand Safari and Lodge on the map"
              src="https://www.google.com/maps?q=Masailand+Safari+and+Lodge,+Arumeru,+Arusha,+Tanzania&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
            <a
              href="https://www.google.com/maps/search/?api=1&query=Masailand+Safari+and+Lodge+Arusha"
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-paper px-4 py-2 text-sm font-medium text-basalt shadow-[0_6px_18px_-6px_rgba(23,26,25,0.35)] transition-colors hover:bg-white"
            >
              Open in Maps
              <ArrowUpRight size={13} weight="bold" />
            </a>
          </div>
        </Reveal>

        {/* A fan of frames standing in for the gallery. Hovering the cell
            spreads them apart, which is the affordance for "there are more
            of these through here". */}
        <Reveal delay={0.16} className="h-full">
          <Link
            href="/gallery"
            className="group flex h-full flex-col justify-between rounded-surface bg-paper-raised p-7 lg:p-8"
          >
            <div className="flex justify-center pt-4">
              <div className="flex">
                {about.fan.map((img, i) => (
                  <span
                    key={img}
                    className={`relative block h-[168px] w-[124px] shrink-0 overflow-hidden rounded-[14px] shadow-[0_14px_34px_-14px_rgba(23,26,25,0.55)] transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      i === 0
                        ? "-rotate-[10deg] group-hover:-translate-x-6 group-hover:-rotate-[19deg]"
                        : i === 1
                          ? "z-10 -ml-7 -translate-y-3 group-hover:-translate-y-6 group-hover:scale-[1.05]"
                          : "-ml-7 rotate-[10deg] group-hover:translate-x-6 group-hover:rotate-[19deg]"
                    }`}
                  >
                    <Image
                      src={`/img/${img}.webp`}
                      alt=""
                      aria-hidden
                      fill
                      sizes="124px"
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-8 leading-relaxed text-sage">{about.fanCaption}</p>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
