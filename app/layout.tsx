import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { getLocale } from "@/lib/i18n/server";
import { dir } from "@/lib/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/seo/config";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // SITE_URL liest NEXT_PUBLIC_SITE_URL und fällt auf die Produktions-Domain
  // zurück (nicht mehr auf localhost) — sonst wären og:image/canonical im Live-
  // Betrieb ohne gesetzte Env-Variable unbrauchbar.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Black Forest Retreats · Exklusive Apartments in Neuenbürg",
    template: "%s · Black Forest Retreats",
  },
  description:
    "Hochwertige Apartments im Herzen des Schwarzwalds. Direkt buchen, ankommen, durchatmen.",
  applicationName: SITE_NAME,
  openGraph: {
    title: "Black Forest Retreats",
    description: "Exklusive Apartments im Schwarzwald, Neuenbürg.",
    siteName: SITE_NAME,
    locale: "de_DE",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Ohne diese kürzt Google Snippet und Bildvorschau selbst; sie steuern
      // auch, wie viel in KI-Overviews zitiert werden darf.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <I18nProvider locale={locale}>
          {children}
          <CookieBanner />
        </I18nProvider>
      </body>
    </html>
  );
}
