"use client";

import type { ReactNode } from "react";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtNum } from "@/lib/i18n/format";

const ICONS: Record<string, ReactNode> = {
  bedrooms: (
    <>
      <path d="M3 21V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v15M3 21h16M3 13h14" />
      <path d="M14 11h.01" />
    </>
  ),
  beds: (
    <>
      <path d="M2 18v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5M2 18h20M2 18v2M22 18v2" />
      <path d="M6 11V9a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 18 9v2" />
    </>
  ),
  guests: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M6 20v-1a6 6 0 0 1 12 0v1" />
    </>
  ),
  bathrooms: (
    <>
      <path d="M4 12h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2z" />
      <path d="M7 12V6a2 2 0 0 1 3.4-1.4M9 6h2M5 20l1-2M19 20l-1-2" />
    </>
  ),
};

interface ApartmentMetaProps {
  bedrooms: number;
  beds: number;
  guests: number;
  bathrooms?: number;
  className?: string;
}

/** Eckdaten als Icon + Zahl + Label (erbt die Textfarbe vom Eltern-Element). */
export function ApartmentMeta({
  bedrooms,
  beds,
  guests,
  bathrooms,
  className = "",
}: ApartmentMetaProps) {
  const f = useStrings().apartments.facts;
  const locale = useLocale();
  const items: { key: string; value: number; label: string }[] = [
    { key: "bedrooms", value: bedrooms, label: f.bedrooms },
    { key: "beds", value: beds, label: f.beds },
    { key: "guests", value: guests, label: f.guests },
  ];
  if (bathrooms) {
    items.push({ key: "bathrooms", value: bathrooms, label: f.bathrooms });
  }

  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      {items.map((it) => (
        <span key={it.key} className="inline-flex items-center gap-2">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[18px] w-[18px] opacity-80"
          >
            {ICONS[it.key]}
          </svg>
          <span className="font-body text-[0.8rem]">
            {fmtNum(it.value, locale)} {it.label}
          </span>
        </span>
      ))}
    </div>
  );
}
