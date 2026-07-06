"use client";

/**
 * Erfolgsseite direkt nach der Stripe-Weiterleitung: der Webhook kann ein
 * paar Sekunden brauchen — bis dahin die Seite periodisch neu laden.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function PendingRefresh() {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 3000);
    return () => clearInterval(id);
  }, [router]);
  return null;
}
