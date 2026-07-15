"use client";

/**
 * Admin-Belegungskalender im Airbnb-Stil: 2 Monate nebeneinander (Desktop),
 * 1 Monat mobil, frei durchblätterbar. Jede Nacht zeigt ihren Zustand
 * (Buchung / Airbnb / manuell geblockt / frei). Freie Nächte lassen sich
 * direkt anklicken: erster Klick = Beginn, zweiter Klick = Ende → Leiste mit
 * Notiz + „Blocken". Klick auf eine manuell geblockte Nacht bietet
 * „Freigeben" für die zugehörige Sperre an. Der Admin ist immer LTR/deutsch.
 */
import { useMemo, useState } from "react";
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
import type { EditorBlock } from "@/components/admin/RetreatEditor";
import { dateDe } from "@/lib/admin/format";

const iso = (d: Date) => format(d, "yyyy-MM-dd");
const MONTH_FMT = new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" });
const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

interface Props {
  blocks: EditorBlock[];
  /** Doppelt vergebene Nächte (ISO) — rot markiert, siehe lib/booking/conflicts. */
  conflictNights: string[];
  isPending: boolean;
  /** endExclusive = Checkout-Tag (frei), wie blockDates es erwartet. */
  onBlock: (start: string, endExclusive: string, note: string) => void;
  onUnblock: (blockId: string) => void;
}

