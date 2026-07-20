"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Type } from "@/components/ui/Type";
import { Reveal } from "@/components/ui/Reveal";
import { useStrings } from "@/lib/i18n/useStrings";
import { useLocaleHref } from "@/lib/i18n/I18nProvider";
import { sendEventInquiry } from "@/lib/contact/eventActions";

/** Cover der Marktstraße 25 — bewusst geblurrt, bis die Event-Fotos da sind. */
const IMAGE = "/images/wohnungen/raccoon-house/01.webp";

const inputBase =
  "w-full rounded-[5px] border border-forest-900/15 bg-cream-50/70 px-4 py-3 font-body text-[0.95rem] text-forest-900 placeholder:text-forest-700/40 outline-none transition-colors duration-300 focus:border-brass-400 focus:bg-white";

/**
 * /event-location — die Marktstraße 25 als kommende Event-Location.
 * Hero mit bewusst verschwommenem Bild („Bald buchbar"), drei Anlässe,
 * Coming-soon-Hinweis und funktionierende Anfrage über sendEventInquiry
 * (gleicher Resend-Mechanismus und Empfänger wie das Kontaktformular).
 */
export function EventLocationView() {
  const s = useStrings();
  const t = s.eventLocation.page;
  const href = useLocaleHref();
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFailed(false);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      dates: String(fd.get("dates") ?? ""),
      occasion: String(fd.get("occasion") ?? ""),
      guests: String(fd.get("guests") ?? ""),
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""),
    };
    startTransition(async () => {
      const res = await sendEventInquiry(payload);
      if (res.ok) {
        setSent(true);
        form.reset();
      } else {
        setFailed(true);
      }
    });
  };

  return (
    <>
      {/* ── Hero: verschwommenes Bild als bewusstes Statement ── */}
      <section className="relative flex min-h-[78vh] flex-col items-center justify-center overflow-hidden px-6 py-32 text-center text-cream-50">
        <Image
          src={IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover blur-[12px]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/50 to-night/85"
        />

        <div className="relative z-10 flex flex-col items-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-brass-300/60 bg-night/45 px-4 py-1.5 font-body text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brass-300 backdrop-blur-sm">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brass-300" />
            {t.badge}
          </span>
          <Type role="eyebrow" className="mt-8 text-cream-100/75">
            {t.eyebrow}
          </Type>
          <Type role="display" as="h1" className="mt-4 max-w-3xl text-cream-50">
            {t.title}
          </Type>
          <div className="mt-7 h-px w-14 bg-brass-400" />
          <Type role="lead" className="mt-7 max-w-2xl text-cream-100/90">
            {t.intro}
          </Type>
          <a
            href="#anfrage"
            className="mt-10 inline-flex items-center justify-center rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-brass-300"
          >
            {t.heroCta}
          </a>
        </div>
      </section>

      {/* ── Anlässe ── */}
      <section className="bg-cream-50 px-6 py-24 text-forest-900 md:py-32">
        <Reveal className="mx-auto max-w-5xl">
          <div className="text-center">
            <Type role="eyebrow" className="text-brass-600">
              {t.occasionsEyebrow}
            </Type>
            <Type role="display" as="h2" className="mt-5 text-forest-900">
              {t.occasionsTitle}
            </Type>
            <div className="mx-auto mt-7 h-px w-12 bg-brass-400" />
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {t.occasions.map((o, i) => (
              <Reveal
                key={o.title}
                delay={i * 120}
                className="rounded-[8px] border border-forest-900/10 bg-white/70 p-8 shadow-[0_20px_60px_-40px_rgba(15,24,19,0.5)]"
              >
                <span className="font-display text-2xl text-brass-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Type role="h3" as="h3" className="mt-4 text-forest-900">
                  {o.title}
                </Type>
                <Type role="body" className="mt-3 text-forest-700/85">
                  {o.text}
                </Type>
              </Reveal>
            ))}
          </div>

          {/* Coming-soon-Hinweis: Bilder & Preise folgen */}
          <Reveal className="mx-auto mt-14 max-w-3xl rounded-[8px] border border-brass-400/40 bg-cream-100 px-8 py-9 text-center">
            <Type role="h3" as="h3" className="text-forest-900">
              {t.comingSoon.title}
            </Type>
            <Type role="body" className="mx-auto mt-3 max-w-xl text-forest-700/85">
              {t.comingSoon.text}
            </Type>
          </Reveal>
        </Reveal>
      </section>

      {/* ── Anfrage-Formular ── */}
      <section id="anfrage" className="bg-cream-100 px-6 py-24 text-forest-900 md:py-32">
        <Reveal className="mx-auto max-w-xl">
          <div className="text-center">
            <Type role="eyebrow" className="text-brass-600">
              {t.form.eyebrow}
            </Type>
            <Type role="display" as="h2" className="mt-5 text-forest-900">
              {t.form.title}
            </Type>
            <div className="mx-auto mt-7 h-px w-12 bg-brass-400" />
            <Type role="lead" className="mx-auto mt-7 max-w-md text-forest-700/85">
              {t.form.text}
            </Type>
          </div>

          <div className="mt-11 rounded-[12px] border border-forest-900/10 bg-white/80 p-6 shadow-[0_24px_70px_-40px_rgba(15,24,19,0.55)] backdrop-blur-sm sm:p-9">
            {sent ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brass-400/60 text-brass-600">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M5 12.5l4.2 4.2L19 7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <Type role="h3" as="p" className="mt-5 text-forest-900">
                  {t.success.title}
                </Type>
                <Type role="body" className="mx-auto mt-3 max-w-sm text-forest-700/80">
                  {t.success.text}
                </Type>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                {/* Honeypot — für Menschen unsichtbar */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Firma
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <div>
                  <Type role="label" as="label" className="mb-2 block text-forest-800">
                    {t.form.name}
                  </Type>
                  <input
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder={t.form.namePlaceholder}
                    className={inputBase}
                  />
                </div>

                <div>
                  <Type role="label" as="label" className="mb-2 block text-forest-800">
                    {t.form.email}
                  </Type>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={t.form.emailPlaceholder}
                    className={inputBase}
                  />
                </div>

                <div>
                  <Type role="label" as="label" className="mb-2 block text-forest-800">
                    {t.form.phone}
                    <span className="ml-2 font-normal normal-case tracking-normal text-forest-700/45">
                      {t.form.optional}
                    </span>
                  </Type>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder={t.form.phonePlaceholder}
                    className={inputBase}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Type role="label" as="label" className="mb-2 block text-forest-800">
                      {t.form.date}
                    </Type>
                    <input
                      name="dates"
                      type="text"
                      required
                      placeholder={t.form.datePlaceholder}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <Type role="label" as="label" className="mb-2 block text-forest-800">
                      {t.form.guests}
                    </Type>
                    <input
                      name="guests"
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder={t.form.guestsPlaceholder}
                      className={inputBase}
                    />
                  </div>
                </div>

                <div>
                  <Type role="label" as="label" className="mb-2 block text-forest-800">
                    {t.form.occasion}
                  </Type>
                  <input
                    name="occasion"
                    type="text"
                    required
                    placeholder={t.form.occasionPlaceholder}
                    className={inputBase}
                  />
                </div>

                <div>
                  <Type role="label" as="label" className="mb-2 block text-forest-800">
                    {t.form.message}
                    <span className="ml-2 font-normal normal-case tracking-normal text-forest-700/45">
                      {t.form.optional}
                    </span>
                  </Type>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder={t.form.messagePlaceholder}
                    className={`${inputBase} resize-none`}
                  />
                </div>

                {failed && (
                  <p className="rounded-[6px] border border-red-800/20 bg-red-50 px-4 py-3 font-body text-sm text-red-800">
                    {t.error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex w-full items-center justify-center rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? t.form.sending : t.form.submit}
                </button>

                <Type role="caption" className="text-center text-forest-700/55">
                  {s.contact.privacy}{" "}
                  <Link
                    href={href("/datenschutz")}
                    className="underline underline-offset-2 hover:text-brass-600"
                  >
                    {s.contact.privacyLink}
                  </Link>{" "}
                  {s.contact.privacyAfter}
                </Type>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
