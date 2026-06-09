import Image from "next/image";
import Link from "next/link";
import type { RetreatCard } from "@/data/retreats";
import { Type } from "@/components/ui/Type";
import { ApartmentMeta } from "./ApartmentMeta";

interface ApartmentCardProps {
  retreat: RetreatCard;
  ctaLabel: string;
  exclusiveLabel: string;
}

const CARD_CLASS =
  "group relative block h-[470px] w-[80vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[4px] shadow-[0_18px_50px_-24px_rgba(15,24,19,0.55)] transition-transform duration-500 hover:-translate-y-1.5 sm:w-[340px]";

export function ApartmentCard({
  retreat,
  ctaLabel,
  exclusiveLabel,
}: ApartmentCardProps) {
  return (
    <Link
      href={`/wohnungen/${retreat.slug}`}
      className={CARD_CLASS}
      aria-label={retreat.name}
    >
      <Image
        src={retreat.image}
        alt={retreat.name}
        fill
        sizes="(max-width: 640px) 80vw, 340px"
        className="object-cover transition-transform duration-[1300ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night/95 via-night/40 to-night/5" />

      {retreat.exclusive && (
        <span className="absolute right-4 top-4 z-20 rounded-full border border-brass-300/60 bg-night/40 px-3 py-1 font-body text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-brass-300 backdrop-blur-sm">
          {exclusiveLabel}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col p-7 text-cream-50">
        <Type role="eyebrow" className="text-brass-300">
          {retreat.highlight}
        </Type>
        <Type role="h2" as="h3" className="mt-3 text-cream-50">
          {retreat.name}
        </Type>

        <ApartmentMeta
          bedrooms={retreat.bedrooms}
          beds={retreat.beds}
          guests={retreat.maxGuests}
          className="mt-4 text-cream-100/85"
        />

        <span className="mt-6 inline-flex flex-col gap-2">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-50">
            {ctaLabel} &rarr;
          </span>
          <span className="h-px w-7 bg-brass-400 transition-all duration-500 group-hover:w-16" />
        </span>
      </div>
    </Link>
  );
}
