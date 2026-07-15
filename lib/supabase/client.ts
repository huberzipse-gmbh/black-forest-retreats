/**
 * Supabase Browser-Client (Client Components).
 * Env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (siehe .env.example).
 */
import { createBrowserClient } from '@supabase/ssr';
import { AUTH_COOKIE_NAME } from './env';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // Fester Cookie-Name. Sonst leitet supabase-js ihn aus der URL ab — und
    // weil der Browser die öffentliche Domain, der Server aber
    // SUPABASE_INTERNAL_URL nutzt, entstünden ZWEI verschiedene Cookie-Namen.
    // Folge: Der Server-Client fände die vom Browser gesetzte Sitzung nie, der
    // Login bliebe auf „Einen Moment …" hängen. Beide Clients müssen denselben
    // Namen verwenden (siehe server.ts).
    { cookieOptions: { name: AUTH_COOKIE_NAME } },
  );
}
