import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import PageMagazine from "@/components/PageMagazine";
import { dining, pageMagazine, dineHeroSlides } from "@/lib/content";

export const metadata = {
  title: "Wine & Dine",
  description:
    "The Conservatory restaurant at Masailand Safari & Lodge. Indoor and poolside dining in Arusha, from Tanzanian cooking to international plates.",
};

export default function WineDinePage() {
  return (
    <>
      <PageHero
        slides={dineHeroSlides}
        ariaLabel="Wine and dine at Masailand Safari and Lodge"
        meta={{ value: "Two Settings", label: "Indoors & poolside" }}
        included={{
          label: "On the table",
          items: [
            { icon: "fork", label: "Tanzanian cooking" },
            { icon: "fork", label: "International plates" },
            { icon: "sun", label: "Indoors under the glass" },
            { icon: "pool", label: "Tables by the pool" },
            { icon: "martini", label: "Thatched outdoor bar" },
            { icon: "wine", label: "Wine and spirits list" },
            { icon: "leaf", label: "Greens from the lodge farm" },
            { icon: "clock", label: "Open through the day" },
          ],
        }}
      />

      <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.06]">
              The Conservatory
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-sage">{dining.body}</p>
            <p className="mt-5 leading-relaxed text-sage">
              Sit inside under the glass, or take a table by the pool. Both are
              open to house guests through the day.
            </p>
          </Reveal>
        </div>
      </section>

      {/* A gallery band rather than another split. Six frames, mixed sizes. */}
      <section className="mx-auto max-w-[1600px] px-5 pb-24 lg:px-10 lg:pb-32">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {dining.images.map((img, i) => (
            <Reveal
              key={img}
              delay={(i % 4) * 0.06}
              className={i === 0 || i === 5 ? "col-span-2" : ""}
            >
              <div
                className={`relative overflow-hidden rounded-surface bg-paper-deep ${
                  i === 0 || i === 5 ? "aspect-[16/10]" : "aspect-[3/4]"
                }`}
              >
                <Image
                  src={`/img/${img}.webp`}
                  alt="The restaurant, bar and kitchen garden at Masailand"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-basalt py-24 text-paper lg:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <Reveal>
            <h2 className="max-w-md font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.06] text-paper">
              Most of the greens come from the farm below
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-paper/70">
              The lodge keeps its own vegetable garden on the slope, so the
              kitchen builds each day's menu around whatever was cut that
              morning. Ask the kitchen for the day's plate.
            </p>
            <Link
              href="/contact"
              className="mt-9 inline-flex items-center gap-2 rounded-full border border-paper px-7 py-3.5 font-medium text-paper transition-colors hover:bg-paper hover:text-basalt active:scale-[0.98]"
            >
              Reserve a table
              <ArrowUpRight size={16} weight="bold" />
            </Link>
          </Reveal>
        </div>
      </section>

      <PageMagazine
        trending={pageMagazine.dine.trending}
        editorial={pageMagazine.dine.editorial}
        spotlight={pageMagazine.dine.spotlight}
      />
    </>
  );
}
