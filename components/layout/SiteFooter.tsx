import { useStrings } from "@/lib/i18n/useStrings";

export function SiteFooter() {
  const t = useStrings();
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

          {/* Entdecken */}
          <div className="md:col-span-2">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-cream-50/50">
              {t.footer.discover.title}
            </p>
            <ul className="mt-5 space-y-3">
              {t.footer.discover.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-sm text-cream-100/80 transition-colors hover:text-brass-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div className="md:col-span-2">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-cream-50/50">
              {t.footer.service.title}
            </p>
            <ul className="mt-5 space-y-3">
              {t.footer.service.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-sm text-cream-100/80 transition-colors hover:text-brass-300"
                  >
                    {link}
                  </a>
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
            <form className="mt-4 flex max-w-sm gap-2" aria-label={t.footer.contact.newsletterTitle}>
              <input
                type="email"
                required
                placeholder={t.footer.contact.newsletterPlaceholder}
                className="min-w-0 flex-1 border border-cream-50/20 bg-transparent px-4 py-3 font-body text-sm text-cream-50 placeholder:text-cream-100/40 focus:border-brass-300 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-[3px] bg-brass-400 px-5 py-3 font-body text-xs font-semibold uppercase tracking-[0.16em] text-night transition-colors hover:bg-brass-300"
              >
                {t.footer.contact.newsletterCta}
              </button>
            </form>
          </div>
        </div>

        {/* Untere Leiste */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-cream-50/10 pt-7 md:flex-row">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {t.footer.legal.map((item) => (
              <a
                key={item}
                href="#"
                className="font-body text-xs text-cream-100/55 transition-colors hover:text-brass-300"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="font-body text-xs text-cream-100/45">
            {t.footer.copyright(year)}
          </p>
        </div>
      </div>
    </footer>
  );
}
