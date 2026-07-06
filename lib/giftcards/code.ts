/**
 * Menschlich lesbarer Gutschein-Code, Format GIFT-XXXX-XXXX.
 * Alphabet ohne verwechselbare Zeichen (wie bookingNumber.ts); Eindeutigkeit
 * sichert der unique constraint — Insert-Aufrufer retryt bei Kollision.
 */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateGiftCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let out = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) out += '-';
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `GIFT-${out}`;
}
