import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = { title: "Admin · Black Forest Retreats" };

/**
 * Admin-Layout. Der Zugriffsschutz sitzt in proxy.ts (HMAC-Cookie) —
 * die Login-Seite bringt ihr eigenes Vollbild-Layout mit.
 *
 * dir="ltr" ist bewusst fixiert: Der Sprachwähler der Website setzt bei
 * Arabisch global dir="rtl" auf <html> (Cookie gilt domainweit). Der Admin
 * ist rein deutsch und bleibt daher immer links-nach-rechts.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="ltr" lang="de">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
