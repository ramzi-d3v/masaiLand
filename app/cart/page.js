import CartView from "@/components/cart/CartView";

export const metadata = {
  title: "Your Booking",
  description:
    "The rooms and halls you have picked at Masailand Safari & Lodge, ready to send to the front desk as a booking enquiry.",
};

export default function CartPage() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-[112px] lg:px-10 lg:pb-32 lg:pt-[132px]">
      <h1 className="font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.04]">
        Your booking
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-sage">
        Rooms are counted in nights and halls in days. Send the lot to the lodge
        and someone comes back to you the same day.
      </p>

      <div className="mt-12">
        <CartView />
      </div>
    </section>
  );
}
