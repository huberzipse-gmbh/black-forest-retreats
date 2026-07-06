/**
 * Holz-Look (Single Source of Truth): CSS-Muster aus vertikalen Dielen,
 * feiner Maserung und Naht-Linien. Genutzt von der GiftVoucher-Sektion,
 * dem Gutschein-Kaufflow und der Gutschein-Kartenvorschau; das PDF
 * (lib/giftcards/pdf.tsx) übersetzt dasselbe Rezept in SVG.
 */
export const woodStyle = {
  backgroundColor: "#4a3322",
  backgroundImage: [
    "repeating-linear-gradient(91deg, rgba(0,0,0,0.10) 0 1px, transparent 1px 5px)",
    "repeating-linear-gradient(89deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 11px)",
    "repeating-linear-gradient(90deg, rgba(0,0,0,0.32) 0 2px, transparent 2px 4px, rgba(255,255,255,0.02) 4px 5px, transparent 5px 230px)",
    "linear-gradient(180deg, #5d4029, #382616)",
  ].join(", "),
} as const;
