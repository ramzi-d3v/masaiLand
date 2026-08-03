import { ArrowUpRight, EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { site, circuit } from "@/lib/content";

export const metadata = {
  title: "Contact Us",
  description:
    "Reach Masailand Safari & Lodge in Arumeru, Arusha, Tanzania. Call +255 624 71 20 20 or email info@masailandsafari.com.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        ariaLabel="Contact Masailand Safari and Lodge"
        slides={[
          {
            img: "hotel-front-view-1",
            alt: "The lodge entrance behind clipped topiary and palms",
            titleA: "Talk to the lodge",
            titleB: { em: "directly." },
            sub: "Get in touch directly and you get the best available rate, no fees, and someone at the other end of the phone.",
            note: `${site.address}. Forty five minutes from Kilimanjaro International Airport.`,
          },
        ]}
        meta={{ value: "Direct Booking", label: "Best available rate" }}
        icons={["phone", "email", "map"]}
        included={{
          label: "Ways to reach us",
          items: [
            { icon: "phone", label: site.tel },
            { icon: "email", label: site.email },
            { icon: "file", label: `Fax ${site.fax}` },
            { icon: "map", label: site.address },
            { icon: "calendar", label: "The form below" },
            { icon: "car", label: "45 minutes from Kilimanjaro International" },
          ],
        }}
      />

      <section className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.06]">
              Where to find us
            </h2>

            <dl className="mt-10 space-y-8">
              <div className="flex gap-4">
                <MapPin size={20} weight="light" className="mt-1 shrink-0 text-sage" />
                <div>
                  <dt className="text-sm text-sage">Address</dt>
                  <dd className="mt-1 text-lg">{site.address}</dd>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone size={20} weight="light" className="mt-1 shrink-0 text-sage" />
                <div>
                  <dt className="text-sm text-sage">Telephone</dt>
                  <dd className="mt-1 text-lg">
                    <a href={`tel:${site.telHref}`} className="link-draw hover:text-basalt">
                      {site.tel}
                    </a>
                  </dd>
                  <dd className="mt-1 text-sm text-sage">Fax {site.fax}</dd>
                </div>
              </div>
              <div className="flex gap-4">
                <EnvelopeSimple size={20} weight="light" className="mt-1 shrink-0 text-sage" />
                <div>
                  <dt className="text-sm text-sage">Email</dt>
                  <dd className="mt-1 text-lg">
                    <a href={`mailto:${site.email}`} className="link-draw hover:text-basalt">
                      {site.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-12 border-t border-basalt/12 pt-9">
              <h3 className="label text-sage">Getting here</h3>
              <ul className="mt-6 space-y-4">
                {circuit.map((d) => (
                  <li key={d.name} className="flex items-baseline justify-between gap-6">
                    <span>{d.name}</span>
                    <span className="shrink-0 font-mono text-basalt">
                      {d.distance} {d.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Masailand+Safari+and+Lodge+Arusha"
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-basalt/20 px-7 py-3.5 font-medium transition-colors hover:border-basalt hover:bg-basalt hover:text-paper"
            >
              Open in Google Maps
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.06]">
              Send a message
            </h2>
            <div className="mt-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
