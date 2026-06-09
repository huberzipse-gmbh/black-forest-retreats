import Image from "next/image";

type Variant = "hutUhr" | "schinkenTorte";

interface DecorItem {
  src: string;
  size: number;
  pos: string; // Tailwind-Positionsklassen
  rotate: number;
  opacity: number;
  hideOnMobile?: boolean;
}

const SETS: Record<Variant, DecorItem[]> = {
  // Erstes Zitat (Silva Nigra): Bollenhut + Kuckucksuhr — als gestreutes Hintergrund-Muster
  hutUhr: [
    { src: "/images/elemente/uhr.png", size: 148, pos: "left-[2%] top-[16%]", rotate: -9, opacity: 0.24 },
    { src: "/images/elemente/hut.png", size: 116, pos: "right-[3%] top-[12%]", rotate: 11, opacity: 0.22 },
    { src: "/images/elemente/hut.png", size: 96, pos: "left-[15%] bottom-[10%]", rotate: -7, opacity: 0.2 },
    { src: "/images/elemente/uhr.png", size: 126, pos: "right-[9%] bottom-[14%]", rotate: 8, opacity: 0.22 },
    { src: "/images/elemente/hut.png", size: 78, pos: "left-[40%] top-[4%]", rotate: -15, opacity: 0.16, hideOnMobile: true },
    { src: "/images/elemente/uhr.png", size: 86, pos: "right-[33%] bottom-[3%]", rotate: 13, opacity: 0.17, hideOnMobile: true },
  ],
  // Zweites Zitat (Genuss): Schinken + Schwarzwälder Kirschtorte
  schinkenTorte: [
    { src: "/images/elemente/kirschtorte.png", size: 142, pos: "right-[3%] top-[14%]", rotate: 9, opacity: 0.26 },
    { src: "/images/elemente/schinken.png", size: 150, pos: "left-[2%] top-[18%]", rotate: -8, opacity: 0.24 },
    { src: "/images/elemente/kirschtorte.png", size: 100, pos: "left-[16%] bottom-[12%]", rotate: -10, opacity: 0.2 },
    { src: "/images/elemente/schinken.png", size: 128, pos: "right-[8%] bottom-[14%]", rotate: 7, opacity: 0.22 },
    { src: "/images/elemente/schinken.png", size: 82, pos: "left-[41%] top-[5%]", rotate: -13, opacity: 0.17, hideOnMobile: true },
    { src: "/images/elemente/kirschtorte.png", size: 90, pos: "right-[35%] bottom-[4%]", rotate: 12, opacity: 0.18, hideOnMobile: true },
  ],
};

/** Gestreute Schwarzwald-Elemente als dezentes Hintergrund-Muster (sepia via multiply). */
export function FactDecor({ variant }: { variant: Variant }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {SETS[variant].map((it, i) => (
        <Image
          key={i}
          src={it.src}
          alt=""
          width={it.size}
          height={it.size}
          className={`absolute ${it.pos} mix-blend-multiply ${
            it.hideOnMobile ? "hidden sm:block" : ""
          }`}
          style={{ opacity: it.opacity, transform: `rotate(${it.rotate}deg)` }}
        />
      ))}
    </div>
  );
}
