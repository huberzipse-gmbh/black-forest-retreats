import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileBookBar } from "@/components/layout/MobileBookBar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      {/* Mobile-Spacer, damit die fixe Buchen-Leiste die letzte Footer-Zeile
          (Rechtliches) nicht dauerhaft verdeckt */}
      <div aria-hidden className="h-20 md:hidden" />
      <MobileBookBar />
    </>
  );
}
