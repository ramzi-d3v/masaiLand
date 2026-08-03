import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Preloader from "@/components/Preloader";
import { CartProvider } from "@/components/cart/CartProvider";
import { FavouritesProvider } from "@/components/cart/FavouritesProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Newsreader carries the display voice. The existing wordmark is a serif, so
// the headline face stays a serif for brand fidelity, but an editorial one
// rather than a fashion didone.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

// Dx Nacky carries every title, hero included, with its own medium italic for
// the accent words so emphasis never leaves the family. Dx Alegant stays on as
// the secondary display cut. Both are licensed for personal use, so they need
// a commercial licence from Dirtyline Studio before this site goes live.
const nacky = localFont({
  src: [
    { path: "../public/fonts/dx-nacky-light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/dx-nacky-medium-italic.otf", weight: "500", style: "italic" },
  ],
  variable: "--font-title",
  display: "swap",
});

const alegant = localFont({
  src: "../public/fonts/dx-alegant-extralight.otf",
  variable: "--font-heading",
  display: "swap",
  weight: "200",
});

export const metadata = {
  metadataBase: new URL("https://masailandsafari.com"),
  title: {
    default: "Masailand Safari & Lodge - Where Elegance Meets Nature",
    template: "%s | Masailand Safari & Lodge",
  },
  description:
    "A hilltop lodge in Arusha, Tanzania, with views over Mount Meru and the Kisongo valleys. 54 rooms, nine cottages, and the gateway to the northern safari circuit.",
  openGraph: {
    title: "Masailand Safari & Lodge - Where Elegance Meets Nature",
    description:
      "A hilltop lodge in Arusha, Tanzania, 45 minutes from Kilimanjaro International Airport.",
    url: "https://masailandsafari.com",
    siteName: "Masailand Safari & Lodge",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${alegant.variable} ${nacky.variable} antialiased`}
    >
      <body className="min-h-dvh bg-paper text-basalt">
        <Preloader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-basalt focus:px-5 focus:py-3 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <CartProvider>
          <FavouritesProvider>
            <SiteHeader />
            <main id="main">{children}</main>
            <SiteFooter />
          </FavouritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
