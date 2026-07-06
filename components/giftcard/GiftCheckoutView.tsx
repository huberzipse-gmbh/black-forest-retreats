"use client";

/**
 * Gutschein-Zahlung (Schritt 4): Stripe Payment Element bzw. Demo-Zahlfläche —
 * Adaption von CheckoutView, geteiltes StripePayment.
 */
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useStrings } from "@/lib/i18n/I18nProvider";
import { fmtEur, fmtNum } from "@/lib/i18n/format";
import { confirmDemoGiftPayment, initiateGiftCardPayment } from "@/lib/giftcards/actions";
import { Type } from "@/components/ui/Type";
import { StripePayment } from "@/components/booking/StripePayment";

export interface GiftCheckoutData {
  id: string;
  amountCents: number;
  recipientName: string;
  downloadToken: string;
}

interface Props {
  gift: GiftCheckoutData;
  publishableKey: string | null;
}

export function GiftCheckoutView({ gift, publishableKey }: Props) {
  const strings = useStrings();
  const t = strings.giftFlow;
  const tb = strings.bookingFlow;
  const locale = useLocale();

  const [mode, setMode] = useState<"stripe" | "demo" | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const initiated = useRef(false);

  const successPath = `/gutschein/erfolg?gift=${gift.id}&token=${gift.downloadToken}`;

  useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;
    initiateGiftCardPayment(gift.id).then((res) => {
      if (!res.ok || !res.clientSecret || !res.mode) {
        setError(t.errors.generic);
        return;
      }
      setMode(res.mode);
      setClientSecret(res.clientSecret);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gift.id]);

  return (
    <div className="mx-auto max-w-2xl">
      <Type role="h1" as="h1" className="text-forest-900">
        {t.payment.title}
      </Type>

      {/* Zusammenfassung */}
      <div className="mt-8 rounded-[8px] border border-forest-900/10 bg-white p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/60">
              {t.payment.summaryLabel}
            </div>
            <div className="mt-1 font-display text-lg text-forest-900">{gift.recipientName}</div>
          </div>
          <div className="text-end">
            <div className="font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/60">
              {t.payment.valueLabel}
            </div>
            <div className="mt-1 font-body text-base font-bold text-forest-900">
              {fmtNum(fmtEur(gift.amountCents, locale), locale)}
            </div>
          </div>
        </div>
      </div>

      {/* Zahlfläche */}
      <div className="mt-6 rounded-[8px] border border-forest-900/10 bg-white p-6">
        <Type role="h3" as="h2" className="text-forest-900">
          {tb.payment.methodsTitle}
        </Type>

        {error && (
          <div className="mt-4 rounded-[6px] border border-red-800/25 bg-red-50 px-4 py-3 font-body text-sm text-red-900">
            {error}
          </div>
        )}

        {!mode && !error && (
          <p className="mt-4 font-body text-sm text-forest-700/70">{tb.payment.processing}</p>
        )}

        {mode === "demo" && (
          <DemoGiftPaymentForm
            giftCardId={gift.id}
            successPath={successPath}
            onError={() => setError(tb.errors.paymentFailed)}
          />
        )}

        {mode === "stripe" && clientSecret && publishableKey && (
          <StripePayment
            publishableKey={publishableKey}
            clientSecret={clientSecret}
            intentType="payment"
            returnPath={successPath}
            onError={(msg) => setError(msg || tb.errors.paymentFailed)}
          />
        )}

        <p className="mt-5 font-body text-xs text-forest-700/55">{tb.payment.securityNote}</p>
      </div>
    </div>
  );
}

function DemoGiftPaymentForm({
  giftCardId,
  successPath,
  onError,
}: {
  giftCardId: string;
  successPath: string;
  onError: () => void;
}) {
  const t = useStrings().bookingFlow;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const fakeInput =
    "w-full cursor-not-allowed rounded-[4px] border border-forest-900/15 bg-cream-100/60 px-4 py-3 font-body text-sm text-forest-700/40";

  const pay = () => {
    startTransition(async () => {
      const res = await confirmDemoGiftPayment(giftCardId);
      if (!res.ok) {
        onError();
        return;
      }
      router.push(successPath);
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
