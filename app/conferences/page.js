import PageHero from "@/components/PageHero";
import PageMagazine from "@/components/PageMagazine";
import { conferenceIncludes, pageMagazine, conferencesHeroSlides } from "@/lib/content";

export const metadata = {
  title: "Conferences & Events",
  description:
    "Four air conditioned meeting halls in Arusha seating ten to 150, with projector, public address, wifi and a backup generator.",
};

export default function ConferencesPage() {
  return (
    <>
      <PageHero
        slides={conferencesHeroSlides}
        ariaLabel="Conference halls at Masailand Safari and Lodge"
        meta={{ value: "Four Halls", label: "Ten to 150 seats" }}
        included={{ label: "What's included", items: conferenceIncludes }}
      />

      <PageMagazine
        trending={pageMagazine.conferences.trending}
        editorial={pageMagazine.conferences.editorial}
        spotlight={pageMagazine.conferences.spotlight}
      />
    </>
  );
}
