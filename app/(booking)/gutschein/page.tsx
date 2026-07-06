import type { Metadata } from "next";
import { getStrings } from "@/lib/i18n/server";
import { GiftCardWizard } from "@/components/giftcard/GiftCardWizard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getStrings();
  return { title: `${t.giftFlow.hero.title} · Black Forest Retreats` };
}

export default async function GiftCardPage() {
  await getStrings(); // Locale-Cookie lesen → Seite bleibt dynamisch.
  return <GiftCardWizard />;
}
