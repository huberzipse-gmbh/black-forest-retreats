"use client";

/**
 * Sprachwähler — zeigt die schon real übersetzten Sprachen (availableLocales).
 * Auswahl setzt das Cookie NEXT_LOCALE und lädt neu, damit der Server die
 * Strings in der neuen Sprache rendert. Phase 1A: nur Deutsch sichtbar; die
 * Mechanik ist vollständig da und per Cookie auf en/ar/zh testbar.
 */
import { availableLocales, localeNames, type Locale } from "@/lib/i18n/config";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const current = useLocale();
  const label = useStrings().langSwitcher.label;

  const choose = (l: Locale) => {
    if (l === current) return;
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <div className={className}>
      <span className="font-body text-[0.6rem] font-medium uppercase tracking-[0.34em] text-cream-100/45">
        {label}
      </span>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {availableLocales.map((l) => {
          const active = l === current;
          return (
            <button
              key={l}
              type="button"
              aria-pressed={active}
              onClick={() => choose(l)}
              className={`font-body text-xs uppercase tracking-[0.18em] transition-colors duration-300 ${
                active
                  ? "text-brass-300"
                  : "text-cream-100/60 hover:text-cream-50"
              }`}
            >
              {localeNames[l]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
