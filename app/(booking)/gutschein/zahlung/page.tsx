import { notFound, redirect } from "next/navigation";
import { getStrings } from "@/lib/i18n/server";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadGiftCard } from "@/lib/giftcards/db";
import { GiftCheckoutView } from "@/components/giftcard/GiftCheckoutView";
import { NotConfiguredNotice } from "@/components/booking/NotConfiguredNotice";

export default async function GiftPaymentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  await getStrings(); // Locale-Cookie lesen → Seite bleibt dynamisch.

  if (!supabaseAdminConfigured()) return <NotConfiguredNotice />;

  const giftId = typeof sp.gift === "string" ? sp.gift : "";
  if (!giftId) redirect("/gutschein");

  const card = await loadGiftCard(createAdminClient(), giftId);
  if (!card) notFound();

  // Schon bezahlt? → direkt zur Erfolgsseite.
  if (card.status !== "pending") {
    redirect(`/gutschein/erfolg?gift=${card.id}&token=${card.downloadToken}`);
  }

  return (
    <GiftCheckoutView
      gift={{
        id: card.id,
        amountCents: card.amountCents,
        recipientName: card.recipientName,
        downloadToken: card.downloadToken,
      }}
      publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null}
    />
  );
}
