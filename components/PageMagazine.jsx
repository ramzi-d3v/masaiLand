import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, PlayCircle } from "@phosphor-icons/react/dist/ssr";
import Reveal from "@/components/Reveal";
import SpotlightCarousel from "@/components/SpotlightCarousel";

/*
  The magazine block from the reference: a dark photo grid, a trending row
  (two cards + a text list + a wide feature banner), an editorial split, and
  a spotlight carousel. The shapes are kept close to the reference; the
  content underneath is real lodge photography and copy, not articles, so
  "Watch Now" only carries a play badge on `explore.items` entries that pass
  `video: true` — none currently do except where a real clip exists.
*/

function Thumb({ src, alt, video, className = "" }) {
  return (
    <div className={`relative aspect-[4/3] overflow-hidden rounded-field bg-basalt-raised ${className}`}>
      <Image
        src={`/img/${src}.webp`}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05]"
      />
      {video && (
        <span className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full border border-paper/70 bg-basalt/30 text-paper backdrop-blur-sm">
          <PlayCircle size={16} weight="regular" />
        </span>
      )}
    </div>
  );
}

export function ExploreGrid({ title = "Explore the property", items }) {
  return (
    <section className="bg-basalt py-20 text-paper lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.06] text-paper">
              {title}
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.src + i} delay={(i % 4) * 0.06}>
              <Thumb src={it.src} alt={it.alt} video={it.video} />
              <p className="mt-2.5 line-clamp-2 text-sm leading-snug text-paper/75">{it.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrendingRow({ title = "More to see", cards, list, feature }) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <Reveal>
          <h2 className="mb-10 font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.06]">
            {title}
          </h2>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr]">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08} className="lg:col-span-1">
              <Link href={c.href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-surface bg-paper-deep">
                  <Image
                    src={`/img/${c.src}.webp`}
                    alt={c.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="mt-4 font-display text-xl leading-snug">
                  {c.title}
                </h3>
                {c.meta && <p className="mt-1.5 text-sm text-sage">{c.meta}</p>}
              </Link>
            </Reveal>
          ))}

          <Reveal delay={0.16} className="flex flex-col gap-6 lg:col-span-1">
            {list.map((l) => (
              <Link href={l.href} key={l.title} className="group flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-field bg-paper-deep">
                  <Image src={`/img/${l.src}.webp`} alt={l.alt} fill sizes="64px" className="object-cover" />
                </div>
                <div>
                  <h4 className="font-medium leading-snug">{l.title}</h4>
                  {l.meta && <p className="mt-1 text-sm text-sage">{l.meta}</p>}
                </div>
              </Link>
            ))}
          </Reveal>
        </div>

        {feature && (
          <Reveal delay={0.1}>
            <Link
              href={feature.href}
              className="group mt-8 grid overflow-hidden rounded-surface bg-paper-raised lg:grid-cols-2"
            >
              <div className="flex flex-col justify-center gap-4 p-8 sm:p-12">
                {feature.tag && (
                  <span className="inline-flex w-fit rounded-full border border-basalt px-3 py-1 text-xs font-medium uppercase tracking-wide text-basalt">
                    {feature.tag}
                  </span>
                )}
                <h3 className="font-display text-2xl leading-tight sm:text-3xl">{feature.title}</h3>
                <p className="text-sage leading-relaxed">{feature.excerpt}</p>
                <span className="mt-2 inline-flex w-fit items-center gap-2 font-medium text-basalt">
                  Read more
                  <ArrowUpRight size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
              <div className="relative aspect-[16/10] lg:aspect-auto">
                <Image
                  src={`/img/${feature.src}.webp`}
                  alt={feature.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              </div>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function EditorialSplit({ title = "Worth a closer look", tag, heading, excerpt, src, alt, href, list }) {
  return (
    <section className="bg-paper-raised py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <Reveal>
          <h2 className="mb-10 font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.06]">
            {title}
          </h2>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          <Reveal>
            <Link href={href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-surface bg-paper-deep sm:aspect-[16/9]">
                <Image
                  src={`/img/${src}.webp`}
                  alt={alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                {tag && (
                  <span className="absolute left-4 top-4 rounded-full border border-paper/70 bg-basalt/30 px-3 py-1 text-xs font-medium uppercase tracking-wide text-paper backdrop-blur-sm">
                    {tag}
                  </span>
                )}
              </div>
              <h3 className="mt-5 font-display text-2xl leading-tight sm:text-3xl">
                {heading}
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-sage">{excerpt}</p>
            </Link>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            {list.map((l) => (
              <Link href={l.href} key={l.title} className="group flex items-start gap-4">
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-field bg-paper-deep">
                  <Image src={`/img/${l.src}.webp`} alt={l.alt} fill sizes="80px" className="object-cover" />
                </div>
                <div>
                  <h4 className="font-medium leading-snug">{l.title}</h4>
                  {l.meta && <p className="mt-1 text-sm text-sage">{l.meta}</p>}
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default function PageMagazine({ explore, trending, editorial, spotlight }) {
  return (
    <>
      {explore && <ExploreGrid {...explore} />}
      {trending && <TrendingRow {...trending} />}
      {editorial && <EditorialSplit {...editorial} />}
      {/* The spotlight moved out to its own client component when it
          became a real carousel with arrows and a progress line. */}
      {spotlight && <SpotlightCarousel {...spotlight} />}
    </>
  );
}
