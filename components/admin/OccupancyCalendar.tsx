"use client";

/**
 * Belegungskalender fürs Admin-Dashboard (Herzstück).
 *
 * Monatsweise blätterbar, Filter „Alle Wohnungen" / einzelne Wohnung:
 *  - Alle Wohnungen → Channel-Manager-Ansicht: eine Zeile pro Wohnung,
 *    Nächte als farbige Balken (grün = Direktbuchung, rot = Airbnb,
 *    grau = manuell geblockt). Auf schmalen Viewports horizontal scrollbar,
 *    Wohnungsname bleibt links stehen.
 *  - Einzelne Wohnung → klassisches Monatsraster (Mo–So).
 * Klick auf eine Belegung öffnet die Detailleiste (Gast, Zeitraum, Quelle,
 * Wohnung); Direktbuchungen verlinken auf /admin/buchungen/[id].
 *
 * Preis-Bearbeitung (Airbnb-Modell): In der Einzelwohnungs-Ansicht sind Tage
 * anklickbar (1. Klick = Tag, 2. Klick = Zeitraum, auch über Monatsgrenzen);
 * das Panel darunter speichert einen festen Nachtpreis ODER einen %-Rabatt als
 * price_rule — dieselbe Tabelle liest computeQuote, dadurch wirken die Regeln
 * auf Angebot, Checkout, Stripe-Betrag und Rechnung. Jede Zelle zeigt den
 * effektiven Nachtpreis (brass = Preisregel aktiv); unter dem Kalender listet
 * PriceRuleList alle aktiven Regeln mit Löschen.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  startOfMonth,
  startOfToday,
} from "date-fns";
import { dateDe } from "@/lib/admin/format";
import {
  PriceRangePanel,
  PriceRuleList,
  nightPriceCents,
  ruleCoversDay,
  type CalendarPriceRule,
} from "@/components/admin/CalendarPricing";

export type { CalendarPriceRule };

const iso = (d: Date) => format(d, "yyyy-MM-dd");
const MONTH_FMT = new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" });
const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export type OccupancySource = "booking" | "airbnb-ical" | "manual";

export interface OccupancyRetreat {
  id: string;
  name: string;
  /** Basis-Nachtpreis in Cent (für Preisanzeige + Vorschau im Preis-Panel). */
  basePriceCents: number;
}

/** Eine Belegung (availability_block, bei Direktbuchungen mit Gast-Infos). */
export interface OccupancyEntry {
  id: string;
  retreatId: string;
  /** Erste Nacht (ISO). */
  start: string;
  /** Checkout-Tag (ISO, exklusiv). */
  end: string;
  source: OccupancySource;
  bookingId: string | null;
  guestName: string | null;
  bookingNumber: string | null;
  note: string;
  demo: boolean;
}

const SOURCE_LABEL: Record<OccupancySource, string> = {
  booking: "Direktbuchung",
  "airbnb-ical": "Airbnb",
  manual: "Manuell geblockt",
};

/** Balkenfarbe je Quelle: grün = eigene Direktbuchung, rot = Airbnb. */
const SOURCE_BAR: Record<OccupancySource, string> = {
  booking: "bg-forest-500",
  "airbnb-ical": "bg-rose-400",
  manual: "bg-forest-900/25",
};

/** Legenden-Punkt je Quelle. */
const SOURCE_DOT: Record<OccupancySource, string> = {
  booking: "bg-forest-500",
  "airbnb-ical": "bg-rose-400",
  manual: "bg-forest-900/25",
};

const nightsOf = (e: OccupancyEntry) =>
  Math.max(1, Math.round((new Date(e.end).getTime() - new Date(e.start).getTime()) / 86400000));

const entryTitle = (e: OccupancyEntry) =>
  `${SOURCE_LABEL[e.source]}${e.guestName ? ` · ${e.guestName}` : ""} · ${dateDe(e.start)} → ${dateDe(e.end)}`;

/* ────────────────────────── Tag-Zellen ────────────────────────── */

