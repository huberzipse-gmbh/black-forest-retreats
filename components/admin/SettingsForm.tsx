"use client";

/**
 * Allgemeine Einstellungen: Buchungsregeln, globale Rabattaktion und die
 * Rechnungsaussteller-Daten (Impressum-Basis; Telefon/USt-IdNr hier pflegen).
 */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSettings, type SettingsFormData } from "@/app/admin/actions";

const input =
  "w-full rounded-[4px] border border-forest-900/20 bg-white px-3.5 py-2.5 font-body text-sm text-forest-900 outline-none transition-colors focus:border-forest-900";
const card = "rounded-[8px] border border-forest-900/10 bg-white p-5 md:p-6";

/**
 * Ein Formularfeld. Label und Eingabefeld sitzen in einer Spalte, das Label
 * darf wachsen — dadurch stehen die Eingabefelder einer Grid-Reihe auf einer
 * Linie, auch wenn ein Label zweizeilig umbricht (vorher rutschte z. B. das
 * MwSt-Feld gegenüber der Stornofrist nach oben). Die Einheit steht als Hinweis
 * unter dem Feld statt in Klammern im Label.
 */
function Field({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="mb-1.5 flex-1 font-body text-xs font-semibold leading-snug text-forest-900">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 font-body text-xs text-forest-700/55">{hint}</span>}
    </div>
  );
}

/** Kartenkopf: gleiche Typo und gleicher Abstand auf allen vier Blöcken. */
function CardHead({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
        {title}
      </h2>
      {note && <p className="mt-2 max-w-prose font-body text-xs leading-relaxed text-forest-700/55">{note}</p>}
    </div>
  );
}

/** Checkbox-Zeile unter einem Block. */
function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-5 flex cursor-pointer items-center gap-2.5 font-body text-sm text-forest-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-forest-900"
      />
      {children}
    </label>
  );
}

