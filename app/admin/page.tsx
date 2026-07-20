import Link from "next/link";
import { connection } from "next/server";
import { addDays, format } from "date-fns";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { runIfStale } from "@/lib/booking/cron";
import { mapBooking, mapPriceRule } from "@/lib/booking/db";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import { StatCard } from "@/components/admin/StatCard";
import { BookingTable } from "@/components/admin/BookingTable";
import { CronPanel } from "@/components/admin/CronPanel";
import { OccupancyCalendar, type OccupancyEntry } from "@/components/admin/OccupancyCalendar";

/** availability_blocks-Row inkl. Buchungs-Join (nur fürs Dashboard). */
interface BlockRow {
  id: string;
  retreat_id: string;
  start_date: string;
  end_date: string;
  source: OccupancyEntry["source"];
  booking_id: string | null;
  note: string | null;
  bookings: {
    guest_name: string;
    booking_number: string;
    status: string;
    payment_status: string;
    demo: boolean;
    created_at: string;
  } | null;
}

const iso = (d: Date) => format(d, "yyyy-MM-dd");

export default async function AdminDashboardPage() {
  if (!supabaseAdminConfigured()) return <AdminNotConfigured />;

  // Nur bei echten Requests laufen (nie beim Prerender — der no-store-Fetch
  // des iCal-Syncs bricht sonst mit „Dynamic server usage" ab).
  await connection();

  // Opportunistischer Cron-Trigger: Sync/Abbuchung, wenn > 30 min her.
  // connection() stoppt das Prerendering — ohne sie wirft der no-store-Fetch
  // des iCal-Syncs beim statischen Rendern (DynamicServerError), der Sync
  // schlägt dann bei jedem Lauf fehl und Airbnb-Änderungen kommen nie an.
  await connection();
  await runIfStale();

  const sb = createAdminClient();
  const today = iso(new Date());
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const weekAhead = iso(addDays(new Date(), 7));

  const [paidRes, openRes, arrivalsRes, failedRes, recentRes, cronRes, giftSoldRes, giftOpenRes, retreatsRes, blocksRes, priceRulesRes] = await Promise.all([
    sb
      .from("bookings")
      .select("total_cents")
      .eq("payment_status", "paid")
      .gte("confirmed_at", monthAgo),
    sb
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .in("payment_status", ["awaiting_payment", "scheduled", "charge_due", "failed"])
      .neq("status", "cancelled"),
    sb
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "confirmed")
      .gte("check_in", today)
      .lte("check_in", weekAhead),
    sb
      .from("bookings")
      .select("*")
      .eq("status", "confirmed")
      .eq("payment_status", "failed"),
    sb
      .from("bookings")
      .select("*, retreats(name_de)")
      .order("created_at", { ascending: false })
      .limit(8),
    sb.from("cron_runs").select("*"),
    // Gutschein-Umsatz (30 Tage): bezahlte Karten, Demo ausgenommen.
    sb
      .from("gift_cards")
      .select("amount_cents")
      .in("status", ["active", "redeemed"])
      .eq("demo", false)
      .gte("paid_at", monthAgo),
    // Offenes Guthaben: aktive Karten = ausstehende Leistungsverpflichtung.
    sb.from("gift_cards").select("balance_cents").eq("status", "active").eq("demo", false),
    // Belegungskalender: alle Wohnungen (auch ausgeblendete — Buchungen bleiben real).
    sb.from("retreats").select("id, name_de, base_price_cents").order("sort_order", { ascending: true }),
    sb
      .from("availability_blocks")
      .select("*, bookings(guest_name, booking_number, status, payment_status, demo, created_at)"),
    // Preis-Overrides fürs Kalender-Preispanel (Airbnb-Modell).
    sb.from("price_rules").select("*").eq("active", true),
  ]);

  const revenue30 = (paidRes.data ?? []).reduce((sum, r) => sum + r.total_cents, 0);
  const giftRevenue30 = (giftSoldRes.data ?? []).reduce((sum, r) => sum + r.amount_cents, 0);
  const giftOpenBalance = (giftOpenRes.data ?? []).reduce((sum, r) => sum + r.balance_cents, 0);
  const failedCharges = failedRes.data ?? [];
  const recent = (recentRes.data ?? []).map((row) => ({
    booking: mapBooking(row),
    retreatName: (row as { retreats?: { name_de?: string } }).retreats?.name_de ?? "",
  }));

  // Belegungskalender: stornierte Buchungen raus; verfallene pending-Buchungen
  // (unbezahlt, älter als 30 min) blockieren nicht mehr — wie lib/booking/db.fetchBlocks.
  const pendingCutoff = Date.now() - 30 * 60 * 1000;
  const calendarRetreats = ((retreatsRes.data ?? []) as { id: string; name_de: string; base_price_cents: number }[]).map((r) => ({
    id: r.id,
    name: r.name_de,
    basePriceCents: r.base_price_cents,
  }));
  const calendarPriceRules = (priceRulesRes.data ?? []).map(mapPriceRule);
  const calendarEntries: OccupancyEntry[] = ((blocksRes.data ?? []) as unknown as BlockRow[])
    .filter((b) => {
      if (b.source !== "booking" || !b.bookings) return true;
      if (b.bookings.status === "cancelled") return false;
      if (
        b.bookings.status === "pending" &&
        ["unpaid", "awaiting_payment", "failed"].includes(b.bookings.payment_status)
      ) {
        return new Date(b.bookings.created_at).getTime() > pendingCutoff;
      }
      return true;
    })
    .map((b) => ({
      id: b.id,
      retreatId: b.retreat_id,
      start: b.start_date,
      end: b.end_date,
      source: b.source,
      bookingId: b.booking_id,
      guestName: b.bookings?.guest_name ?? null,
      bookingNumber: b.bookings?.booking_number ?? null,
      note: b.note ?? "",
      demo: Boolean(b.bookings?.demo),
    }));

  return (
    <div>
      <h1 className="font-display text-3xl text-forest-900">Dashboard</h1>

      {/* Warnungen */}
      {failedCharges.length > 0 && (
        <div className="mt-6 rounded-[6px] border border-red-800/25 bg-red-50 px-5 py-4">
          <div className="font-body text-sm font-bold text-red-900">
            {failedCharges.length} fehlgeschlagene Abbuchung{failedCharges.length > 1 ? "en" : ""}
          </div>
          <p className="mt-1 font-body text-xs text-red-900/80">
            Bitte in den{" "}
            <Link href="/admin/buchungen" className="underline underline-offset-2">
              Buchungen
            </Link>{" "}
            prüfen und nachfassen.
          </p>
        </div>
      )}

      {/* Kennzahlen */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Umsatz Buchungen (30 Tage)" valueCents={revenue30} />
        <StatCard label="Umsatz Gutscheine (30 Tage)" valueCents={giftRevenue30} />
        <StatCard label="Offenes Gutschein-Guthaben" valueCents={giftOpenBalance} />
        <StatCard label="Offene Buchungen" value={openRes.count ?? 0} />
        <StatCard label="Anreisen (7 Tage)" value={arrivalsRes.count ?? 0} />
        <StatCard label="Fehlgeschlagene Abbuchungen" value={failedCharges.length} alert={failedCharges.length > 0} />
      </div>

      {/* Belegungskalender */}
      <div className="mt-10">
        <h2 className="font-display text-xl text-forest-900">Belegungskalender</h2>
        <div className="mt-4">
          <OccupancyCalendar retreats={calendarRetreats} entries={calendarEntries} priceRules={calendarPriceRules} />
        </div>
      </div>

      {/* Cron / Sync */}
      <div className="mt-8">
        <CronPanel runs={(cronRes.data ?? []).map((r) => ({ job: r.job, lastRun: r.last_run, lastResult: r.last_result ?? "" }))} />
      </div>

      {/* Letzte Buchungen */}
      <div className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl text-forest-900">Letzte Buchungen</h2>
          <Link href="/admin/buchungen" className="font-body text-xs font-semibold text-brass-600 underline-offset-2 hover:underline">
            Alle ansehen
          </Link>
        </div>
        <div className="mt-4">
          <BookingTable
            rows={recent.map(({ booking, retreatName }) => ({
              id: booking.id,
              bookingNumber: booking.bookingNumber,
              retreatName,
              guestName: booking.guestName,
              checkIn: booking.checkIn,
              checkOut: booking.checkOut,
              totalCents: booking.totalCents,
              status: booking.status,
              paymentStatus: booking.paymentStatus,
              demo: booking.demo,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
