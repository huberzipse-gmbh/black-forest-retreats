"use client";

/**
 * Gutschein manuell ausstellen (Geschenk, Kulanz, Gewinnspiel). Aufklappbar
 * über der Gutschein-Liste; legt eine sofort aktive Karte ohne Zahlung an.
 */
import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createGiftCardManually } from "@/app/admin/actions";
import { GIFT_MAX_CENTS, GIFT_MESSAGE_MAX, GIFT_MIN_CENTS, type GiftElementIcon } from "@/lib/giftcards/types";

const ICONS: { key: GiftElementIcon; label: string }[] = [
  { key: "hut", label: "Hut" },
  { key: "uhr", label: "Uhr" },
  { key: "kirschtorte", label: "Kirschtorte" },
  { key: "schinken", label: "Schinken" },
];

const input =
  "w-full rounded-[4px] border border-forest-900/20 bg-white px-3 py-2.5 font-body text-sm text-forest-900 outline-none transition-colors focus:border-forest-900";
const label = "mb-1.5 block font-body text-xs font-semibold text-forest-900";

export function GiftCardCreateForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [euro, setEuro] = useState("50");
  const [recipientName, setRecipientName] = useState("");
  const [buyerName, setBuyerName] = useState("Black Forest Retreats");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState<GiftElementIcon>("hut");
  const [sendMail, setSendMail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ code: string; emailSent: boolean } | null>(null);

  const amountCents = Math.round((parseFloat(euro.replace(",", ".")) || 0) * 100);
  const valid =
    amountCents >= GIFT_MIN_CENTS &&
    amountCents <= GIFT_MAX_CENTS &&
    recipientName.trim().length >= 2 &&
    buyerName.trim().length >= 2 &&
    (!sendMail || /.+@.+\..+/.test(buyerEmail.trim()));

  const submit = () => {
    setError(null);
    setDone(null);
    startTransition(async () => {
      const res = await createGiftCardManually({
        amountCents,
        recipientName: recipientName.trim(),
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        message: message.trim(),
        elementIcon: icon,
        sendEmail: sendMail,
      });
      if (!res.ok) {
        setError(res.error ?? "Ausstellen fehlgeschlagen.");
        return;
      }
      setDone({ code: res.code!, emailSent: Boolean(res.emailSent) });
      setRecipientName("");
      setMessage("");
      setBuyerEmail("");
      setSendMail(false);
      router.refresh();
    });
  };

  if (!open) {
    return (
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-[4px] bg-forest-900 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.14em] text-cream-50 transition-colors hover:bg-forest-700"
        >
          Gutschein ausstellen
        </button>
        {done && (
          <p className="mt-3 font-body text-sm text-forest-700">
            Gutschein <strong>{done.code}</strong> ist aktiv.{" "}
            {done.emailSent ? "E-Mail mit PDF wurde verschickt." : "PDF liegt in der Liste unten."}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-[8px] border border-forest-900/10 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-forest-900">Gutschein ausstellen</h2>
          <p className="mt-1 font-body text-sm text-forest-700/70">
            Für Geschenke, Kulanz oder Gewinnspiele. Sofort aktiv, 3 Jahre gültig, ohne Zahlung und
            ohne Rechnung.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60 hover:text-forest-900"
        >
          Schließen
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Wert (Euro)</label>
          <input
            inputMode="decimal"
            className={input}
            value={euro}
            onChange={(e) => setEuro(e.target.value)}
            placeholder="50"
          />
          <p className="mt-1 font-body text-xs text-forest-700/55">
            {(GIFT_MIN_CENTS / 100).toFixed(2).replace(".", ",")} € bis{" "}
            {(GIFT_MAX_CENTS / 100).toLocaleString("de-DE")} €
          </p>
        </div>
        <div>
          <label className={label}>Für (Empfänger)</label>
          <input
            className={input}
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Name auf dem Gutschein"
          />
        </div>
        <div>
          <label className={label}>Von (Aussteller)</label>
          <input className={input} value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
        </div>
        <div>
          <label className={label}>E-Mail (optional)</label>
          <input
            className={input}
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            placeholder="empfaenger@beispiel.de"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Nachricht (optional)</label>
          <textarea
            className={`${input} min-h-16`}
            value={message}
            maxLength={GIFT_MESSAGE_MAX}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Motiv</label>
          <div className="flex gap-3">
            {ICONS.map((ic) => (
              <button
                key={ic.key}
                type="button"
                title={ic.label}
                onClick={() => setIcon(ic.key)}
                className={`relative h-12 w-12 overflow-hidden rounded-full border-2 transition-colors ${
                  icon === ic.key ? "border-brass-600" : "border-forest-900/15 hover:border-forest-900/40"
                }`}
              >
                <Image src={`/images/giftcard/${ic.key}.png`} alt={ic.label} fill sizes="48px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 font-body text-sm text-forest-900">
            <input
              type="checkbox"
              checked={sendMail}
              onChange={(e) => setSendMail(e.target.checked)}
              className="h-4 w-4 accent-forest-900"
            />
            Gutschein-PDF per E-Mail verschicken
          </label>
        </div>
      </div>

      {error && <p className="mt-4 font-body text-sm text-red-800">{error}</p>}
      {done && (
        <p className="mt-4 font-body text-sm text-forest-700">
          Gutschein <strong>{done.code}</strong> ist aktiv.{" "}
          {done.emailSent ? "E-Mail mit PDF wurde verschickt." : "PDF liegt in der Liste unten."}
        </p>
      )}

      <button
        type="button"
        disabled={!valid || isPending}
        onClick={submit}
        className="mt-5 rounded-[4px] bg-brass-400 px-6 py-3 font-body text-xs font-semibold uppercase tracking-[0.14em] text-night transition-colors hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Wird ausgestellt …" : "Jetzt ausstellen"}
      </button>
    </div>
  );
}
