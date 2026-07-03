/**
 * Storage-URLs IMMER same-origin ausliefern.
 *
 * Die self-hosted Supabase-Instanz ist nur über die interne Kong-URL
 * (http://supabasekong-….sslip.io) erreichbar — der Browser kann/darf die
 * nicht laden (Mixed Content, nicht öffentlich geroutet). Alle Storage-Pfade
 * laufen deshalb über die eigenen Next-Rewrites (/storage/v1/… → Kong,
 * siehe next.config.ts). Hier wird jede Storage-URL auf den relativen
 * same-origin-Pfad normalisiert; Alt-Daten mit absoluter Kong-URL in der DB
 * werden so beim Lesen repariert.
 */

const STORAGE_PREFIX = "/storage/v1/object/";

export function toSameOriginStorageUrl(url: string): string {
  if (!url) return url;
  const idx = url.indexOf(STORAGE_PREFIX);
  return idx > 0 ? url.slice(idx) : url;
}

/** Öffentliche same-origin-URL für ein Foto im Bucket retreat-photos. */
export function retreatPhotoUrl(path: string): string {
  return `${STORAGE_PREFIX}public/retreat-photos/${path}`;
}
