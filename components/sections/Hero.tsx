export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[88svh] overflow-hidden bg-night md:min-h-[100svh]"
    >
      {/* Hero-Video — Ping-Pong-Loop (vorwärts ↔ rückwärts), leicht verschwommen, stumm */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
        poster="/hero/hero-desktop-v4.png"
        className="absolute inset-0 h-full w-full scale-105 object-cover object-center blur-[2px]"
      >
        <source src="/hero/hero-loop.mp4" type="video/mp4" />
      </video>

      {/* Schwarzer Verlauf oben → unten: stärker & länger (für die weiße Kopfzeile) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[58vh] bg-gradient-to-b from-black/72 via-black/34 to-transparent"
      />
    </section>
  );
}