/**
 * Gemeinsame Schnittstelle beider Tag-Zellen. Bewusst schmal gehalten,
 * damit spätere Erweiterungen (z. B. Tagespreis anzeigen/bearbeiten) nur
 * hier andocken müssen.
 */
export interface DayCellProps {
  /** ISO-Datum der Zelle (Nacht). */
  dayIso: string;
  dayNumber: number;
  isToday: boolean;
  isWeekend: boolean;
  /** Belegung dieser Nacht (null = frei). */
  entry: OccupancyEntry | null;
  /** Erste/letzte Nacht des Eintrags (für Balken-Rundung). */
  isStart: boolean;
  isEnd: boolean;
  isSelected: boolean;
  /** Tag liegt im aktuell ausgewählten Preis-Zeitraum (Einzelwohnungs-Ansicht). */
  inRange: boolean;
  /** Effektiver Nachtpreis in Cent (null = keine Preisanzeige, z. B. Timeline). */
  priceCents: number | null;
  /** Deckt mindestens eine aktive Preisregel diesen Tag ab? */
  hasPriceRule: boolean;
  /** Klick: Eintrag auswählen (null = freie Nacht angeklickt). */
  onSelect: (entry: OccupancyEntry | null, dayIso: string) => void;
}

/** Zelle der Channel-Manager-Ansicht (eine Nacht × eine Wohnung). */
function TimelineDayCell({ dayIso, isToday, isWeekend, entry, isStart, isEnd, isSelected, onSelect }: DayCellProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry, dayIso)}
      title={entry ? entryTitle(entry) : undefined}
      className={`relative flex h-10 items-center border-s border-t border-forest-900/5 ${
        !entry && isWeekend ? "bg-cream-50" : ""
      } ${isToday ? "bg-brass-400/10" : ""} ${entry ? "" : "cursor-default"}`}
    >
      {entry && (
        <span
          className={`h-5 w-full ${SOURCE_BAR[entry.source]} ${isStart ? "ms-[3px] rounded-s-full" : ""} ${
            isEnd ? "me-[3px] rounded-e-full" : ""
          } ${isSelected ? "ring-2 ring-forest-900" : ""}`}
        />
      )}
    </button>
  );
}

/** Zelle des Monatsrasters (Ansicht für eine einzelne Wohnung). */
function MonthDayCell({ dayNumber, dayIso, isToday, entry, isSelected, inRange, priceCents, hasPriceRule, onSelect }: DayCellProps) {
  let cls = "text-forest-900 hover:bg-forest-900/5";
  if (entry?.source === "booking") cls = "bg-forest-500 text-cream-50";
  else if (entry?.source === "airbnb-ical") cls = "bg-rose-400 text-white";
  else if (entry) cls = "bg-forest-900/15 text-forest-700/70";

  const ring = inRange
    ? "ring-2 ring-brass-600 ring-offset-1"
    : isSelected
      ? "ring-2 ring-forest-900"
      : isToday
        ? "ring-1 ring-brass-600"
        : "";

  return (
    <button
      type="button"
      onClick={() => onSelect(entry, dayIso)}
      title={entry ? entryTitle(entry) : undefined}
      className={`relative mx-auto my-0.5 flex h-11 w-11 flex-col items-center justify-center rounded-[10px] font-body text-sm transition-colors sm:h-12 sm:w-12 ${cls} ${ring}`}
    >
      <span className="leading-none">{dayNumber}</span>
      {priceCents != null && (
        <span
          className={`mt-1 text-[0.55rem] leading-none ${
            entry ? "opacity-75" : hasPriceRule ? "font-bold text-brass-600" : "text-forest-700/55"
          }`}
        >
          {Math.round(priceCents / 100)}
        </span>
      )}
    </button>
  );
}

/* ────────────────────────── Kalender ────────────────────────── */

interface Props {
  retreats: OccupancyRetreat[];
  entries: OccupancyEntry[];
  /** Aktive Preisregeln aller Wohnungen (price_rules). */
  priceRules: CalendarPriceRule[];
}

