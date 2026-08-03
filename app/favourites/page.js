import FavouritesView from "@/components/cart/FavouritesView";

export const metadata = {
  title: "Favourites",
  description:
    "The rooms, suites and conference halls you have saved at Masailand Safari & Lodge in Arusha.",
};

export default function FavouritesPage() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-[112px] lg:px-10 lg:pb-32 lg:pt-[132px]">
      <h1 className="font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.04]">Favourites</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-sage">
        Saved on this device. Nothing here is held or reserved — add a room to
        your booking when you are ready.
      </p>

      <div className="mt-12">
        <FavouritesView />
      </div>
    </section>
  );
}
