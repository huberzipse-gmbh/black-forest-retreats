"use client";

/**
 * Gutschein-Kaufflow, Schritte 1–3 (Wert → Personalisieren → Vorschau) auf
 * dem Holz-Look der GiftVoucher-Sektion. „Zur Zahlung" legt die Bestellung
 * an (pending) und wechselt auf die Zahlungsseite.
 */
import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtEur, fmtNum } from "@/lib/i18n/format";
import { Type } from "@/components/ui/Type";
import { woodStyle } from "@/lib/theme/wood";
import { createGiftCardOrder } from "@/lib/giftcards/actions";
import {
  GIFT_MAX_CENTS,
  GIFT_MESSAGE_MAX,
  GIFT_MIN_CENTS,
  GIFT_PRESETS,
  type GiftElementIcon,
} from "@/lib/giftcards/types";
import { GiftCardPreview } from "./GiftCardPreview";

const ICONS: GiftElementIcon[] = ["hut", "uhr", "kirschtorte", "schinken"];

const input =
  "w-full rounded-[4px] border border-forest-900/20 bg-white px-4 py-3 font-body text-sm text-forest-900 outline-none transition-colors focus:border-forest-900";
const label = "mb-1.5 block font-body text-xs font-semibold text-forest-900";

type Step = 0 | 1 | 2;

