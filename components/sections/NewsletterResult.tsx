import Link from "next/link";
import { Type } from "@/components/ui/Type";

/** Ergebnis-Seite für Newsletter-Bestätigung und -Abmeldung. */
export function NewsletterResult({
  title,
  text,
  cta,
  ok,
}: {
  title: string;
  text: string;
  cta: string;
  ok: boolean;
}) {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-cream-50 px-6 py-32">
      <div className="mx-auto max-w-md text-center">
        <span
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border ${
            ok ? "border-brass-400/60 text-brass-600" : "border-forest-900/20 text-forest-700/70"
          }`}
        >
          {ok ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12.5l4.2 4.2L19 7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 7.5v6M12 17h.01"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>

        <Type role="h2" as="h1" className="mt-7 text-forest-900">
          {title}
        </Type>
        <Type role="body" className="mt-4 text-forest-700/80">
          {text}
        </Type>

        <Link
          href="/"
          className="mt-9 inline-flex rounded-[3px] bg-forest-900 px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-50 transition-colors hover:bg-forest-700"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}
