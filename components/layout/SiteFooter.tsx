"use client";

import Link from "next/link";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtNum } from "@/lib/i18n/format";
import { HashLink } from "@/components/layout/HashLink";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

// Reihenfolge identisch zu t.footer.legal (= Impressum, Datenschutz, AGB, Widerruf).
// Rechtstexte sind rechtlich maßgeblich deutsch; in jeder UI-Sprache gleiches Ziel.
const LEGAL_HREFS = ["/impressum", "/datenschutz", "/agb", "/widerruf"] as const;

// Reihenfolge identisch zu t.footer.discover.links
// (= Unterkünfte, Umgebung, Gutschein, Buchen).
// „Buchen" führt zur Wohnungs-Übersicht — dort startet jede Buchung.
const DISCOVER_HREFS = [
  "/#apartments",
  "/umgebung",
  "/#gutschein",
  "/#apartments",
] as const;

export function SiteFooter() {
  const t = useStrings();
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-night text-cream-100">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Marke */}
          <div className="md:col-span-4">
            <p className="font-display text-2xl text-cream-50">{t.brand.name}</p>
            <p className="mt-1 font-body text-[0.65rem] font-medium uppercase tracking-[0.32em] text-brass-300">
              {t.brand.location}
            </p>
            <p className="mt-6 max-w-xs font-body text-sm leading-relaxed text-cream-100/65">
              {t.footer.tagline}
            </p>
          </div>

          {/* Entdecken — vier Seiten als 2x2-Raster */}
          <div className="md:col-span-4">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-cream-50/50">
              {t.footer.discover.title}
            </p>
            <ul className="mt-5 grid max-w-xs grid-cols-2 gap-x-8 gap-y-3">
              {t.footer.discover.links.map((link, i) => (
                <li key={link}>
                  <HashLink
                    href={DISCOVER_HREFS[i] ?? "/"}
                    className="font-body text-sm text-cream-100/80 transition-colors hover:text-brass-300"
                  >
                    {link}
                  </HashLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt + Newsletter */}
          <div className="md:col-span-4">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-cream-50/50">
              {t.footer.contact.title}
            </p>
            <p className="mt-5 font-body text-sm text-cream-100/80">
              {t.footer.contact.location}
            </p>
            <a
              href={`mailto:${t.footer.contact.email}`}
              className="font-body text-sm text-cream-100/80 transition-colors hover:text-brass-300"
            >
              {t.footer.contact.email}
            </a>

            <p className="mt-8 font-body text-xs font-semibold uppercase tracking-[0.2em] text-cream-50/50">
              {t.footer.contact.newsletterTitle}
            </p>
            <p className="mt-3 max-w-xs font-body text-sm text-cream-100/65">
              {t.footer.contact.newsletterText}
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Untere Leiste */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-cream-50/10 pt-7 md:flex-row">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {t.footer.legal.map((item, i) => (
              <Link
                key={item}
                href={LEGAL_HREFS[i] ?? "#"}
                className="font-body text-xs text-cream-100/55 transition-colors hover:text-brass-300"
              >
                {item}
              </Link>
            ))}
          </div>
          <div className="flex flex-col items-center gap-1.5 md:items-end">
            <p className="font-body text-xs text-cream-100/45">
              {fmtNum(t.footer.copyright(year), locale)}
            </p>
            <p className="font-body text-xs text-cream-100/70">
              {t.footer.credit}:{" "}
              <a
                href="https://huber-zipse.de"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brass-300 underline-offset-2 transition-colors hover:text-brass-200 hover:underline"
              >
                Huber &amp; Zipse GmbH
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
