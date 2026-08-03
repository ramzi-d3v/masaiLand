import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import PageMagazine from "@/components/PageMagazine";
import { gallery, pageMagazine } from "@/lib/content";

export const metadata = {
  title: "Gallery",
  description:
    "Photographs of Masailand Safari & Lodge in Arusha, Tanzania: the gardens, the cottages, the rooms, the pools and the restaurant.",
};

/* A masonry-ish grid: most frames are square, a few take a wide or tall cell
   so the column edges never line up into a plain table. */
function spanClass(span) {
  if (span === "wide") return "sm:col-span-2 aspect-[16/10]";
  if (span === "tall") return "sm:row-span-2 aspect-[3/4] sm:aspect-auto sm:h-full";
  return "aspect-square";
}

export default function GalleryPage() {
  return (
    <>
      <PageHero
        ariaLabel="The lodge in photographs"
        slides={[
          {
            img: "layout-1",
            alt: "The lodge and its cottages seen from the air, set among trees on the hill",
            titleA: "The lodge,",
            titleB: { em: "in photographs." },
            sub: "The gardens, the cottages, the rooms and the pools, shot around the property.",
            note: "Aerial views of the hill, the lawns and flowering trees, the rooms and the restaurant.",
          },
        ]}
        meta={{ value: `${gallery.length} Frames`, label: "Across the property" }}
        icons={["camera", "tree", "bed", "pool"]}
        included={{
          label: "In these frames",
          items: [
            { icon: "mountains", label: "The lodge from the air" },
            { icon: "tree", label: "Gardens and grounds" },
            { icon: "bed", label: "Rooms and cottages" },
            { icon: "pool", label: "Pools and terraces" },
            { icon: "fork", label: "The restaurant" },
            { icon: "martini", label: "The outdoor bar" },
            { icon: "leaf", label: "The farm below" },
          ],
        }}
      />

      <section className="mx-auto max-w-[1600px] px-5 py-24 lg:px-10 lg:py-32">
        <div className="grid auto-rows-auto grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {gallery.map((item, i) => (
            <Reveal
              key={item.src}
              delay={(i % 4) * 0.05}
              amount={0.1}
              className={item.span === "wide" ? "sm:col-span-2" : item.span === "tall" ? "sm:row-span-2" : ""}
            >
              <figure
                className={`relative h-full overflow-hidden rounded-surface bg-paper-deep ${spanClass(
                  item.span
                )}`}
              >
                <Image
                  src={`/img/${item.src}.webp`}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <PageMagazine {...pageMagazine.gallery} />
    </>
  );
}
