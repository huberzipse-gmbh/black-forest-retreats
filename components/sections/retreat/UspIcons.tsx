import type { ReactNode } from "react";

/** Icon-Set für die Unterkunfts-Highlights (USPs). Konvention: 24×24, stroke. */
export type UspIconKey =
  | "castle"
  | "key"
  | "parking"
  | "sparkle"
  | "beams"
  | "bath"
  | "wifi"
  | "waves"
  | "group"
  | "kitchen"
  | "location"
  | "stairs"
  | "building"
  | "arch"
  | "terrace";

export const USP_ICONS: Record<UspIconKey, ReactNode> = {
  castle: (
    <>
      <path d="M4 21V9l2-1 2 1 2-1 2 1 2-1 2 1 2-1v11" />
      <path d="M3 21h18M10 21v-4h4v4" />
    </>
  ),
  key: (
    <>
      <circle cx="16" cy="8" r="3" />
      <path d="M14 10 6 18v2h2l1-1h2v-2h1" />
    </>
  ),
  parking: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9z" />
      <path d="M18.5 15l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z" />
    </>
  ),
  beams: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="1" />
      <path d="M4 5l16 14M20 5 4 19M12 5v14" />
    </>
  ),
  bath: (
    <>
      <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z" />
      <path d="M7 12V6a2 2 0 0 1 3.4-1.4M5 20l1-1.6M19 20l-1-1.6" />
    </>
  ),
  wifi: (
    <>
      <path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0M11 18.4a2 2 0 0 1 2 0" />
      <path d="M12 21h.01" />
    </>
  ),
  waves: (
    <path d="M3 7c2 1.6 4 1.6 6 0s4-1.6 6 0 4 1.6 6 0M3 12c2 1.6 4 1.6 6 0s4-1.6 6 0 4 1.6 6 0M3 17c2 1.6 4 1.6 6 0s4-1.6 6 0 4 1.6 6 0" />
  ),
  group: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5.5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v1" />
    </>
  ),
  kitchen: (
    <path d="M6 3v7a2 2 0 0 0 4 0V3M8 10v11M17 3c-1.5 0-2.5 1.5-2.5 4s1 4 2.5 4v8" />
  ),
  location: (
    <>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.4" />
    </>
  ),
  stairs: <path d="M3 20h3v-3h3v-3h3v-3h3v-3h3M3 20v-1" />,
  building: (
    <>
      <path d="M5 21V6l7-3 7 3v15M4 21h16M9 21v-4h6v4" />
      <path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01" />
    </>
  ),
  arch: (
    <>
      <path d="M5 21V11a7 7 0 0 1 14 0v10" />
      <path d="M4 21h16M9 21v-5a3 3 0 0 1 6 0v5" />
    </>
  ),
  terrace: (
    <>
      <circle cx="12" cy="7" r="3" />
      <path d="M3 13h18l-2 7H5l-2-7zM12 10v3" />
    </>
  ),
};

export function UspIcon({
  name,
  className = "h-6 w-6",
}: {
  name: UspIconKey;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {USP_ICONS[name]}
    </svg>
  );
}
