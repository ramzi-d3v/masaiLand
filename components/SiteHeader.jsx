"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Bag, CaretDown, Heart, List, X } from "@phosphor-icons/react";
import { navMenu, navPlain } from "@/lib/content";
import { useCart } from "@/components/cart/CartProvider";
import { useFavourites } from "@/components/cart/FavouritesProvider";

/*
  Header built on the shadcn "header three" pattern: transparent over the hero,
  settling onto paper once scrolled, with panel menus for the three
  destinations that have real sub-pages. Ported to Radix Navigation Menu,
  which is what shadcn's navigation-menu wraps.
*/

/*
  One row inside a panel. Same shape as the block's link item: a small square
  tile on the left, then the name and a two-line description. The tile carries
  a photograph rather than an icon, since every entry here is a real place.
*/
function PanelItem({ item, onNavigate, className = "", ...props }) {
  return (
    <Link
      {...props}
      href={item.href}
      onClick={onNavigate}
      className={`group flex items-start gap-x-3 rounded-[10px] p-2 transition-colors hover:bg-paper-raised ${className}`}
    >
      <span className="relative aspect-square w-10 shrink-0 overflow-hidden rounded-[7px] border border-basalt/12 bg-paper-deep shadow-sm">
        <Image
          src={`/img/${item.img}.webp`}
          alt=""
          aria-hidden
          fill
          sizes="40px"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        />
      </span>
      <span className="flex min-w-0 flex-col items-start justify-center">
        <span className="text-[14.5px] font-medium leading-snug text-basalt">{item.label}</span>
        <span className="line-clamp-2 text-xs leading-snug text-sage">{item.description}</span>
      </span>
    </Link>
  );
}

