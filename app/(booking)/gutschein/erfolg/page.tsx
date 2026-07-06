import { notFound } from "next/navigation";
import { getStrings } from "@/lib/i18n/server";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import { getGiftCardByToken } from "@/lib/giftcards/actions";
import { GiftCardPreview } from "@/components/giftcard/GiftCardPreview";
import { PendingRefresh } from "@/components/giftcard/PendingRefresh";
import { NotConfiguredNotice } from "@/components/booking/NotConfiguredNotice";
import { Type } from "@/components/ui/Type";

export default async function GiftSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const t = (await getStrings()).giftFlow;

  if (!supabaseAdminConfigured()) return <NotConfiguredNotice />;

  const giftId = typeof sp.gift === "string" ? sp.gift : "";
  const token = typeof sp.token === "string" ? sp.token : "";
  const card = await getGiftCardByToken(giftId, token);
  if (!card) notFound();

  // Webhook noch unterwegs → kurzer Warte-Zustand mit Auto-Refresh.
  if (card.status === "pending") {
    return (
      <div className="mx-auto max-w-xl text-center">
        <PendingRefresh />
        <Type role="h1" as="h1" className="text-forest-900">
          {t.success.pendingTitle}
        </Type>
        <Type role="body" className="mt-4 text-forest-700/80">
          {t.success.pendingText}
        </Type>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <Type role="h1" as="h1" className="text-forest-900">
          {t.success.title}
        </Type>
        <Type role="body" className="mx-auto mt-3 max-w-md text-forest-700/80">
          {t.success.mailInfo(card.buyerEmail)}
        </Type>
      </div>

      <div className="mt-8">
        <GiftCardPreview
          amountCents={card.amountCents}
          recipientName={card.recipientName}
          buyerName={card.buyerName}
          message={card.message}
          elementIcon={card.elementIcon}
          code={card.code}
          expiresAt={card.expiresAt}
        />
      </div>

      <div className="mt-8 text-center">
        <a
          href={`/api/giftcards/${card.id}/pdf?token=${card.downloadToken}`}
          target="_blank"
          rel="noopener"
          className="inline-block rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors duration-300 hover:bg-brass-300"
        >
          {t.success.downloadCta}
        </a>
        <p className="mx-auto mt-5 max-w-md font-body text-xs leading-relaxed text-forest-700/60">
          {t.success.redeemHint}
        </p>
      </div>
    </div>
  );
}
