import PageHero from "@/components/PageHero";
import PageMagazine from "@/components/PageMagazine";
import { pageMagazine, wellnessHeroSlides } from "@/lib/content";

export const metadata = {
  title: "Wellness",
  description:
    "Two swimming pools, a spa with steam bath and sauna, and a fully equipped gym at Masailand Safari & Lodge in Arusha.",
};

export default function WellnessPage() {
  return (
    <>
      <PageHero
        slides={wellnessHeroSlides}
        ariaLabel="Wellness at Masailand Safari and Lodge"
        meta={{ value: "Two Pools", label: "Spa & gym" }}
        included={{
          label: "What's included",
          items: [
            { icon: "pool", label: "Lodge pool, free to residents" },
            { icon: "sun", label: "Loungers and towels" },
            { icon: "bathtub", label: "Steam bath and sauna" },
            { icon: "flower", label: "Deep tissue and facial massage" },
            { icon: "flower", label: "Body scrubs" },
            { icon: "barbell", label: "Free weights and machines" },
            { icon: "barbell", label: "Treadmills and cycles" },
            { icon: "tree", label: "Garden pool, open to visitors" },
          ],
        }}
      />

      <PageMagazine
        trending={pageMagazine.wellness.trending}
        editorial={pageMagazine.wellness.editorial}
        spotlight={pageMagazine.wellness.spotlight}
      />
    </>
  );
}
