import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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
  title: "Black Forest Retreats — Exklusive Apartments in Neuenbürg",
  description:
    "Hochwertige Apartments im Herzen des Schwarzwalds. Direkt buchen, ankommen, durchatmen.",
  metadataBase: new URL("http://localhost:3030"),
  openGraph: {
    title: "Black Forest Retreats",
    description: "Exklusive Apartments im Schwarzwald — Neuenbürg.",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
