"use client";

/**
 * Hero-Video mit robustem Autoplay.
 *
 * Kernproblem: React rendert das muted-Attribut NICHT ins Server-HTML
 * (bekannter React-Bug, muted wird nur als DOM-Property gesetzt). Browser
 * halten das Video vor der Hydration deshalb für vertont und blockieren
 * Autoplay — sichtbarer nativer Play-Button, v. a. iOS/Safari/Stromsparmodus.
 *
 * Lösung in drei Schichten:
 * 1. Das video-Tag wird per dangerouslySetInnerHTML als roher HTML-String
 *    gerendert → muted/playsinline/webkit-playsinline stehen GARANTIERT im
 *    initialen Server-HTML, der Browser darf sofort autoplayen.
 * 2. Solange das Video nicht läuft, liegt das Poster-Bild als Overlay
 *    darüber (blendet beim "playing"-Event weich aus). Selbst wenn ein
 *    Browser Autoplay blockiert, sieht der User nur das Standbild — nie
 *    einen Play-Button. Zusätzlich versteckt globals.css das native
 *    WebKit-Start-Playback-Overlay.
 * 3. Retry-Netz: play() wird bei canplay, Sichtbarkeitswechsel und der
 *    ersten Interaktion irgendwo auf der Seite erneut versucht.
 */
import { useEffect, useRef, useState } from "react";

const POSTER = "/hero/hero-desktop-v4.png";
const VIDEO_CLASS =
  "absolute inset-0 h-full w-full scale-105 object-cover object-center blur-[2px]";

// Rohes HTML statt JSX, damit muted & Co. sicher im Server-Markup landen.
const VIDEO_HTML = `<video autoplay loop muted playsinline webkit-playsinline preload="auto" disablepictureinpicture disableremoteplayback aria-hidden="true" tabindex="-1" poster="${POSTER}" class="${VIDEO_CLASS}"><source src="/hero/hero-loop.mp4" type="video/mp4" /></video>`;

export function HeroVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // WICHTIG: React ersetzt den dangerouslySetInnerHTML-Wrapper samt
    // video-Element kurz NACH der Hydration (Mismatch-Recovery, weil die
    // Browser-Serialisierung nie exakt dem HTML-String entspricht). Deshalb:
    // NIE feste Node-Referenzen closuren — Wrapper immer live über den Ref
    // auflösen und Media-Events (bubbeln nicht, capturen aber) am document
    // abfangen, das nie ersetzt wird.
    const getVideo = () => wrapperRef.current?.querySelector("video") ?? null;
    const isOurs = (t: EventTarget | null): t is HTMLVideoElement =>
      t instanceof HTMLVideoElement && !!wrapperRef.current?.contains(t);

    const tryPlay = () => {
      const video = getVideo();
      if (!video) return;
      // Stummschaltung zusätzlich als Property erzwingen (Gürtel + Hosenträger).
      video.muted = true;
      video.defaultMuted = true;
      if (video.paused) video.play().catch(() => {});
    };
    const syncState = () => {
      const video = getVideo();
      if (video && !video.paused && !video.ended) setPlaying(true);
      tryPlay();
    };
    const onPlaying = (e: Event) => {
      if (isOurs(e.target)) setPlaying(true);
    };
    const onPause = (e: Event) => {
      if (isOurs(e.target)) setPlaying(false);
    };
    const onCanPlay = (e: Event) => {
      if (isOurs(e.target)) tryPlay();
    };

    document.addEventListener("playing", onPlaying, true);
    document.addEventListener("pause", onPause, true);
    document.addEventListener("canplay", onCanPlay, true);
    document.addEventListener("visibilitychange", tryPlay);
    // Letztes Netz: die erste Interaktion irgendwo auf der Seite startet das Video.
    window.addEventListener("touchstart", tryPlay, { once: true, passive: true });
    window.addEventListener("click", tryPlay, { once: true });

    // Sofort + Nachzügler-Versuche (fangen den Element-Ersatz nach Hydration ab).
    syncState();
    const timers = [250, 1000, 3000].map((ms) => window.setTimeout(syncState, ms));

    return () => {
      timers.forEach(clearTimeout);
      document.removeEventListener("playing", onPlaying, true);
      document.removeEventListener("pause", onPause, true);
      document.removeEventListener("canplay", onCanPlay, true);
      document.removeEventListener("visibilitychange", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("click", tryPlay);
    };
  }, []);

  return (
    <>
      <div
        ref={wrapperRef}
        aria-hidden
        className="absolute inset-0"
        // suppressHydrationWarning: der String wird nicht von React diffed.
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: VIDEO_HTML }}
      />
      {/* Poster-Overlay: verdeckt das Video (und jeden nativen Play-Button),
          bis das "playing"-Event feuert — dann weicher Crossfade. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={POSTER}
        alt=""
        aria-hidden
        draggable={false}
        className={`pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover object-center blur-[2px] transition-opacity duration-700 ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      />
    </>
  );
}