export function SettingsForm({ initial }: { initial: SettingsFormData }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (patch: Partial<SettingsFormData>) => setForm((f) => ({ ...f, ...patch }));
  const num = (v: string) => parseFloat(v.replace(",", ".")) || 0;

  const save = () => {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const res = await saveSettings(form);
      if (!res.ok) setError(res.error ?? "Speichern fehlgeschlagen.");
      else {
        setMessage("Gespeichert. Gilt sofort für neue Buchungen.");
        router.refresh();
      }
    });
  };

  return (
    <div className="mt-6 space-y-5">
      {/* Buchungsregeln */}
      <div className={card}>
        <CardHead title="Buchungsregeln" />
        <div className="grid grid-cols-2 items-start gap-x-5 gap-y-5 md:grid-cols-4">
          <Field label="Kostenlose Stornierung" hint="Tage vor Anreise">
            <input className={input} inputMode="numeric" value={String(form.cancellation_days)} onChange={(e) => set({ cancellation_days: parseInt(e.target.value || "0", 10) })} />
          </Field>
          <Field label="MwSt-Satz" hint="Prozent">
            <input className={input} inputMode="decimal" value={String(form.vat_rate).replace(".", ",")} onChange={(e) => set({ vat_rate: num(e.target.value) })} />
          </Field>
          <Field label="Rabatt registrierte Gäste" hint="Prozent">
            <input className={input} inputMode="decimal" value={String(form.registered_discount_percent).replace(".", ",")} onChange={(e) => set({ registered_discount_percent: num(e.target.value) })} />
          </Field>
          <Field label="Abbuchung bei „Später zahlen“" hint="Tage vor Anreise">
            <input className={input} inputMode="numeric" value={String(form.pay_later_window_days)} onChange={(e) => set({ pay_later_window_days: parseInt(e.target.value || "1", 10) })} />
          </Field>
        </div>
      </div>

      {/* Globale Rabattaktion */}
      <div className={card}>
        <CardHead
          title="Globale Rabattaktion"
          note="Gilt für alle Wohnungen. Entweder ein fester Betrag pro Nacht oder ein Prozentsatz."
        />
        <div className="grid grid-cols-1 items-start gap-x-5 gap-y-5 md:grid-cols-4">
          <Field label="Name (erscheint beim Gast)" className="md:col-span-2">
            <input className={input} value={form.global_discount_name} onChange={(e) => set({ global_discount_name: e.target.value })} placeholder="z. B. Sommeraktion" />
          </Field>
          <Field label="Rabatt pro Nacht" hint="Euro">
            <input
              className={input}
              inputMode="decimal"
              value={form.global_discount_amount_cents != null ? String(form.global_discount_amount_cents / 100) : ""}
              onChange={(e) =>
                set({
                  global_discount_amount_cents:
                    e.target.value.trim() === "" ? null : Math.round(num(e.target.value) * 100),
                })
              }
            />
          </Field>
          <Field label="Rabatt" hint="Prozent">
            <input
              className={input}
              inputMode="decimal"
              value={form.global_discount_percent != null ? String(form.global_discount_percent).replace(".", ",") : ""}
              onChange={(e) =>
                set({ global_discount_percent: e.target.value.trim() === "" ? null : num(e.target.value) })
              }
            />
          </Field>
        </div>
        <Toggle checked={form.global_discount_active} onChange={(v) => set({ global_discount_active: v })}>
          Aktion ist aktiv
        </Toggle>
      </div>

      {/* Rabattcode (Aufsteller/QR) */}
      <div className={card}>
        <CardHead
          title="Rabattcode (Pappaufsteller / QR)"
          note="Gäste lösen den Code per QR-Scan oder Eingabe im Buchungsflow ein. Der Rabatt gilt prozentual auf den Übernachtungspreis. QR-Link: blackforest-retreats.de/aktion/<Code>"
        />
        <div className="grid grid-cols-2 items-start gap-x-5 gap-y-5 md:grid-cols-4">
          <Field label="Code" className="col-span-2">
            <input
              className={`${input} uppercase`}
              value={form.promo_code}
              onChange={(e) => set({ promo_code: e.target.value.toUpperCase() })}
              placeholder="z. B. BFR10"
            />
          </Field>
          <Field label="Rabatt" hint="Prozent">
            <input
              className={input}
              inputMode="decimal"
              value={String(form.promo_percent).replace(".", ",")}
              onChange={(e) => set({ promo_percent: num(e.target.value) })}
            />
          </Field>
        </div>
        <Toggle checked={form.promo_active} onChange={(v) => set({ promo_active: v })}>
          Code ist aktiv
        </Toggle>
      </div>

      {/* Rechnungsaussteller */}
      <div className={card}>
        <CardHead
          title="Rechnungsaussteller (GoBD)"
          note="Diese Daten werden bei jeder Rechnung als Snapshot eingefroren. Änderungen wirken nur auf künftige Rechnungen."
        />
        <div className="grid grid-cols-1 items-start gap-x-5 gap-y-5 md:grid-cols-2">
          <Field label="Firma">
            <input className={input} value={form.issuer_name} onChange={(e) => set({ issuer_name: e.target.value })} />
          </Field>
          <Field label="Geschäftsführer">
            <input className={input} value={form.issuer_managing_director} onChange={(e) => set({ issuer_managing_director: e.target.value })} />
          </Field>
          <Field label="Anschrift" className="md:col-span-2">
            <textarea className={`${input} min-h-20`} value={form.issuer_address} onChange={(e) => set({ issuer_address: e.target.value })} />
          </Field>
          <Field label="Telefon">
            <input className={input} value={form.issuer_phone} onChange={(e) => set({ issuer_phone: e.target.value })} />
          </Field>
          <Field label="E-Mail">
            <input className={input} value={form.issuer_email} onChange={(e) => set({ issuer_email: e.target.value })} />
          </Field>
          <Field label="USt-IdNr.">
            <input className={input} value={form.issuer_vat_id} onChange={(e) => set({ issuer_vat_id: e.target.value })} placeholder="DE…" />
          </Field>
          <Field label="Registereintrag">
            <input className={input} value={form.issuer_register} onChange={(e) => set({ issuer_register: e.target.value })} />
          </Field>
        </div>
      </div>

      {/* Speicherleiste: Status und Button auf einer Linie, nicht gestapelt. */}
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="button"
          disabled={isPending}
          onClick={save}
          className="rounded-[4px] bg-forest-900 px-6 py-3 font-body text-xs font-semibold uppercase tracking-wider text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-40"
        >
          {isPending ? "Speichere …" : "Einstellungen speichern"}
        </button>
        {error && <p className="font-body text-sm text-red-800">{error}</p>}
        {message && <p className="font-body text-sm text-forest-700">{message}</p>}
      </div>
    </div>
  );
}
