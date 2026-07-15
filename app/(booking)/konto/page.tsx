import { getLocale, getStrings } from "@/lib/i18n/server";
import { supabaseAdminConfigured, supabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapBooking } from "@/lib/booking/db";
import { NotConfiguredNotice } from "@/components/booking/NotConfiguredNotice";
import { AccountView, type AccountBooking } from "@/components/booking/AccountView";

/** Gast-Konto: Anmelden/Registrieren + eigene Buchungen. */
export default async function AccountPage() {
  const strings = await getStrings();
  const locale = await getLocale();
  if (!supabaseConfigured()) return <NotConfiguredNotice />;

  const sb = await createClient();
  const { data: userData } = await sb.auth.getUser();
  const user = userData?.user ?? null;

  // Buchungen laden. Ein Ladefehler darf die Seite NIE zur leeren Seite
  // crashen (der Login-Zustand soll immer sichtbar bleiben), daher try/catch.
  let bookings: AccountBooking[] = [];
  if (user) {
    try {
      const email = user.email ?? "";
      // Gast-Buchungen (ohne Konto) mit derselben E-Mail nachträglich diesem
      // Konto zuordnen — der Gast hatte beim Buchen noch kein Login. Braucht den
      // Service-Role-Client, weil RLS fremde/ungebundene Zeilen nicht sieht.
      if (supabaseAdminConfigured() && email) {
        const admin = createAdminClient();
        await admin
          .from("bookings")
          .update({ user_id: user.id })
          .is("user_id", null)
          .ilike("guest_email", email);
      }

      // Danach eigene Buchungen laden (jetzt inkl. der eben verknüpften).
      // Bevorzugt über den Admin-Client (sieht die frisch verknüpften Zeilen
      // ohne Cache-Umweg); ohne Service-Key Fallback auf den RLS-Client.
      const reader = supabaseAdminConfigured() ? createAdminClient() : sb;
      const { data } = await reader
        .from("bookings")
        .select("*, retreats(name_de)")
        .eq("user_id", user.id)
        .order("check_in", { ascending: false });
      bookings = (data ?? []).map((row) => {
        const b = mapBooking(row);
        return {
          bookingNumber: b.bookingNumber,
          retreatName:
            (row as { retreats?: { name_de?: string } }).retreats?.name_de ?? b.retreatId,
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          guests: b.adults + b.children,
          totalCents: b.totalCents,
          status: b.status,
        };
      });
    } catch {
      bookings = [];
    }
  }

  void strings;
  const { data: settingsRow } = await sb
    .from("settings")
    .select("registered_discount_percent")
    .eq("id", 1)
    .maybeSingle();

  return (
    <AccountView
      userEmail={user?.email ?? null}
      bookings={bookings}
      registeredDiscountPercent={Number(settingsRow?.registered_discount_percent ?? 5)}
      locale={locale}
    />
  );
}
