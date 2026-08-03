"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { InstagramLogo, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { site, nav } from "@/lib/content";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-basalt text-paper">
      <div className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-10">
          <div>
            <Image
              src="/brand/logo-masailand-light.png"
              alt="Masailand Safari & Lodge"
              width={300}
              height={189}
              className="h-14 w-auto"
            />
            <p className="mt-7 max-w-xs font-display text-2xl leading-snug text-paper/90">
              {site.tagline}.
            </p>
          </div>

          <div>
            <h2 className="label text-sage-soft">Visit</h2>
            <address className="mt-6 space-y-3 not-italic text-paper/75">
              <p>{site.address}</p>
              <p>
                <a href={`tel:${site.telHref}`} className="link-draw hover:text-paper">
                  {site.tel}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="link-draw hover:text-paper">
                  {site.email}
                </a>
              </p>
              <p className="text-paper/50">Fax {site.fax}</p>
            </address>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-basalt-line px-4 py-2 text-sm text-paper/80 transition-colors hover:border-paper hover:text-paper"
            >
              <InstagramLogo size={17} weight="light" />
              Instagram
              <ArrowUpRight size={13} weight="bold" />
            </a>
          </div>

          <div>
            <h2 className="label text-sage-soft">Explore</h2>
            <ul className="mt-6 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw text-paper/75 hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/terms-conditions" className="link-draw text-paper/75 hover:text-paper">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-basalt-line pt-10 text-sm text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>A brand by {site.parent}</p>
        </div>
      </div>
    </footer>
  );
}
