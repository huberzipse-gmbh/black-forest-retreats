"use client";

/**
 * Preis-Bearbeitung im Belegungskalender (Airbnb-Modell):
 *  - PriceRangePanel: für einen im Monatsraster ausgewählten Tag/Zeitraum
 *    einen festen Nachtpreis ODER einen prozentualen Rabatt speichern,
 *    mit Vorschau des resultierenden Nachtpreises.
 *  - PriceRuleList: kompakte Liste der aktiven Preisregeln (Zeitraum, Regel,
 *    Löschen) unter dem Kalender.
 *
 * Gespeichert wird in price_rules (Migration 0001/0017) über die bestehenden
 * Admin-Actions upsertPriceRule/deletePriceRule — dieselbe Tabelle liest
 * computeQuote (lib/booking/pricing.ts), dadurch wirken die Regeln automatisch
 * auf Angebot, Checkout, Stripe-Betrag und Rechnung. Reihenfolge dort:
 * Preisregel verändert den Nachtpreis VOR Rabattcode und Gutschein.
 */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePriceRule, upsertPriceRule } from "@/app/admin/actions";
import { dateDe, eur } from "@/lib/admin/format";

/** Preisregel, wie der Kalender sie braucht (Spiegel von price_rules). */
export interface CalendarPriceRule {
  id: string;
  retreatId: string;
  name: string;
  startDate: string | null; // null = ab sofort
  endDate: string | null;   // null = unbefristet; INKLUSIV
  nightlyPriceCents: number | null;
  discountAmountCents: number | null;
  discountPercent: number | null;
  active: boolean;
  createdAt: string;
}

/** Gilt die Regel an diesem Tag? (Spiegel von lib/booking/pricing.ts) */
export function ruleCoversDay(rule: CalendarPriceRule, day: string): boolean {
  if (!rule.active) return false;
  if (rule.startDate && day < rule.startDate) return false;
  if (rule.endDate && day > rule.endDate) return false;
  return true;
}

/**
 * Effektiver Nachtpreis eines Tages nach Preisregeln (ohne globale Aktion,
 * Rabattcode, Gutschein — exakt die Regel-Logik aus computeQuote/priceNight:
 * Preis-Override = zuletzt angelegte Regel gewinnt, dann Beträge, dann Prozente).
 */
export function nightPriceCents(day: string, baseCents: number, rules: CalendarPriceRule[]): number {
  const covering = rules.filter((r) => ruleCoversDay(r, day));
  const override = covering
    .filter((r) => r.nightlyPriceCents != null)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
  let effective = override?.nightlyPriceCents ?? baseCents;
  for (const r of covering.filter((x) => x.discountAmountCents)) {
    effective = Math.max(0, effective - r.discountAmountCents!);
  }
  for (const r of covering.filter((x) => !x.discountAmountCents && x.discountPercent)) {
    effective = Math.max(0, effective - Math.round((effective * r.discountPercent!) / 100));
  }
  return effective;
}

/** Kurzbeschreibung einer Regel für die Liste („180 € / Nacht", „−15 %"). */
export function ruleLabel(r: CalendarPriceRule): string {
  const parts: string[] = [];
  if (r.nightlyPriceCents != null) parts.push(`${eur(r.nightlyPriceCents)} / Nacht`);
  if (r.discountAmountCents) parts.push(`−${eur(r.discountAmountCents)} / Nacht`);
  if (r.discountPercent) parts.push(`−${String(r.discountPercent).replace(".", ",")} %`);
  return parts.join(" · ") || "—";
}

const rangeLabel = (start: string | null, end: string | null) =>
  `${start ? dateDe(start) : "ab sofort"} – ${end ? dateDe(end) : "unbefristet"}`;

/* ────────────────── Panel: Preis für ausgewählten Zeitraum ────────────────── */

