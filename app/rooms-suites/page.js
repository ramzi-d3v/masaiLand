import Reveal from "@/components/Reveal";
import PageMagazine from "@/components/PageMagazine";
import PageHero from "@/components/PageHero";
import { roomAmenities, pageMagazine, roomsHeroSlides } from "@/lib/content";

export const metadata = {
  title: "Rooms & Suites",
  description:
    "Deluxe rooms, executive suites and interconnecting family rooms at Masailand Safari & Lodge in Arusha. Every room has a balcony.",
};

export default function RoomsPage() {
  return (
    <>
      <PageHero
        slides={roomsHeroSlides}
        ariaLabel="Rooms and suites at Masailand Safari and Lodge"
        meta={{ value: "54 Rooms", label: "& nine cottages" }}
        included={{
          label: "In every room",
          // The same twenty amenities the page lists further down, running
          // past in the hero rather than repeated as a second list.
          items: roomAmenities.flatMap((group) => group.items),
        }}
      />

      <PageMagazine {...pageMagazine.rooms} />

      {/* Twenty amenities is too many for a list, so they group into four. */}
      <section className="bg-basalt py-24 text-paper lg:py-32">
        <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
          <Reveal>
            <h2 className="max-w-2xl font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.06] text-paper">
              In every room, whichever you choose
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {roomAmenities.map((group, i) => (
              <Reveal key={group.group} delay={i * 0.07}>
                <h3 className="label text-paper">{group.group}</h3>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="leading-relaxed text-paper/70">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
