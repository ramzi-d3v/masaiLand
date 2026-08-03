import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Reveal from "@/components/Reveal";
import { strip } from "@/lib/content";

/* A small photograph set inline in the headline, at cap height. */
function Inline({ src, alt }) {
  return (
    <span className="relative mx-1 inline-block h-[0.72em] w-[1.5em] translate-y-[0.04em] overflow-hidden rounded-full align-baseline sm:h-[0.78em] sm:w-[1.7em]">
      <Image src={`/img/${src}.webp`} alt={alt} fill sizes="80px" className="object-cover" />
    </span>
  );
}

export default function InviteStrip() {
  // Doubled, so the loop has an identical second half to cut back to.
  const track = [...strip, ...strip];

  return (
    <section className="pt-16 lg:pt-20">
      <Reveal>
        <div className="mx-auto max-w-[900px] px-5 text-center lg:px-10">
          <h2 className="font-display text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.18]">
            Where elegance
            <Inline src="masailand-cottages" alt="One of the nine cottages" />
            meets nature, on a hill above <em>Arusha</em>
            <Inline src="garden-pool-1" alt="The garden pool" />
          </h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-sage">
            The gardens, the cottages and the rooms, shot around the property.
          </p>
          <Link
            href="/gallery"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-basalt px-8 py-3.5 font-medium text-paper transition-colors hover:bg-basalt-raised active:scale-[0.98]"
          >
            See the gallery
            <ArrowUpRight size={16} weight="bold" />
          </Link>
        </div>
      </Reveal>

      {/*
        The strip slides on a loop rather than sitting still, so the eye reads
        it as "there is more of this through here". Both edges take an
        elliptical radius, so the band arcs up along the top and down along
        the bottom and bulges through the middle. The sides stay plain, and
        the fades below cover where the arcs pinch in at the corners.
      */}
      <div className="strip relative mt-10 overflow-hidden [border-radius:50%/10%]">
        {/* Frames sit flush, no gap between them. With zero spacing the loop
            period is exactly the frame width, so -50% always lands on a
            period boundary and the seam is invisible regardless of size. */}
        <div className="strip-track flex w-max">
          {track.map((item, i) => (
            <div
              key={`${item.src}-${i}`}
              className="relative h-[220px] w-[180px] shrink-0 overflow-hidden sm:h-[300px] sm:w-[240px] lg:h-[360px] lg:w-[280px]"
            >
              <Image
                src={`/img/${item.src}.webp`}
                alt={i < strip.length ? item.alt : ""}
                aria-hidden={i >= strip.length ? true : undefined}
                fill
                sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 280px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Plain fade at both ends, no blur: paper solid at the edge, easing
            to transparent so the sliding frames dissolve rather than cut off. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[18%] bg-gradient-to-l from-paper to-transparent" />
      </div>
    </section>
  );
}
