import type { Metadata } from "next";
import { confirmNewsletter } from "@/lib/newsletter/actions";
import { getStrings } from "@/lib/i18n/server";
import { NewsletterResult } from "@/components/sections/NewsletterResult";

export const metadata: Metadata = {
  title: "Newsletter bestätigen · Black Forest Retreats",
  robots: { index: false, follow: false },
};

/** Ziel des Links aus der Bestätigungsmail (Double-Opt-in). */
export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const ok = token ? await confirmNewsletter(token) : false;
  const t = (await getStrings()).newsletter.confirm;

  return (
    <NewsletterResult
      title={ok ? t.title : t.invalidTitle}
      text={ok ? t.text : t.invalidText}
      cta={t.cta}
      ok={ok}
    />
  );
}
