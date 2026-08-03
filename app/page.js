import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, X } from "@phosphor-icons/react/dist/ssr";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import AboutBento from "@/components/AboutBento";
import InviteStrip from "@/components/InviteStrip";
import TrustMarquee from "@/components/TrustMarquee";
import BookingCarousel from "@/components/BookingCarousel";
import DiningSlider from "@/components/DiningSlider";
import Testimonials from "@/components/Testimonials";
import { wellness, bookDirect, bookAgent } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Hero />

      <TrustMarquee />

      <AboutBento />

      <BookingCarousel />

      {/* Wellness: same card-overlay language as the rooms above, kept
          asymmetric so the pools cell reads as the lead item. */}
      <section className=" bg-paper-raised mt-10 py-14">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <Reveal>
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="mb-4 inline-flex rounded-full border border-basalt/15 bg-paper px-4 py-1.5 text-sm text-sage">
                  Wellness
                </p>
                <h2 className="max-w-xl font-display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.06]">
                  Two pools, a spa, and a gym that faces the garden
                </h2>
              </div>

              <Link href="/wellness" className="group flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-basalt px-6 py-3 text-sm font-medium text-paper transition-colors group-hover:bg-basalt-raised">
                  See wellness centre
                </span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-basalt text-paper transition-colors group-hover:bg-basalt-raised">
                  <ArrowUpRight size={16} weight="bold" />
                </span>
              </Link>
            </div>
          </Reveal>

          {/* Three items, three cells. The pools take a tall cell on the left
              and the image stretches to fill it, so no cell is left ragged. */}
          <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
            {wellness.map((w, i) => {
              const feature = i === 0;
              return (
                <Reveal
                  key={w.name}
                  delay={i * 0.09}
                  className={`h-full ${feature ? "lg:col-span-2 lg:row-span-2" : ""}`}
                >
                  <Link
                    href="/wellness"
                    className={`group relative block h-full overflow-hidden rounded-surface ${
                      feature ? "aspect-[16/10] lg:aspect-auto lg:min-h-[420px]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={`/img/${w.image}.webp`}
                      alt={w.name}
                      fill
                      sizes={
                        feature
                          ? "(max-width: 1024px) 100vw, 62vw"
                          : "(max-width: 1024px) 100vw, 31vw"
                      }
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-basalt via-basalt/60 to-transparent" />
                    <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-paper text-basalt transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
                      <ArrowUpRight size={15} weight="bold" />
                    </span>
                    <span className="absolute inset-x-5 bottom-5 lg:inset-x-7 lg:bottom-7">
                      <span
                        className={`block font-display leading-tight text-paper ${
                          feature ? "text-2xl lg:text-3xl" : "text-xl"
                        }`}
                      >
                        {w.name}
                      </span>
                      <span className="mt-1 block text-sm text-paper/75">{w.hours}</span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* <DiningSlider /> */}
      <InviteStrip />

      {/* The one dark block on the page, reserved for the signature moment. */}
      {/* <section className="bg-basalt py-24 text-paper lg:py-36">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <CircuitDial />
        </div>
      </section> */}

      

      <Testimonials />
      

      {/*
        Get in touch direct, redesigned as an actual comparison rather than a
        checklist over a photo. The photo comes back as a fixed (parallax)
        backdrop rather than a static cover image, so the section still
        reads as a photographic moment, but the comparison cards sit on
        their own solid surfaces on top rather than fighting the photo for
        contrast.
      */}
      <section className="relative isolate overflow-hidden py-24 lg:py-36">
        <div
          className="absolute inset-0 -z-10 bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url(/img/layout-1.webp)" }}
        />
        <div className="absolute inset-0 -z-10 bg-basalt/80" />

        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <p className="mb-4 inline-flex rounded-full border border-paper/20 px-4 py-1.5 text-sm text-sage-soft">
                Get in touch
              </p>
              <h2 className="font-display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.06] text-paper">
                Talk to the lodge, not a middleman
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal delay={0.05}>
              <div className="h-full rounded-surface border border-paper/25 bg-basalt p-8 shadow-[0_28px_60px_-32px_rgba(0,0,0,0.5)] sm:p-10">
                <h3 className="font-display text-2xl text-paper">Contacting us directly</h3>
                <ul className="mt-7 space-y-4">
                  {bookDirect.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-paper/85">
                      <Check size={18} weight="bold" className="mt-1 shrink-0 text-paper" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-9 inline-flex items-center gap-2 rounded-full border border-paper px-7 py-3.5 font-medium text-paper transition-colors hover:bg-paper hover:text-basalt active:scale-[0.98]"
                >
                  Get in touch
                  <ArrowUpRight size={16} weight="bold" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full rounded-surface border border-paper/10 bg-paper-raised p-8 sm:p-10">
                <h3 className="font-display text-2xl text-basalt">Through an agent</h3>
                <ul className="mt-7 space-y-4">
                  {bookAgent.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sage">
                      <X size={18} weight="bold" className="mt-1 shrink-0 text-sage-soft" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
