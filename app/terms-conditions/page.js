import PageHero from "@/components/PageHero";
import { site } from "@/lib/content";

export const metadata = {
  title: "Terms & Conditions",
  description: "Booking terms and conditions for Masailand Safari & Lodge, Arusha, Tanzania.",
};

/*
  The original page carries the lodge's own legal wording. That text is not
  reproduced or rewritten here, since legal copy must be migrated verbatim by
  the property. This page keeps the route and the layout ready for it.
*/
export default function TermsPage() {
  return (
    <>
      <PageHero
        ariaLabel="Terms and conditions"
        slides={[
          {
            img: "front-2",
            alt: "The front of the lodge with flags along the driveway",
            titleA: "Terms &",
            titleB: { em: "Conditions." },
            sub: "The lodge's own booking terms. Ask the front desk for the current wording in full.",
            note: `Masailand Safari & Lodge, ${site.address}.`,
          },
        ]}
        meta={{ value: "Booking Terms", label: "Direct from the lodge" }}
        icons={["file", "phone", "email"]}
        chips={[
          { icon: "phone", label: site.tel },
          { icon: "email", label: site.email },
        ]}
      />

      <section className="mx-auto max-w-[820px] px-5 py-24 lg:px-10 lg:py-32">
        <div className="rounded-surface border border-basalt/12 bg-paper-raised p-8">
          <h2 className="font-display text-2xl leading-tight">This page needs the real text</h2>
          <p className="mt-4 leading-relaxed text-sage">
            The booking terms from masailandsafari.com/terms-conditions should be
            pasted in here word for word. Legal copy is not something to
            paraphrase, so it has been left out rather than rewritten.
          </p>
          <p className="mt-4 leading-relaxed text-sage">
            Questions in the meantime go to{" "}
            <a href={`mailto:${site.email}`} className="link-draw text-basalt">
              {site.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
