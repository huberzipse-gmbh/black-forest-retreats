/**
 * useStrings() — zentraler Zugriff auf alle UI-Texte (Client-Hook).
 * Liest die Strings aus dem I18nProvider; die Sprache bestimmt der Server
 * über das Cookie `NEXT_LOCALE`. Importpfad bleibt für bestehende Komponenten gültig.
 */
export { useStrings } from './I18nProvider';
