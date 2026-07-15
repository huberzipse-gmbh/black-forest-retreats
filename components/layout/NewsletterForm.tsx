"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { subscribeNewsletter } from "@/lib/newsletter/actions";

/** Newsletter-Anmeldung im Footer. Speichert in Supabase, Double-Opt-in per Mail. */
export function NewsletterForm() {
  const t = useStrings();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFailed(false);
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const res = await subscribeNewsletter({
        email: String(fd.get("email") ?? ""),
        company: String(fd.get("company") ?? ""),
        locale,
      });
      if (res.ok) {
        setSent(true);
        form.reset();
      } else {
        setFailed(true);
      }
    });
  };

  if (sent) {
    return (
      <p className="mt-4 max-w-sm rounded-[5px] border border-brass-300/40 bg-brass-400/10 px-4 py-3 font-body text-sm text-cream-50">
        {t.newsletter.success}
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mt-4 max-w-sm"
      aria-label={t.footer.contact.newsletterTitle}
    >
      {/* Honeypot — für Menschen unsichtbar */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Firma
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex gap-2">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.footer.contact.newsletterPlaceholder}
          className="min-w-0 flex-1 border border-cream-50/20 bg-transparent px-4 py-3 font-body text-sm text-cream-50 placeholder:text-cream-100/40 focus:border-brass-300 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-[3px] bg-brass-400 px-5 py-3 font-body text-xs font-semibold uppercase tracking-[0.16em] text-night transition-colors hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? t.newsletter.sending : t.footer.contact.newsletterCta}
        </button>
      </div>

      {failed && (
        <p className="mt-3 font-body text-sm text-brass-300">{t.newsletter.error}</p>
      )}

      <p className="mt-3 font-body text-xs leading-relaxed text-cream-100/55">
        {t.newsletter.privacy}{" "}
        <Link
          href="/datenschutz"
          className="underline underline-offset-2 hover:text-brass-300"
        >
          {t.newsletter.privacyLink}
        </Link>
        {t.newsletter.privacyAfter}
      </p>
    </form>
  );
}
