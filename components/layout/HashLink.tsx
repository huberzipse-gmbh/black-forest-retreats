"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

/**
 * Link auf einen Anker der Startseite ("/#apartments").
 *
 * Auf derselben Seite behandelt der Client-Router einen Klick auf die bereits
 * aktive URL als No-op — dann scrollt gar nichts. Genau das ließ die
 * Buchen-Links "festhängen". Deshalb springen wir hier selbst zum Ziel
 * (scrollIntoView beachtet scroll-padding-top, also die Höhe des fixen Headers).
 *
 * Bewusst harter Sprung statt `behavior: "smooth"`: Die Startseite ist sehr lang
 * und voller Reveal-Animationen/Lazy-Bilder; eine weiche Scroll-Animation über
 * die ganze Höhe bricht sichtbar ab bzw. lässt den Renderer haken. Der direkte
 * Sprung landet dagegen zuverlässig auf der Wohnungs-Übersicht.
 *
 * Von einer Unterseite navigiert der normale Link zurück zur Startseite.
 */
export function HashLink({
  href,
  onClick,
  ...rest
}: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  const [path, hash] = href.split("#");
  const target = path === "" || path === "/" ? "/" : path.replace(/\/$/, "");

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (!hash || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (pathname !== target) return; // andere Seite → normaler Link navigiert

    const el = document.getElementById(hash);
    if (!el) return;
    e.preventDefault();
    // setTimeout statt requestAnimationFrame: rAF pausiert in Hintergrund-Tabs,
    // der Sprung bliebe dann aus. Der kurze Timeout lässt zudem das Burger-Menü
    // schließen (es setzt overflow:hidden auf <body> zurück), bevor wir springen.
    window.setTimeout(() => {
      // <body> kann noch overflow:hidden vom offenen Menü tragen — vor dem
      // Sprung freigeben, sonst landet scrollIntoView im Nichts.
      document.body.style.overflow = "";
      el.scrollIntoView({ block: "start" });
      history.replaceState(null, "", `#${hash}`);
    }, 0);
  }

  return <Link href={href} onClick={handleClick} {...rest} />;
}
