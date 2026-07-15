/**
 * Supabase-Umgebungs-Check: Ist die Datenbank konfiguriert?
 * Buchungs-/Admin-Seiten zeigen ohne Konfiguration einen freundlichen
 * Hinweis statt zu crashen; Marketing-Seiten fallen auf die statischen
 * Daten aus data/retreats.ts zurück.
 */
/**
 * Fester Name des Auth-Cookies. Browser- und Server-Client MÜSSEN denselben
 * verwenden, sonst leitet supabase-js ihn je aus der eigenen URL ab (öffentliche
 * Domain vs. SUPABASE_INTERNAL_URL) und der Server sieht die Sitzung nicht.
 */
export const AUTH_COOKIE_NAME = 'sb-bfr-auth';

export function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Service-Role zusätzlich vorhanden (für Server Actions / Admin)? */
export function supabaseAdminConfigured(): boolean {
  return supabaseConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
