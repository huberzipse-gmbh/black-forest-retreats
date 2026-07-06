"use client";

/**
 * Schritt 3: Zahlung. Im Stripe-Modus rendert das Payment Element (Karte,
 * Klarna, PayPal, Apple Pay je nach Dashboard-Konfiguration); im Demo-Modus
 * eine gestylte Demo-Zahlfläche, deren Bestätigung dieselbe Server-Pipeline
 * durchläuft wie der echte Webhook.
 */
import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtDate, fmtEur, fmtNum } from "@/lib/i18n/format";
import { confirmDemoPayment, initiatePayment } from "@/lib/booking/actions";
import { Type } from "@/components/ui/Type";
import { StripePayment } from "./StripePayment";

export interface CheckoutBooking {
  id: string;
  bookingNumber: string;
  retreatName: string;
  retreatImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalCents: number;
  paymentTiming: "now" | "later";
  chargeDueDate: string | null;
}

interface Props {
  booking: CheckoutBooking;
  publishableKey: string | null;
}

export function CheckoutView({ booking, publishableKey }: Props) {
  const t = useStrings().bookingFlow;
  const locale = useLocale();
  const router = useRouter();

  const [mode, setMode] = useState<"stripe" | "demo" | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentType, setIntentType] = useState<"payment" | "setup">("payment");
  const [error, setError] = useState<string | null>(null);
  const initiated = useRef(false);

  useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;
    initiatePayment(booking.id).then((res) => {
      // Gutschein deckt alles → Buchung ist bereits bestätigt, direkt weiter.
      if (res.ok && res.mode === "free") {
        router.push(`/buchung/${booking.bookingNumber}`);
        return;
      }
      if (!res.ok || !res.clientSecret || !res.mode || res.mode === "free") {
        setError(t.errors.generic);
        return;
      }
      setMode(res.mode);
      setClientSecret(res.clientSecret);
      setIntentType(res.intentType ?? "payment");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.id]);

  return (
    <div className="mx-auto max-w-2xl">
      <Type role="h1" as="h1" className="text-forest-900">
        {t.payment.title}
      </Type>

      {/* Zusammenfassung */}
      <div className="mt-8 rounded-[8px] border border-forest-900/10 bg-white p-6">
        <div className="flex items-center gap-4">
          {booking.retreatImage && (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[6px]">
              <Image src={booking.retreatImage} alt={booking.retreatName} fill sizes="56px" className="object-cover" />
            </div>
          )}
          <div>
            <div className="font-display text-lg text-forest-900">{booking.retreatName}</div>
            <div className="font-body text-xs text-forest-700/60">
              {fmtNum(`${fmtDate(booking.checkIn, locale)} → ${fmtDate(booking.checkOut, locale)}`, locale)} ·{" "}
              {fmtNum(t.guests.summary(booking.guests), locale)}
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-baseline justify-between border-t border-forest-900/10 pt-5">
          <span className="font-body text-sm font-bold text-forest-900">{t.price.total}</span>
          <span className="font-body text-base font-bold text-forest-900">
            {fmtNum(fmtEur(booking.totalCents, locale), locale)}
          </span>
        </div>
        <div className="mt-4 rounded-[6px] bg-cream-100 px-4 py-3">
          <div className="font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/60">
            {t.payment.whenYouPay}
          </div>
          <div className="mt-1 font-body text-sm text-forest-900">
            {booking.paymentTiming === "later" && booking.chargeDueDate
              ? fmtNum(t.payment.payLaterSummary(fmtDate(booking.chargeDueDate, locale)), locale)
              : t.payment.payNowSummary}
          </div>
        </div>
      </div>

      {/* Zahlfläche */}
      <div className="mt-6 rounded-[8px] border border-forest-900/10 bg-white p-6">
        <Type role="h3" as="h2" className="text-forest-900">
          {t.payment.methodsTitle}
        </Type>

        {error && (
          <div className="mt-4 rounded-[6px] border border-red-800/25 bg-red-50 px-4 py-3 font-body text-sm text-red-900">
            {error}
          </div>
        )}

        {!mode && !error && (
          <p className="mt-4 font-body text-sm text-forest-700/70">{t.payment.processing}</p>
        )}

        {mode === "demo" && (
          <DemoPaymentForm booking={booking} onError={() => setError(t.errors.paymentFailed)} />
        )}

        {mode === "stripe" && clientSecret && publishableKey && (
          <StripePayment
            publishableKey={publishableKey}
            clientSecret={clientSecret}
            intentType={intentType}
            returnPath={`/buchung/${booking.bookingNumber}`}
            onError={(msg) => setError(msg || t.errors.paymentFailed)}
          />
        )}

        <p className="mt-5 font-body text-xs text-forest-700/55">{t.payment.securityNote}</p>
      </div>
    </div>
  );
}

/* ── Demo-Zahlung ─────────────────────────────────────────────────────────── */

function DemoPaymentForm({
  booking,
  onError,
}: {
  booking: CheckoutBooking;
  onError: () => void;
}) {
  const t = useStrings().bookingFlow;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const fakeInput =
    "w-full cursor-not-allowed rounded-[4px] border border-forest-900/15 bg-cream-100/60 px-4 py-3 font-body text-sm text-forest-700/40";

  const pay = () => {
    startTransition(async () => {
      const res = await confirmDemoPayment(booking.id);
      if (!res.ok) {
        onError();
        return;
      }
      router.push(`/buchung/${booking.bookingNumber}`);
    });
  };

  return (
    <div className="mt-4">
      <div className="rounded-[6px] border border-brass-400/50 bg-brass-400/10 px-4 py-3 font-body text-xs font-semibold text-forest-900">
        {t.payment.demoBanner}
      </div>
      <div className="mt-4 space-y-3" aria-hidden>
        <input className={fakeInput} disabled placeholder="1234 5678 9012 3456" />
        <div className="grid grid-cols-2 gap-3">
          <input className={fakeInput} disabled placeholder="MM / JJ" />
          <input className={fakeInput} disabled placeholder="CVC" />
        </div>
      </div>
      <p className="mt-2 font-body text-xs text-forest-700/55">{t.payment.demoCardNote}</p>
      <button
        type="button"
        onClick={pay}
        disabled={isPending}
        className="mt-5 w-full rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-brass-300 disabled:opacity-50"
      >
        {isPending ? t.payment.processing : t.payment.demoButton}
      </button>
    </div>
  );
}

/* Stripe Payment Element: siehe StripePayment.tsx (geteilt mit Gutschein-Kauf). */