interface PanelProps {
  retreat: { id: string; name: string; basePriceCents: number };
  /** Aktive Regeln dieser Wohnung (für Vorschau + „Entfernen"). */
  rules: CalendarPriceRule[];
  /** Ausgewählter Zeitraum, ISO, INKLUSIV (eine Nacht = start === end). */
  rangeStart: string;
  rangeEnd: string;
  onClose: () => void;
}

export function PriceRangePanel({ retreat, rules, rangeStart, rangeEnd, onClose }: PanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<"price" | "percent">("price");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const nights =
    Math.round((new Date(rangeEnd).getTime() - new Date(rangeStart).getTime()) / 86400000) + 1;

  const parsed = Number(value.replace(",", "."));
  const valid = value.trim() !== "" && Number.isFinite(parsed) && parsed >= 0 &&
    (mode === "percent" ? parsed <= 100 : parsed <= 100000);

  // Vorschau des resultierenden Nachtpreises (auf Basis des Basispreises).
  const previewCents =
    mode === "price"
      ? Math.round(parsed * 100)
      : Math.round(retreat.basePriceCents * (1 - parsed / 100));

  // Bestehende Kalender-Regeln, die komplett im gewählten Zeitraum liegen
  // (nur die sind gefahrlos per „Entfernen" löschbar — Saisonregeln bleiben).
  const removable = rules.filter(
    (r) => r.startDate && r.endDate && r.startDate >= rangeStart && r.endDate <= rangeEnd,
  );

  const save = () => {
    if (!valid) {
      setError(mode === "percent" ? "Bitte einen Rabatt zwischen 0 und 100 % angeben." : "Bitte einen gültigen Preis angeben.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await upsertPriceRule({
        id: null,
        retreatId: retreat.id,
        name:
          mode === "price"
            ? `Kalenderpreis ${dateDe(rangeStart)}–${dateDe(rangeEnd)}`
            : `Kalenderrabatt ${dateDe(rangeStart)}–${dateDe(rangeEnd)}`,
        startDate: rangeStart,
        endDate: rangeEnd,
        nightlyPriceCents: mode === "price" ? Math.round(parsed * 100) : null,
        discountAmountCents: null,
        discountPercent: mode === "percent" ? parsed : null,
        active: true,
      });
      if (!res.ok) {
        setError(res.error ?? "Speichern fehlgeschlagen.");
        return;
      }
      onClose();
      router.refresh();
    });
  };

  const removeInRange = () => {
    setError(null);
    startTransition(async () => {
      for (const r of removable) await deletePriceRule(r.id);
      onClose();
      router.refresh();
    });
  };

  return (
    /* Mobil als Bottom-Sheet (fixiert, scrollbar), ab md als Inline-Panel unter dem Kalender. */
    <div className="fixed inset-x-0 bottom-0 z-40 max-h-[75svh] overflow-y-auto rounded-t-[12px] border-t border-brass-600/40 bg-cream-100 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-18px_50px_-18px_rgba(15,24,19,0.45)] md:static md:z-auto md:mt-4 md:max-h-none md:overflow-visible md:rounded-[6px] md:border md:border-brass-600/30 md:bg-cream-100/60 md:py-4 md:shadow-none">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-body text-sm font-bold text-forest-900">Preis bearbeiten</span>
        <span className="font-body text-sm text-forest-700/80">
          {retreat.name} · {dateDe(rangeStart)} – {dateDe(rangeEnd)} · {nights} {nights === 1 ? "Nacht" : "Nächte"}
        </span>
      </div>

      {/* Modus: fester Preis ODER Rabatt */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(
          [
            ["price", "Fester Preis / Nacht"],
            ["percent", "Rabatt in %"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`rounded-full px-3 py-1.5 font-body text-xs font-semibold transition-colors ${
              mode === m
                ? "bg-forest-900 text-cream-50"
                : "border border-forest-900/15 text-forest-900 hover:border-forest-900/40"
            }`}
          >
            {label}
          </button>
        ))}
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={mode === "price" ? (retreat.basePriceCents / 100).toString() : "10"}
            aria-label={mode === "price" ? "Preis pro Nacht in Euro" : "Rabatt in Prozent"}
            className="w-24 rounded-[4px] border border-forest-900/20 bg-white px-3 py-1.5 font-body text-sm text-forest-900 outline-none focus:border-forest-900"
          />
          <span className="font-body text-sm text-forest-700/80">{mode === "price" ? "€" : "%"}</span>
        </div>
      </div>

      {/* Vorschau */}
      <p className="mt-3 font-body text-xs text-forest-700/80">
        Basispreis {eur(retreat.basePriceCents)} / Nacht
        {valid && (
          <>
            {" "}→ <span className="font-semibold text-forest-900">{eur(Math.max(0, previewCents))} / Nacht</span>
            {mode === "percent" && " (Rabatt wirkt zusätzlich auf evtl. Preis-Overrides im Zeitraum)"}
          </>
        )}
        {" "}· wirkt auf neue Buchungen, vor Rabattcode/Gutschein.
      </p>

      {error && <p className="mt-2 font-body text-xs font-semibold text-red-800">{error}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-[3px] bg-forest-900 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-cream-50 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Speichert …" : "Speichern"}
        </button>
        {removable.length > 0 && (
          <button
            type="button"
            onClick={removeInRange}
            disabled={pending}
            className="rounded-[3px] border border-red-800/30 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-red-900 transition-colors hover:border-red-800 disabled:opacity-50"
          >
            {removable.length === 1 ? "Preisregel im Zeitraum entfernen" : `${removable.length} Preisregeln im Zeitraum entfernen`}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="rounded-[3px] border border-forest-900/25 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-forest-900 transition-colors hover:border-forest-900 disabled:opacity-50"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}

/* ────────────────── Liste der aktiven Preisregeln ────────────────── */

interface ListProps {
  /** Aktive Regeln (bei „Alle Wohnungen" alle, sonst die der Wohnung). */
  rules: CalendarPriceRule[];
  /** Wohnungsname je ID (für die „Alle"-Ansicht). */
  retreatNames: Record<string, string>;
  /** Wohnungsnamen anzeigen? (nur in der „Alle"-Ansicht) */
  showRetreat: boolean;
}

export function PriceRuleList({ rules, retreatNames, showRetreat }: ListProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState<string | null>(null);

  if (rules.length === 0) return null;

  const remove = (id: string) => {
    setDeleting(id);
    startTransition(async () => {
      await deletePriceRule(id);
      setDeleting(null);
      router.refresh();
    });
  };

  const sorted = [...rules].sort((a, b) =>
    (a.startDate ?? "0000") < (b.startDate ?? "0000") ? -1 : 1,
  );

  return (
    <div className="mt-6">
      <h3 className="font-body text-xs font-semibold uppercase tracking-wider text-forest-700/60">
        Aktive Preisregeln
      </h3>
      <ul className="mt-2 divide-y divide-forest-900/5 rounded-[6px] border border-forest-900/10 bg-white">
        {sorted.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 font-body text-sm text-forest-900">
            {showRetreat && (
              <span className="font-semibold">{retreatNames[r.retreatId] ?? r.retreatId}</span>
            )}
            <span className="text-forest-700/80">{rangeLabel(r.startDate, r.endDate)}</span>
            <span className="font-semibold text-brass-600">{ruleLabel(r)}</span>
            <span className="truncate text-xs text-forest-700/50">{r.name}</span>
            <button
              type="button"
              onClick={() => remove(r.id)}
              disabled={pending}
              className="ms-auto rounded-[3px] border border-forest-900/20 px-3 py-1 font-body text-xs font-semibold text-forest-900 transition-colors hover:border-red-800 hover:text-red-900 disabled:opacity-50"
            >
              {deleting === r.id ? "Löscht …" : "Löschen"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