export function OccupancyCalendar({ retreats, entries, priceRules }: Props) {
  const todayIso = iso(startOfToday());
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(startOfToday()));
  const [retreatFilter, setRetreatFilter] = useState<string>("all");
  const [selected, setSelected] = useState<OccupancyEntry | null>(null);
  // Preis-Zeitraum-Auswahl (nur Einzelwohnungs-Ansicht), ISO, inklusiv.
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);

  /** Wohnung → (Nacht-ISO → Eintrag). Einträge sind [start, end). */
  const nightMap = useMemo(() => {
    const map = new Map<string, Map<string, OccupancyEntry>>();
    for (const e of entries) {
      let byNight = map.get(e.retreatId);
      if (!byNight) {
        byNight = new Map();
        map.set(e.retreatId, byNight);
      }
      let d = new Date(e.start);
      const end = new Date(e.end);
      // Sicherheitsnetz gegen kaputte Daten: max. 2 Jahre pro Eintrag.
      for (let i = 0; i < 730 && isBefore(d, end); i++) {
        byNight.set(iso(d), e);
        d = addDays(d, 1);
      }
    }
    return map;
  }, [entries]);

  const days = eachDayOfInterval({ start: startOfMonth(viewMonth), end: endOfMonth(viewMonth) });
  const singleRetreat = retreatFilter === "all" ? null : retreats.find((r) => r.id === retreatFilter) ?? null;

  const activeRules = useMemo(() => priceRules.filter((r) => r.active), [priceRules]);
  const singleRules = useMemo(
    () => (singleRetreat ? activeRules.filter((r) => r.retreatId === singleRetreat.id) : []),
    [activeRules, singleRetreat],
  );
  const effectiveRangeEnd = rangeEnd ?? rangeStart;

  const clearRange = () => {
    setRangeStart(null);
    setRangeEnd(null);
  };

  /**
   * Klick auf eine Tag-Zelle: Belegung in die Detailleiste übernehmen und —
   * in der Einzelwohnungs-Ansicht — die Preis-Zeitraum-Auswahl fortschreiben
   * (1. Klick = Starttag, 2. Klick = Endtag, danach beginnt eine neue Auswahl;
   * Rückwärtsauswahl wird getauscht). Belegte Tage sind bewusst wählbar
   * (Preisregel für künftige Zeiträume).
   */
  const select = (entry: OccupancyEntry | null, dayIso: string) => {
    setSelected(entry);
    if (!singleRetreat) return;
    if (!rangeStart || rangeEnd) {
      setRangeStart(dayIso);
      setRangeEnd(null);
    } else if (dayIso < rangeStart) {
      setRangeEnd(rangeStart);
      setRangeStart(dayIso);
    } else {
      setRangeEnd(dayIso);
    }
  };

  const cellProps = (retreatId: string, day: Date): DayCellProps => {
    const dayIso = iso(day);
    const entry = nightMap.get(retreatId)?.get(dayIso) ?? null;
    const weekday = getDay(day); // 0 = So
    const forSingle = singleRetreat != null && retreatId === singleRetreat.id;
    return {
      dayIso,
      dayNumber: Number(format(day, "d")),
      isToday: dayIso === todayIso,
      isWeekend: weekday === 0 || weekday === 6,
      entry,
      isStart: entry?.start === dayIso,
      isEnd: entry != null && iso(addDays(day, 1)) === entry.end,
      isSelected: entry != null && selected?.id === entry.id,
      inRange:
        forSingle && rangeStart != null && dayIso >= rangeStart && dayIso <= (effectiveRangeEnd ?? rangeStart),
      priceCents: forSingle ? nightPriceCents(dayIso, singleRetreat.basePriceCents, singleRules) : null,
      hasPriceRule: forSingle && singleRules.some((r) => ruleCoversDay(r, dayIso)),
      onSelect: select,
    };
  };

  const selectedRetreatName = selected ? retreats.find((r) => r.id === selected.retreatId)?.name ?? "" : "";

  return (
    <div>
      {/* Filter: Alle Wohnungen / einzelne Wohnung */}
      <div className="flex flex-wrap gap-2">
        {[{ id: "all", name: "Alle Wohnungen" }, ...retreats].map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              setRetreatFilter(r.id);
              setSelected(null);
              setRangeStart(null);
              setRangeEnd(null);
            }}
            className={`rounded-full px-4 py-2 font-body text-xs font-semibold transition-colors ${
              retreatFilter === r.id
                ? "bg-forest-900 text-cream-50"
                : "border border-forest-900/15 text-forest-900 hover:border-forest-900/40"
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Monats-Navigation */}
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          aria-label="Vorheriger Monat"
          onClick={() => setViewMonth((m) => addMonths(m, -1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-forest-900/15 font-display text-lg text-forest-900 transition-colors hover:border-forest-900"
        >
          ‹
        </button>
        <span className="min-w-36 text-center font-display text-base text-forest-900">{MONTH_FMT.format(viewMonth)}</span>
        <button
          type="button"
          aria-label="Nächster Monat"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-forest-900/15 font-display text-lg text-forest-900 transition-colors hover:border-forest-900"
        >
          ›
        </button>
        {iso(viewMonth) !== iso(startOfMonth(startOfToday())) && (
          <button
            type="button"
            onClick={() => setViewMonth(startOfMonth(startOfToday()))}
            className="rounded-full border border-forest-900/15 px-3 py-1.5 font-body text-xs font-semibold text-forest-900 transition-colors hover:border-forest-900/40"
          >
            Heute
          </button>
        )}
      </div>

      {/* Ansicht */}
      {singleRetreat ? (
        /* Monatsraster einer Wohnung */
        <div className="mt-4 max-w-md rounded-[8px] border border-forest-900/10 bg-white px-2 py-4 sm:px-5">
          <div className="grid grid-cols-7 text-center">
            {WEEKDAYS.map((w) => (
              <div key={w} className="pb-2 font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/50">
                {w}
              </div>
            ))}
            {Array.from({ length: (getDay(startOfMonth(viewMonth)) + 6) % 7 }).map((_, i) => (
              <div key={`lead-${i}`} />
            ))}
            {days.map((day) => (
              <MonthDayCell key={iso(day)} {...cellProps(singleRetreat.id, day)} />
            ))}
          </div>
          <p className="mt-3 font-body text-[0.68rem] text-forest-700/55">
            Zahl unter dem Tag = Nachtpreis in €{" "}
            (<span className="font-bold text-brass-600">brass</span> = Preisregel aktiv).
            Tag anklicken, für einen Zeitraum einen zweiten Tag anklicken — dann unten den Preis festlegen.
          </p>
        </div>
      ) : (
        /* Channel-Manager-Ansicht: Zeile pro Wohnung */
        <div className="mt-4 overflow-x-auto rounded-[8px] border border-forest-900/10 bg-white">
          <div
            className="grid"
            style={{ gridTemplateColumns: `minmax(7.5rem, 12rem) repeat(${days.length}, minmax(2.1rem, 1fr))` }}
          >
            {/* Kopfzeile: Tage */}
            <div className="sticky left-0 z-10 bg-white" />
            {days.map((day) => {
              const isToday = iso(day) === todayIso;
              const weekday = getDay(day);
              return (
                <div key={iso(day)} className={`flex flex-col items-center gap-0.5 border-s border-forest-900/5 py-2 ${isToday ? "bg-brass-400/10" : weekday === 0 || weekday === 6 ? "bg-cream-50" : ""}`}>
                  <span className="font-body text-[0.6rem] font-semibold uppercase text-forest-700/45">
                    {WEEKDAYS[(weekday + 6) % 7]}
                  </span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full font-body text-xs ${
                      isToday ? "bg-forest-900 font-semibold text-cream-50" : "text-forest-900"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                </div>
              );
            })}
            {/* Eine Zeile pro Wohnung */}
            {retreats.map((r) => (
              <div key={r.id} className="contents">
                <div className="sticky left-0 z-10 flex h-10 items-center truncate border-t border-forest-900/5 bg-white px-3 font-body text-sm text-forest-900">
                  {r.name}
                </div>
                {days.map((day) => (
                  <TimelineDayCell key={iso(day)} {...cellProps(r.id, day)} />
                ))}
              </div>
            ))}
            {retreats.length === 0 && (
              <div className="col-span-full px-4 py-8 text-center font-body text-sm text-forest-700/60">
                Noch keine Wohnungen angelegt.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preis-Panel für den ausgewählten Zeitraum (Einzelwohnungs-Ansicht) */}
      {singleRetreat && rangeStart && effectiveRangeEnd && (
        <PriceRangePanel
          key={`${singleRetreat.id}-${rangeStart}-${effectiveRangeEnd}`}
          retreat={singleRetreat}
          rules={singleRules}
          rangeStart={rangeStart}
          rangeEnd={effectiveRangeEnd}
          onClose={clearRange}
        />
      )}

      {/* Legende */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-body text-xs text-forest-700/70">
        {(Object.keys(SOURCE_LABEL) as OccupancySource[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-2">
            <span className={`inline-block h-3 w-3 rounded-full ${SOURCE_DOT[s]}`} /> {SOURCE_LABEL[s]}
          </span>
        ))}
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full border border-forest-900/20" /> Frei
        </span>
      </div>

      {/* Detailleiste zur angeklickten Belegung */}
      {selected && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[6px] border border-forest-900/10 bg-cream-100/60 px-4 py-3 font-body text-sm text-forest-900">
          <span className="inline-flex items-center gap-2 font-semibold">
            <span className={`inline-block h-3 w-3 rounded-full ${SOURCE_DOT[selected.source]}`} />
            {SOURCE_LABEL[selected.source]}
            {selected.demo && (
              <span className="rounded-full bg-cream-100 px-2 py-0.5 font-body text-[0.6rem] font-semibold uppercase tracking-wider text-forest-700/60">
                Demo
              </span>
            )}
          </span>
          <span>{selectedRetreatName}</span>
          <span className="text-forest-700/80">
            {dateDe(selected.start)} → {dateDe(selected.end)} · {nightsOf(selected)} {nightsOf(selected) === 1 ? "Nacht" : "Nächte"}
          </span>
          {selected.guestName && <span>{selected.guestName}</span>}
          {selected.note && <span className="text-forest-700/60">{selected.note}</span>}
          {selected.source === "booking" && selected.bookingId && (
            <Link
              href={`/admin/buchungen/${selected.bookingId}`}
              className="font-semibold text-brass-600 underline-offset-2 hover:underline"
            >
              Buchung {selected.bookingNumber ? `${selected.bookingNumber} ` : ""}öffnen →
            </Link>
          )}
          {selected.source === "airbnb-ical" && (
            <span className="text-xs text-forest-700/60">Details und Stornos verwaltet Airbnb (iCal-Sync).</span>
          )}
          {selected.source === "manual" && (
            <Link
              href={`/admin/wohnungen/${selected.retreatId}`}
              className="font-semibold text-brass-600 underline-offset-2 hover:underline"
            >
              In der Wohnung verwalten →
            </Link>
          )}
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="ms-auto rounded-[3px] border border-forest-900/25 px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wider text-forest-900 transition-colors hover:border-forest-900"
          >
            Schließen
          </button>
        </div>
      )}

      {/* Aktive Preisregeln (bei „Alle Wohnungen" alle, sonst die der Wohnung) */}
      <PriceRuleList
        rules={singleRetreat ? singleRules : activeRules}
        retreatNames={Object.fromEntries(retreats.map((r) => [r.id, r.name]))}
        showRetreat={!singleRetreat}
      />
    </div>
  );
}
