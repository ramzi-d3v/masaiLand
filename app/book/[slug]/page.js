import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import ItemDetail from "@/components/book/ItemDetail";
import ItemTabs from "@/components/book/ItemTabs";
import SpotlightCarousel from "@/components/SpotlightCarousel";
import { catalogue, getCatalogueItem, relatedItems } from "@/lib/catalogue";

export function generateStaticParams() {
  return catalogue.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = getCatalogueItem(slug);
  if (!item) return {};
  return {
    title: item.name,
    description: item.lead,
  };
}

export default async function BookItemPage({ params }) {
  const { slug } = await params;
  const item = getCatalogueItem(slug);
  if (!item) notFound();

  const related = relatedItems(slug).map((r) => ({
    src: r.images[0],
    alt: r.name,
    tag: r.badge,
    title: r.name,
    desc: r.lead,
    href: r.href,
  }));

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pb-4 pt-[104px] lg:px-10 lg:pt-[120px]">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-sage">
          <Link href="/" className="hover:text-basalt">
            Home
          </Link>
          <CaretRight size={11} weight="bold" aria-hidden />
          <Link href="/book" className="hover:text-basalt">
            Book
          </Link>
          <CaretRight size={11} weight="bold" aria-hidden />
          <Link href={`/book?type=${item.kind}`} className="hover:text-basalt">
            {item.category}
          </Link>
          <CaretRight size={11} weight="bold" aria-hidden />
          <span className="text-basalt">{item.name}</span>
        </nav>

        <ItemDetail item={item} />
      </section>

      <ItemTabs item={item} />

      <div className="bg-paper-raised">
        <SpotlightCarousel title="Also on the property" items={related} />
      </div>
    </>
  );
}
