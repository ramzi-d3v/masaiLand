import Image from "next/image";
import { trustLogos } from "@/lib/content";

/*
  The lodge's real affiliations, muted to grayscale and sliding past. Colour
  returns on hover, which is what tells you the mark is worth a second look
  rather than wallpaper.

  Six logos read as thin content for a marquee, so the sequence repeats
  twice before doubling for the loop: [...seq, ...seq]. Because both halves
  of the track are pixel-identical renders of the same sequence, translating
  the track by exactly -50% always lands on the seam with no drift, whether
  or not individual logos share a width - the earlier photo-strip fix needed
  a fixed frame width because it computed the loop from a single frame's
  period; here the loop length is the whole sequence, so it stays exact even
  though each logo below keeps its own aspect ratio instead of a shared box.

  No section background: this sits directly on the page rather than as a
  banded strip, so each logo's fixed height is what carries the size down,
  not a container behind it.
*/
export default function TrustMarquee() {
  const sequence = [...trustLogos, ...trustLogos];
  const track = [...sequence, ...sequence];

  return (
    <section className="py-7 sm:py-9">
      <div className="trust relative mx-auto max-w-[1400px] overflow-hidden px-5 lg:px-10">
        <div className="trust-track flex w-max items-center">
          {track.map((logo, i) => (
            <div
              key={`${logo.src}-${i}`}
              className="relative mr-12 h-9 shrink-0 sm:mr-16 sm:h-10 lg:mr-20 lg:h-11"
              style={{ aspectRatio: `${logo.width} / ${logo.height}` }}
            >
              <Image
                src={`/brand/${logo.src}.png`}
                alt={i < sequence.length ? logo.alt : ""}
                aria-hidden={i >= sequence.length ? true : undefined}
                fill
                sizes="140px"
                className="object-contain opacity-50 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>

        {/* Plain fade at both ends, matching the page background. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-paper to-transparent" />
      </div>
    </section>
  );
}