function DesktopNav({ pathname, overlay }) {
  const linkTone = overlay ? "text-paper/75" : "text-basalt/70";
  // Monochrome only: the current page is marked by going to full-strength
  // paper or basalt while the rest sit at reduced opacity above.
  const activeTone = overlay ? "text-paper" : "text-basalt";
  const hoverTone = overlay ? "hover:text-paper" : "hover:text-basalt";

  return (
    <NavigationMenu.Root className="relative hidden lg:block" delayDuration={120}>
      <NavigationMenu.List className="flex items-center gap-1">
        {navMenu.map((group) => {
          const active = pathname.startsWith(group.href);
          return (
            <NavigationMenu.Item key={group.href}>
              <NavigationMenu.Trigger
                className={`group flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm transition-colors ${hoverTone} ${
                  active ? activeTone : linkTone
                }`}
              >
                {group.label}
                <CaretDown
                  size={11}
                  weight="bold"
                  className="transition-transform duration-300 group-data-[state=open]:rotate-180"
                />
              </NavigationMenu.Trigger>

              {/* All three panels share one viewport, so moving between
                  triggers slides the old contents out and the new ones in
                  rather than closing and reopening a box. */}
              <NavigationMenu.Content className="nav-panel absolute left-0 top-0 w-auto p-1 pr-1.5">
                <div className="grid w-[560px] grid-cols-2 gap-2 rounded-[16px] border border-basalt/10 bg-paper p-2 shadow-sm">
                  {group.items.map((item) => (
                    <NavigationMenu.Link asChild key={item.href}>
                      <PanelItem item={item} />
                    </NavigationMenu.Link>
                  ))}
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-sm text-sage">
                    {group.footer.lead}{" "}
                    <NavigationMenu.Link asChild>
                      <Link
                        href={group.footer.href}
                        className="inline-flex items-center gap-1 font-medium text-basalt hover:underline"
                      >
                        {group.footer.cta}
                        <ArrowRight size={12} weight="bold" />
                      </Link>
                    </NavigationMenu.Link>
                  </p>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}

        {navPlain.map((item) => {
          const active = pathname === item.href;
          return (
            <NavigationMenu.Item key={item.href}>
              <NavigationMenu.Link asChild>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm transition-colors ${hoverTone} ${
                    active ? activeTone : linkTone
                  }`}
                >
                  {item.label}
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>

      {/* The shared tray. It morphs to whichever panel is showing. */}
      <div className="absolute left-0 top-full flex justify-start pt-3">
        <NavigationMenu.Viewport className="nav-viewport relative h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] origin-top-left overflow-hidden rounded-surface bg-paper-raised shadow-[0_28px_70px_-28px_rgba(23,26,25,0.45)]" />
      </div>
    </NavigationMenu.Root>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const reduce = useReducedMotion();
  const { count } = useCart();
  const { count: saved } = useFavourites();

  // IntersectionObserver on a sentinel, so the header state costs no scroll frames.
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:0;height:56px;width:1px;pointer-events:none;";
    document.body.appendChild(sentinel);
    const io = new IntersectionObserver(([entry]) => setLifted(!entry.isIntersecting));
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Only the homepage opens on a full-bleed dark image, so only there does the
  // header float over the photograph until the visitor scrolls past. Inner
  // pages hold their hero inside an inset card on paper, which leaves the
  // header sitting on paper from the first pixel.
  const overlay = pathname === "/" && !lifted && !open;

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
        overlay
          ? "border-transparent bg-transparent"
          : lifted || open
            ? "border-basalt/10 bg-paper/90 backdrop-blur-xl"
            : // Resting on an inner page: the hero card below is inset on
              // paper, so the header carries no rule until the page scrolls.
              "border-transparent bg-paper"
      }`}
    >
      {/* Below lg there is no centre nav to balance, so logo and the
          hamburger just sit at the two ends of a flex row. At lg the three
          tracks take over, so the nav sits dead centre whatever the logo
          and the button measure: logo left, nav middle, booking right. */}
      <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-6 px-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-10">
        <Link
          href="/"
          aria-label="Masailand Safari and Lodge, home"
          className="relative justify-self-start"
        >
          <Image
            src="/brand/logo-masailand.png"
            alt="Masailand Safari & Lodge"
            width={300}
            height={189}
            priority
            className={`h-10 w-auto transition-opacity duration-500 ${
              overlay ? "opacity-0" : "opacity-100"
            }`}
          />
          <Image
            src="/brand/logo-masailand-light.png"
            alt=""
            aria-hidden
            width={300}
            height={189}
            priority
            className={`absolute inset-0 h-10 w-auto transition-opacity duration-500 ${
              overlay ? "opacity-100" : "opacity-0"
            }`}
          />
        </Link>

        <DesktopNav pathname={pathname} overlay={overlay} />

        <div className="flex items-center gap-2 justify-self-end">
          {/* Favourites and the booking cart. Both counts only appear once
              their store has read itself back from localStorage, so the server
              and the first client render agree. */}
          <Link
            href="/favourites"
            aria-label={saved > 0 ? `Favourites, ${saved} saved` : "Favourites"}
            className={`relative grid h-10 w-10 place-items-center rounded-full border transition-colors ${
              overlay
                ? "border-paper/35 text-paper hover:bg-paper hover:text-basalt"
                : "border-basalt/20 text-basalt hover:bg-basalt hover:text-paper"
            }`}
          >
            <Heart size={17} weight={saved > 0 ? "fill" : "light"} />
            {saved > 0 && (
              <span
                className={`absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 font-mono text-[10px] leading-none ${
                  overlay ? "bg-paper text-basalt" : "bg-basalt text-paper"
                }`}
              >
                {saved}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label={count > 0 ? `Your booking, ${count} nights and days` : "Your booking"}
            className={`relative grid h-10 w-10 place-items-center rounded-full border transition-colors ${
              overlay
                ? "border-paper/35 text-paper hover:bg-paper hover:text-basalt"
                : "border-basalt/20 text-basalt hover:bg-basalt hover:text-paper"
            }`}
          >
            <Bag size={17} weight="light" />
            {count > 0 && (
              <span
                className={`absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 font-mono text-[10px] leading-none ${
                  overlay ? "bg-paper text-basalt" : "bg-basalt text-paper"
                }`}
              >
                {count}
              </span>
            )}
          </Link>

          {/* Outlined rather than filled. Black over paper, but the stroke has
              to lift to paper over the hero photography or it disappears. */}
          <Link
            href="/book"
            className={`hidden shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition-colors duration-200 active:scale-[0.98] lg:inline-block ${
              overlay
                ? "border-paper/70 text-paper hover:bg-paper hover:text-basalt"
                : "border-basalt text-basalt hover:bg-basalt hover:text-paper"
            }`}
          >
            Book now
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className={`grid h-10 w-10 place-items-center rounded-full border transition-colors lg:hidden ${
              overlay ? "border-paper/35 text-paper" : "border-basalt/20 text-basalt"
            }`}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X size={19} weight="light" /> : <List size={19} weight="light" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-basalt/10 bg-paper lg:hidden"
          >
            <div className="mx-auto max-w-[1400px] px-5 py-6">
              {navMenu.map((group) => (
                <section key={group.href} className="mb-7">
                  <Link
                    href={group.href}
                    className="font-display text-2xl text-basalt"
                    onClick={() => setOpen(false)}
                  >
                    {group.label}
                  </Link>
                  <ul className="mt-3 space-y-1">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <PanelItem item={item} onNavigate={() => setOpen(false)} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              <ul className="border-t border-basalt/10">
                {navPlain.map((item) => (
                  <li key={item.href} className="border-b border-basalt/10">
                    <Link
                      href={item.href}
                      className="block py-4 font-display text-2xl text-basalt"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href="/book"
                className="mt-6 block rounded-full border border-basalt px-6 py-3.5 text-center font-medium text-basalt transition-colors hover:bg-basalt hover:text-paper"
                onClick={() => setOpen(false)}
              >
                Book now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