export function AdminCalendar({ blocks, conflictNights, isPending, onBlock, onUnblock }: Props) {
  const today = startOfToday();
  const [viewMonth, setViewMonth] = useState(startOfMonth(today));
  const [anchor, setAnchor] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<EditorBlock | null>(null);
  const conflicts = useMemo(() => new Set(conflictNights), [conflictNights]);

  /** Nacht (ISO) → Block, der sie belegt. Blöcke sind [start, end). */
  const nightBlock = useMemo(() => {
    const map = new Map<string, EditorBlock>();
    for (const b of blocks) {
      let d = new Date(b.start);
      const end = new Date(b.end);
      // Sicherheitsnetz gegen kaputte Daten: max. 2 Jahre pro Block.
      for (let i = 0; i < 730 && isBefore(d, end); i++) {
        map.set(iso(d), b);
        d = addDays(d, 1);
      }
    }
    return map;
  }, [blocks]);

  const reset = () => {
    setAnchor(null);
    setRangeEnd(null);
    setNote("");
    setSelectedBlock(null);
  };

  const clickDay = (dayIso: string) => {
    const occupied = nightBlock.get(dayIso);
    if (occupied) {
      // Manuelle Sperre → zum Freigeben auswählen; Buchung/Airbnb nur anzeigen.
      setAnchor(null);
      setRangeEnd(null);
      setSelectedBlock(occupied);
      return;
    }
    setSelectedBlock(null);
    if (!anchor || rangeEnd || dayIso < anchor) {
      setAnchor(dayIso);
      setRangeEnd(null);
      return;
    }
    // Auswahl darf keine belegte Nacht überspannen.
    for (let d = new Date(anchor); iso(d) <= dayIso; d = addDays(d, 1)) {
      if (nightBlock.has(iso(d))) return;
    }
    setRangeEnd(dayIso);
  };

  const confirmBlock = () => {
    if (!anchor) return;
    const last = rangeEnd ?? anchor;
    onBlock(anchor, iso(addDays(new Date(last), 1)), note.trim());
    reset();
  };

  const sourceLabel: Record<EditorBlock["source"], string> = {
    booking: "Buchung",
    "airbnb-ical": "Airbnb",
    manual: "Manuell geblockt",
  };

  const months = [viewMonth, addMonths(viewMonth, 1)];

  return (
    <div>
      {/* Monats-Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Vorheriger Monat"
          onClick={() => setViewMonth((m) => addMonths(m, -1))}
          disabled={iso(viewMonth) <= iso(startOfMonth(today))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-forest-900/15 font-display text-lg text-forest-900 transition-colors hover:border-forest-900 disabled:opacity-30"
        >
          ‹
        </button>
        <div className="flex gap-12 md:gap-24">
          {months.map((m, idx) => (
            <span key={idx} className={`font-display text-base text-forest-900 ${idx === 1 ? "hidden md:inline" : ""}`}>
              {MONTH_FMT.format(m)}
            </span>
          ))}
        </div>
        <button
          type="button"
          aria-label="Nächster Monat"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-forest-900/15 font-display text-lg text-forest-900 transition-colors hover:border-forest-900"
        >
          ›
        </button>
      </div>

      {/* Monate */}
      <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-2">
        {months.map((month, idx) => {
          const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
          const lead = (getDay(startOfMonth(month)) + 6) % 7; // Montag-basiert
          return (
            <div key={idx} className={idx === 1 ? "hidden md:block" : ""}>
              <div className="grid grid-cols-7 text-center">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="pb-2 font-body text-[0.65rem] font-semibold uppercase tracking-wider text-forest-700/50">
                    {w}
                  </div>
                ))}
                {Array.from({ length: lead }).map((_, i) => (
                  <div key={`lead-${i}`} />
                ))}
                {days.map((day) => {
                  const dayIso = iso(day);
                  const past = isBefore(day, today);
                  const b = nightBlock.get(dayIso);
                  const last = rangeEnd ?? (anchor && !rangeEnd ? anchor : null);
                  const inSelection = anchor && last && dayIso >= anchor && dayIso <= last;
                  const isEdge = dayIso === anchor || dayIso === rangeEnd;
                  const inSelectedBlock = selectedBlock && b?.id === selectedBlock.id;
                  const conflicted = !past && conflicts.has(dayIso);

                  const base =
                    "relative mx-auto flex h-10 w-10 items-center justify-center rounded-full font-body text-sm transition-colors";
                  let cls: string;
                  if (past) cls = "text-forest-700/20";
                  // Doppelbelegung sticht alles: die Nacht ist zweimal vergeben.
                  else if (conflicted) cls = "bg-red-100 font-bold text-red-900 ring-2 ring-red-700";
                  else if (isEdge || (inSelection && !b)) cls = isEdge ? "bg-forest-900 text-cream-50" : "bg-forest-900/10 text-forest-900";
                  else if (b?.source === "booking") cls = `bg-brass-400/30 text-brass-700 ${inSelectedBlock ? "ring-2 ring-brass-500" : ""}`;
                  else if (b?.source === "airbnb-ical") cls = `bg-bark-100 text-bark-700 ${inSelectedBlock ? "ring-2 ring-bark-400" : ""}`;
                  else if (b) cls = `bg-forest-900/10 text-forest-700/60 line-through ${inSelectedBlock ? "ring-2 ring-forest-900/50" : ""}`;
                  else cls = "text-forest-900 hover:bg-forest-900/10";

                  return (
                    <button
                      key={dayIso}
                      type="button"
                      disabled={past || isPending}
                      onClick={() => clickDay(dayIso)}
                      title={
                        [
                          conflicted ? "Doppelbelegung — im Dashboard prüfen" : null,
                          b ? `${sourceLabel[b.source]}${b.note ? ` · ${b.note}` : ""}` : null,
                        ]
                          .filter(Boolean)
                          .join(" · ") || undefined
                      }
                      className={`${base} ${cls}`}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legende */}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-body text-xs text-forest-700/70">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-brass-400/60" /> Buchung
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-bark-200" /> Airbnb
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-forest-900/15" /> Manuell geblockt
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full border border-forest-900/20" /> Frei (anklicken zum Blocken)
        </span>
        {conflicts.size > 0 && (
          <span className="inline-flex items-center gap-2 font-semibold text-red-900">
            <span className="inline-block h-3 w-3 rounded-full bg-red-100 ring-2 ring-red-700" /> Doppelbelegung
          </span>
        )}
      </div>

      {/* Aktionsleiste: Auswahl blocken */}
      {anchor && (
        <div className="mt-5 flex flex-wrap items-end gap-3 rounded-[6px] border border-forest-900/10 bg-cream-100/60 px-4 py-3">
          <div className="font-body text-sm text-forest-900">
            {rangeEnd && rangeEnd !== anchor ? (
              <>Nächte <strong>{dateDe(anchor)} – {dateDe(rangeEnd)}</strong> blocken</>
            ) : (
              <>Nacht <strong>{dateDe(anchor)}</strong> blocken{!rangeEnd && <span className="text-forest-700/60"> · Endtag anklicken für Zeitraum</span>}</>
            )}
          </div>
          <input
            className="min-w-40 flex-1 rounded-[4px] border border-forest-900/20 bg-white px-3 py-2 font-body text-sm text-forest-900 outline-none focus:border-forest-900"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Notiz (optional), z. B. Eigenbedarf"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={confirmBlock}
            className="rounded-[3px] bg-forest-900 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-cream-50 transition-colors hover:bg-forest-800 disabled:opacity-40"
          >
            Blocken
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-[3px] border border-forest-900/25 px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-forest-900 transition-colors hover:border-forest-900"
          >
            Abbrechen
          </button>
        </div>
      )}

      {/* Aktionsleiste: angeklickte Belegung */}
      {selectedBlock && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[6px] border border-forest-900/10 bg-cream-100/60 px-4 py-3">
          <span className="font-body text-sm text-forest-900">
            <strong>{sourceLabel[selectedBlock.source]}</strong> · {dateDe(selectedBlock.start)} → {dateDe(selectedBlock.end)}
            {selectedBlock.note && <span className="text-forest-700/60"> · {selectedBlock.note}</span>}
          </span>
          {selectedBlock.source === "manual" ? (
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                onUnblock(selectedBlock.id);
                reset();
              }}
              className="rounded-[3px] bg-red-800 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-red-700 disabled:opacity-40"
            >
              Freigeben
            </button>
          ) : (
            <span className="font-body text-xs text-forest-700/60">
              {selectedBlock.source === "booking"
                ? "Buchungen werden über den Buchungs-Storno freigegeben."
                : "Airbnb-Sperren verwaltet der iCal-Sync automatisch."}
            </span>
          )}
          <button
            type="button"
            onClick={reset}
            className="rounded-[3px] border border-forest-900/25 px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-forest-900 transition-colors hover:border-forest-900"
          >
            Schließen
          </button>
        </div>
      )}
    </div>
  );
}
