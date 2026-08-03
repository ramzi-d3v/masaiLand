import CatalogueBrowser from "@/components/book/CatalogueBrowser";
import { catalogue } from "@/lib/catalogue";

export const metadata = {
  title: "Book a Room or Hall",
  description:
    "Browse every room, suite and conference hall at Masailand Safari & Lodge in Arusha, filter by capacity and rate, and build a booking enquiry.",
};

export default function BookPage() {
  return (
    <>
      {/* No hero here on purpose: this is the shop, and the filters should be
          the first thing on screen rather than a full frame of photography. */}
      <div className="mx-auto mb-10 max-w-[1400px] px-5 pt-[112px] lg:px-10 lg:pt-[132px]">
        <h1 className="max-w-2xl font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.04]">
          Find the room, or the hall, that fits
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-sage">
          {catalogue.length} spaces across the property. Rooms are priced by the
          night and halls by the day, and every rate here is illustrative until
          the property supplies its rate card.
        </p>
      </div>

      <CatalogueBrowser items={catalogue} />
    </>
  );
}
