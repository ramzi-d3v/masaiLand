import Checkout from "@/components/cart/Checkout";

export const metadata = {
  title: "Checkout (demo)",
  description:
    "A demonstration checkout for Masailand Safari & Lodge. No payment is taken and nothing entered here is sent anywhere.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    // The heading lives inside <Checkout> rather than here: once the coupon is
    // on screen it moves into the column beside it, which this server
    // component has no way of knowing about.
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-[112px] lg:px-10 lg:pb-32 lg:pt-[132px]">
      <Checkout />
    </section>
  );
}
