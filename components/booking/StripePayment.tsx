"use client";

/**
 * Wiederverwendbares Stripe Payment Element (Buchung UND Gutschein):
 * Elements-Provider in Markenoptik + Bestätigungs-Button. Nach erfolgreicher
 * Bestätigung leitet Stripe zur übergebenen return_url weiter.
 */
import { useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useStrings } from "@/lib/i18n/I18nProvider";

let stripePromise: Promise<Stripe | null> | null = null;

export function StripePayment({
  publishableKey,
  clientSecret,
  intentType,
  returnPath,
  onError,
}: {
  publishableKey: string;
  clientSecret: string;
  intentType: "payment" | "setup";
  /** Pfad relativ zur Origin, z. B. `/buchung/BF-XXXXXX`. */
  returnPath: string;
  onError: (msg?: string) => void;
}) {
  if (!stripePromise) stripePromise = loadStripe(publishableKey);
  return (
    <div className="mt-4">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            variables: {
              colorPrimary: "#1b2a21",
              colorText: "#1b2a21",
              borderRadius: "4px",
            },
          },
        }}
      >
        <StripeForm intentType={intentType} returnPath={returnPath} onError={onError} />
      </Elements>
    </div>
  );
}

function StripeForm({
  intentType,
  returnPath,
  onError,
}: {
  intentType: "payment" | "setup";
  returnPath: string;
  onError: (msg?: string) => void;
}) {
  const t = useStrings().bookingFlow;
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (!stripe || !elements) return;
    setBusy(true);
    const returnUrl = `${window.location.origin}${returnPath}`;
    const result =
      intentType === "setup"
        ? await stripe.confirmSetup({ elements, confirmParams: { return_url: returnUrl } })
        : await stripe.confirmPayment({ elements, confirmParams: { return_url: returnUrl } });
    if (result.error) {
      onError(result.error.message);
      setBusy(false);
    }
    // Ohne Fehler leitet Stripe zur return_url weiter.
  };

  return (
    <div>
      <PaymentElement />
      <button
        type="button"
        onClick={confirm}
        disabled={busy || !stripe}
        className="mt-5 w-full rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-brass-300 disabled:opacity-50"
      >
        {busy ? t.payment.processing : t.cta.confirmPay}
      </button>
    </div>
  );
}