export function GiftCardWizard() {
  const strings = useStrings();
  const t = strings.giftFlow;
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<Step>(0);
  const [preset, setPreset] = useState<number | null>(GIFT_PRESETS[0]);
  const [customEuro, setCustomEuro] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [message, setMessage] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [icon, setIcon] = useState<GiftElementIcon>("hut");
  const [error, setError] = useState<string | null>(null);

  const customCents = Math.round((parseFloat(customEuro.replace(",", ".")) || 0) * 100);
  const amountCents = preset ?? customCents;
  const amountValid = amountCents >= GIFT_MIN_CENTS && amountCents <= GIFT_MAX_CENTS;
  const personalizeValid =
    recipientName.trim().length >= 2 &&
    buyerName.trim().length >= 2 &&
    /.+@.+\..+/.test(buyerEmail.trim()) &&
    message.length <= GIFT_MESSAGE_MAX;

  const steps = [t.steps.amount, t.steps.personalize, t.steps.preview];
  const eur = (c: number) => fmtNum(fmtEur(c, locale), locale);

  const toPayment = () => {
    setError(null);
    startTransition(async () => {
      const res = await createGiftCardOrder({
        amountCents,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        recipientName: recipientName.trim(),
        message: message.trim(),
        elementIcon: icon,
      });
      if (!res.ok || !res.giftCardId) {
        setError(res.error === "invalid" ? t.errors.invalid : t.errors.generic);
        return;
      }
      router.push(`/gutschein/zahlung?gift=${res.giftCardId}`);
    });
  };

  return (
    <section className="relative overflow-hidden rounded-[10px] px-6 py-12 text-cream-50 md:px-12 md:py-16">
      <div aria-hidden className="absolute inset-0" style={woodStyle} />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-night/55 via-night/35 to-night/65" />

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Kopf */}
        <div className="text-center">
          <Type role="eyebrow" className="text-brass-300">
            {t.hero.eyebrow}
          </Type>
          <Type role="h1" as="h1" className="mt-3 text-cream-50">
            {t.hero.title}
          </Type>
          <Type role="body" className="mx-auto mt-3 max-w-md text-cream-100/85">
            {t.hero.intro}
          </Type>
        </div>

        {/* Schritt-Anzeige */}
        <ol className="mt-8 flex items-center justify-center gap-2 sm:gap-3">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2 sm:gap-3">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-body text-[0.65rem] font-bold ${
                  i <= step ? "bg-brass-400 text-night" : "border border-cream-100/30 text-cream-100/50"
                }`}
              >
                {fmtNum(String(i + 1), locale)}
              </span>
              {/* Auf schmalen Screens nur Nummern — Labels würden umbrechen. */}
              <span
                className={`hidden font-body text-[0.65rem] font-semibold uppercase tracking-[0.14em] sm:inline ${
                  i <= step ? "text-cream-50" : "text-cream-100/45"
                }`}
              >
                {s}
              </span>
              {i < steps.length - 1 && <span className="h-px w-4 bg-cream-100/25 sm:w-8" />}
            </li>
          ))}
        </ol>

        {/* Schritt 1: Wert */}
        {step === 0 && (
          <div className="mt-8">
            <Type role="h3" as="h2" className="text-center text-cream-50">
              {t.amount.title}
            </Type>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {GIFT_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPreset(p);
                    setCustomEuro("");
                  }}
                  className={`rounded-[8px] border px-4 py-6 text-center transition-colors ${
                    preset === p
                      ? "border-brass-400 bg-night/40"
                      : "border-cream-100/25 bg-night/20 hover:border-cream-100/50"
                  }`}
                >
                  <div className="font-display text-3xl text-cream-50">{eur(p)}</div>
                  <div className="mt-1.5 font-body text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-brass-300">
                    {t.card.eyebrow}
                  </div>
                </button>
              ))}
              <div
                className={`rounded-[8px] border px-4 py-5 text-center transition-colors ${
                  preset === null
                    ? "border-brass-400 bg-night/40"
                    : "border-cream-100/25 bg-night/20 hover:border-cream-100/50"
                }`}
              >
                <label className="block font-body text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-brass-300">
                  {t.amount.custom}
                </label>
                <div className="mt-2 flex items-baseline justify-center gap-1.5">
                  <input
                    inputMode="decimal"
                    placeholder={t.amount.customPlaceholder}
                    value={customEuro}
                    onFocus={() => setPreset(null)}
                    onChange={(e) => {
                      setPreset(null);
                      setCustomEuro(e.target.value);
                    }}
                    className="w-20 border-b border-cream-100/40 bg-transparent text-center font-display text-2xl text-cream-50 outline-none placeholder:text-cream-100/30 focus:border-brass-400"
                  />
                  <span className="font-display text-xl text-cream-100/80">€</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center font-body text-xs text-cream-100/65">
              {fmtNum(t.amount.customHint(fmtEur(GIFT_MIN_CENTS, locale), fmtEur(GIFT_MAX_CENTS, locale)), locale)}
            </p>
          </div>
        )}

        {/* Schritt 2: Personalisieren */}
        {step === 1 && (
          <div className="mt-8 rounded-[8px] bg-cream-50 p-6 md:p-8">
            <Type role="h3" as="h2" className="text-forest-900">
              {t.personalize.title}
            </Type>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>{t.personalize.forLabel}</label>
                <input className={input} value={recipientName} placeholder={t.personalize.forPlaceholder} onChange={(e) => setRecipientName(e.target.value)} />
              </div>
              <div>
                <label className={label}>{t.personalize.fromLabel}</label>
                <input className={input} value={buyerName} placeholder={t.personalize.fromPlaceholder} onChange={(e) => setBuyerName(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>{t.personalize.messageLabel}</label>
                <textarea
                  className={`${input} min-h-20`}
                  value={message}
                  maxLength={GIFT_MESSAGE_MAX}
                  placeholder={t.personalize.messagePlaceholder}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="mt-1 text-end font-body text-[0.65rem] text-forest-700/50">
                  {fmtNum(`${message.length} / ${GIFT_MESSAGE_MAX}`, locale)}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className={label}>{t.personalize.emailLabel}</label>
                <input className={input} type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} />
                <p className="mt-1.5 font-body text-xs text-forest-700/60">{t.personalize.emailHint}</p>
              </div>
              <div className="sm:col-span-2">
                <label className={label}>{t.personalize.iconLabel}</label>
                <div className="flex gap-3">
                  {ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      title={t.personalize.icons[ic]}
                      onClick={() => setIcon(ic)}
                      className={`relative h-14 w-14 overflow-hidden rounded-full border-2 transition-colors ${
                        icon === ic ? "border-brass-600" : "border-forest-900/15 hover:border-forest-900/40"
                      }`}
                    >
                      <Image src={`/images/giftcard/${ic}.png`} alt={t.personalize.icons[ic]} fill sizes="56px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schritt 3: Vorschau */}
        {step === 2 && (
          <div className="mt-8">
            <Type role="h3" as="h2" className="text-center text-cream-50">
              {t.preview.title}
            </Type>
            <div className="mt-5">
              <GiftCardPreview
                amountCents={amountCents}
                recipientName={recipientName.trim()}
                buyerName={buyerName.trim()}
                message={message.trim()}
                elementIcon={icon}
                code={null}
                expiresAt={null}
              />
            </div>
            <p className="mt-4 text-center font-body text-xs text-cream-100/65">{t.preview.note}</p>
          </div>
        )}

        {error && (
          <p className="mt-5 text-center font-body text-sm text-red-300">{error}</p>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="rounded-[3px] border border-cream-100/40 px-6 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cream-50 transition-colors hover:border-cream-100"
            >
              {t.cta.back}
            </button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <button
              type="button"
              disabled={step === 0 ? !amountValid : !personalizeValid}
              onClick={() => setStep((s) => (s + 1) as Step)}
              className="rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.cta.next}
            </button>
          ) : (
            <button
              type="button"
              disabled={isPending || !amountValid || !personalizeValid}
              onClick={toPayment}
              className="rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.cta.toPayment}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
