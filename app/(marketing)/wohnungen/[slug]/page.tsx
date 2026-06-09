import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { retreats, getRetreat } from "@/data/retreats";
import { de } from "@/lib/strings/de";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";
import { ApartmentMeta } from "@/components/sections/ApartmentMeta";

export function generateStaticParams() {
  return retreats.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getRetreat(slug);
  return {
    title: r
      ? `${r.name} — Black Forest Retreats`
      : "Unterkunft — Black Forest Retreats",
    description: r?.shortDescription,
  };
}

export default async function RetreatDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const retreat = getRetreat(slug);
  if (!retreat) notFound();

  const t = de.apartments;
  const gallery = retreat.gallery.slice(1);

  return (
    <article>
      {/* Hero-Banner */}
      <section className="relative flex min-h-[74svh] items-end overflow-hidden bg-night text-cream-50">
        <Image
          src={retreat.image}
          alt={retreat.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/95 via-night/40 to-night/30" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 md:px-10 md:pb-20">
          <Type role="eyebrow" className="text-brass-300">
            {retreat.highlight}
          </Type>
          <Type role="display" as="h1" className="mt-4 text-cream-50">
            {retreat.name}
          </Type>
          <ApartmentMeta
            bedrooms={retreat.bedrooms}
            beds={retreat.beds}
            guests={retreat.maxGuests}
            bathrooms={retreat.bathrooms}
            className="mt-6 text-cream-100/90"
          />
        </div>
      </section>

      {/* Galerie */}
      <section className="bg-cream-50 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/#apartments"
            className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.18em] text-forest-700 transition-colors hover:text-forest-900"
          >
            &larr; {t.detail.back}
          </Link>

          <Type role="eyebrow" className="mt-12 text-brass-600">
            {t.detail.overview}
          </Type>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {gallery.map((src, i) => (
              <Reveal key={src} delay={(i % 3) * 70}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[4px]">
                  <Image
                    src={src}
                    alt={`${retreat.name} — Foto ${i + 2}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.05]"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Beschreibung + Ausstattung */}
      <section className="bg-cream-100 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          <Reveal>
            <Type role="h2" as="h2" className="text-forest-900">
              {t.detail.about}
            </Type>
            <div className="mt-6 h-px w-12 bg-brass-400" />
            <p className="mt-7 font-body text-base leading-relaxed text-forest-700/85">
              {retreat.description}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <Type role="h3" as="h2" className="text-forest-900">
              {t.detail.amenities}
            </Type>
            <div className="mt-6 h-px w-12 bg-brass-400" />
            <ul className="mt-7 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {retreat.amenities.map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-3 font-body text-sm text-forest-700/85"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass-500" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Buchungs-CTA (Anker für die mobile Buchen-Leiste) */}
      <section
        id="apartments"
        className="relative overflow-hidden bg-forest-900 px-6 py-24 text-center text-cream-50 md:py-32"
      >
        <Reveal className="mx-auto max-w-2xl">
          <Type role="display" as="h2" className="text-cream-50">
            {t.detail.bookTitle}
          </Type>
          <div className="mx-auto mt-7 h-px w-14 bg-brass-400" />
          <Type role="lead" className="mx-auto mt-7 max-w-xl text-cream-100/85">
            {t.detail.bookText}
          </Type>
          <div className="mt-10">
            <a
              href={retreat.airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-brass-300"
            >
              {t.detail.book}
            </a>
          </div>
          <Type
            role="caption"
            className="mt-7 font-medium uppercase tracking-[0.18em] text-cream-100/55"
          >
            {t.detail.note}
          </Type>
        </Reveal>
      </section>
    </article>
  );
}
