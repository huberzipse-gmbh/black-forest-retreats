/**
 * Doppelbelegungs-Warnung fürs Dashboard: welche Wohnung, welche Nächte, und
 * welche zwei Belegungen sich in die Quere kommen. Der häufigste Fall ist eine
 * Airbnb-Buchung, die im Sync-Fenster (30 min) auf eine Direktbuchung trifft —
 * dagegen hilft kein Constraint, nur schnelles Reagieren.
 */
import Link from "next/link";
import { KIND_LABEL, type Conflict } from "@/lib/booking/conflicts";
import { dateDe } from "@/lib/admin/format";

interface Props {
  conflicts: Conflict[];
  /** retreatId → Anzeigename. */
  retreatNames: Map<string, string>;
}

export function ConflictWarning({ conflicts, retreatNames }: Props) {
  if (conflicts.length === 0) return null;

  return (
    <div className="mt-6 rounded-[6px] border border-red-800/25 bg-red-50 px-5 py-4">
      <div className="font-body text-sm font-bold text-red-900">
        {conflicts.length} Doppelbelegung{conflicts.length > 1 ? "en" : ""}
      </div>
      <p className="mt-1 font-body text-xs text-red-900/80">
        Dieselbe Wohnung ist zweimal vergeben. Bitte sofort klären — eine der beiden Belegungen muss weichen.
      </p>
      <ul className="mt-3 space-y-2">
        {conflicts.map((c, idx) => (
          <li key={idx} className="font-body text-xs text-red-900">
            <Link
              href={`/admin/wohnungen/${c.retreatId}`}
              className="font-semibold underline underline-offset-2"
            >
              {retreatNames.get(c.retreatId) ?? c.retreatId}
            </Link>{" "}
            · {dateDe(c.start)} – {dateDe(c.end)}
            <span className="mt-0.5 block text-red-900/70">
              {KIND_LABEL[c.a.kind]}: {c.a.label} ↔ {KIND_LABEL[c.b.kind]}: {c.b.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
