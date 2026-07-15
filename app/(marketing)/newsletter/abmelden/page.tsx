import type { Metadata } from "next";
import { unsubscribeNewsletter } from "@/lib/newsletter/actions";
import { getStrings } from "@/lib/i18n/server";
import { NewsletterResult } from "@/components/sections/NewsletterResult";

export const metadata: Metadata = {
  title: "Newsletter abmelden · Black Forest Retreats",
  robots: { index: false, follow: false },
};

/** Ziel des Abmeldelinks am Ende jeder Newsletter-Mail. */
export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const ok = token ? await unsubscribeNewsletter(token) : false;
  const t = (await getStrings()).newsletter.unsubscribe;

  return (
    <NewsletterResult
      title={ok ? t.title : t.invalidTitle}
      text={ok ? t.text : t.invalidText}
      cta={t.cta}
      ok={ok}
    />
  );
}
