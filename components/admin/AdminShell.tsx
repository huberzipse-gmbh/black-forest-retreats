"use client";

/**
 * Admin-Gerüst: Sidebar (Desktop) / Topbar mit Burger-Menü + Slide-in-Drawer
 * (Mobil) in Markenfarben. Die Login-Seite rendert ohne Shell (Vollbild).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/app/admin/actions";

/** Einheitliche Stroke-Icons (24er-Viewbox, Linienstil passend zur Marke). */
function NavIcon({ name, className }: { name: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (name) {
    case "dashboard": // Balkendiagramm
      return (
        <svg {...common}>
          <path d="M4 20V10M10 20V4M16 20v-8M21 20H3" />
        </svg>
      );
    case "buchungen": // Kalender mit Haken
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
          <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5M9 14.5l2.2 2.2 3.8-4" />
        </svg>
      );
    case "wohnungen": // Haus
      return (
        <svg {...common}>
          <path d="M3.5 11.5 12 4l8.5 7.5" />
          <path d="M5.5 10v9.5h13V10" />
          <path d="M10 19.5v-5h4v5" />
        </svg>
      );
    case "rechnungen": // Euro-Zeichen
      return (
        <svg {...common}>
          <path d="M17.5 6.5a6.5 6.5 0 1 0 0 11" />
          <path d="M4.5 10.5h8M4.5 13.5h8" />
        </svg>
      );
    case "gutscheine": // Geschenk
      return (
        <svg {...common}>
          <rect x="4" y="9" width="16" height="11" rx="1.5" />
          <path d="M4 12.5h16M12 9v11M12 9c-2.5 0-4.5-1-4.5-2.75S9 3.5 10 4.5s2 3 2 4.5c0-1.5 1-3.5 2-4.5s2.5.25 2.5 1.75S14.5 9 12 9Z" />
        </svg>
      );
    case "emails": // Umschlag
      return (
        <svg {...common}>
          <rect x="3" y="5.5" width="18" height="13" rx="2" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
      );
    case "einstellungen": // Schieberegler
      return (
        <svg {...common}>
          <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h9M17 17h3" />
          <circle cx="15" cy="7" r="2" />
          <circle cx="9" cy="12" r="2" />
          <circle cx="15" cy="17" r="2" />
        </svg>
      );
    default:
      return null;
  }
}

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/buchungen", label: "Buchungen", icon: "buchungen" },
  { href: "/admin/wohnungen", label: "Wohnungen", icon: "wohnungen" },
  { href: "/admin/rechnungen", label: "Rechnungen", icon: "rechnungen" },
  { href: "/admin/gutscheine", label: "Gutscheine", icon: "gutscheine" },
  { href: "/admin/emails", label: "E-Mails", icon: "emails" },
  { href: "/admin/einstellungen", label: "Einstellungen", icon: "einstellungen" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Drawer bei Navigation schließen (z. B. Browser-Zurück).
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Hintergrund nicht scrollen, solange der Drawer offen ist; Escape schließt.
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  if (pathname === "/admin/login") return <>{children}</>;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-svh bg-cream-100 md:flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden w-60 shrink-0 flex-col bg-forest-900 md:flex">
        <div className="px-6 py-7">
          <Link href="/admin" className="block">
            <span className="font-display text-lg tracking-wide text-cream-50">
              Black Forest
            </span>
            <span className="mt-0.5 block font-body text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-brass-300">
              Admin
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-[5px] px-4 py-2.5 font-body text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-cream-50/10 font-semibold text-brass-300"
                  : "text-cream-100/75 hover:bg-cream-50/5 hover:text-cream-50"
              }`}
            >
              <NavIcon name={item.icon} className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-1 px-3 pb-6">
          <Link
            href="/"
            className="block rounded-[5px] px-4 py-2.5 font-body text-xs text-cream-100/60 transition-colors hover:text-cream-50"
          >
            → Zur Website
          </Link>
          <button
            type="button"
            onClick={() => adminLogout()}
            className="w-full rounded-[5px] px-4 py-2.5 text-start font-body text-xs text-cream-100/60 transition-colors hover:text-cream-50"
          >
            Abmelden
          </button>
        </div>
      </aside>

      {/* Topbar (Mobil): Marke + Burger */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-forest-900 ps-5 pe-2 py-2.5 md:hidden">
        <Link href="/admin" className="block">
          <span className="font-display text-base tracking-wide text-cream-50">Black Forest</span>
          <span className="ms-2 font-body text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-brass-300">
            Admin
          </span>
        </Link>
        <button
          type="button"
          aria-label="Menü öffnen"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-[5px] text-cream-50 transition-colors hover:bg-cream-50/10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" aria-hidden className="h-6 w-6">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      {/* Drawer (Mobil): Backdrop + Slide-in-Navigation */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Menü schließen"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-night/50 transition-opacity duration-200 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 start-0 flex w-72 max-w-[85vw] flex-col bg-forest-900 shadow-[20px_0_60px_-30px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between ps-6 pe-2 pt-4 pb-3">
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="block pt-2">
              <span className="font-display text-lg tracking-wide text-cream-50">Black Forest</span>
              <span className="mt-0.5 block font-body text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-brass-300">
                Admin
              </span>
            </Link>
            <button
              type="button"
              aria-label="Menü schließen"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-[5px] text-cream-100/75 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" aria-hidden className="h-6 w-6">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 pt-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
                className={`flex items-center gap-3 rounded-[5px] px-4 py-3 font-body text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-cream-50/10 font-semibold text-brass-300"
                    : "text-cream-100/75 hover:bg-cream-50/5 hover:text-cream-50"
                }`}
              >
                <NavIcon name={item.icon} className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="space-y-1 px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
              className="block rounded-[5px] px-4 py-3 font-body text-xs text-cream-100/60 transition-colors hover:text-cream-50"
            >
              → Zur Website
            </Link>
            <button
              type="button"
              onClick={() => adminLogout()}
              tabIndex={menuOpen ? 0 : -1}
              className="w-full rounded-[5px] px-4 py-3 text-start font-body text-xs text-cream-100/60 transition-colors hover:text-cream-50"
            >
              Abmelden
            </button>
          </div>
        </aside>
      </div>

      {/* Inhalt */}
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
