import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { getLocale } from "@/lib/i18n/server";
import { dir } from "@/lib/i18n/config";

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
  title: "Black Forest Retreats · Exklusive Apartments in Neuenbürg",
  description:
    "Hochwertige Apartments im Herzen des Schwarzwalds. Direkt buchen, ankommen, durchatmen.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3030",
  ),
  openGraph: {
    title: "Black Forest Retreats",
    description: "Exklusive Apartments im Schwarzwald, Neuenbürg.",
    locale: "de_DE",
    type: "website",
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
