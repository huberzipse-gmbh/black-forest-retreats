# Black Forest Retreats — Projektkontext

> Single Source of Truth für Vision, Scope & Tech. Bei jeder Arbeit zuerst lesen,
> damit wir immer am gleichen Ziel arbeiten. (Stand: 09.06.2026)

## 1. Vision

Hochwertige **Wellness-/Retreat-Website** für Ferienwohnungen im Schwarzwald, die
aktuell als **Airbnbs** gelistet sind. Gäste, die schon einmal vor Ort waren,
bekommen die Seite (u. a. via **QR-Code in der Wohnung**) und buchen beim nächsten
Mal **direkt über uns statt über Airbnb** — günstiger für den Gast, provisionsfrei
für den Vermieter.

**Endziel:** Goldstandard Hotel-/Wellness-Retreat-Website mit vollständiger
**Buchungs- und Rabattlogik**.

## 2. Kernprinzipien

1. **Direktbuchung lohnt sich** — über QR-Code/Direktlink gibt es einen sichtbaren
   Rabatt ggü. Airbnb. Der Preisvergleich „Du sparst X € gegenüber Airbnb" ist Teil der UX.
2. **Skaliert auf 10–20 Wohnungen** — Architektur (Daten, Routing, CMS-Pflege) von
   Anfang an für mehrere Einheiten ausgelegt, nicht für eine einzelne Seite.
3. **Markenerlebnis Schwarzwald-Wellness** — ruhig, edel, naturverbunden.

## 3. Branding / Design-Richtung (Details folgen in der Design-Phase)

- **Stimmung:** Wellness-Retreat, hochwertig, naturverbunden, ruhig.
- **Farben:** dunkles Tannengrün + warme Brauntöne (Holz/Erde) + cremige Neutraltöne,
  gedämpftes Gold/Messing als Premium-Akzent. → `lib/theme/colors.ts` (Entwurf).
- **Typografie:** Agentur-Default-Pairing **Fraunces** (Display-Serif) + **Plus Jakarta
  Sans** (Text-Sans) über `lib/typography.ts` (Single Source of Truth).
- **Referenzen:** liefert der Kunde im nächsten Schritt (gute Hotel-/Retreat-Sites).

## 4. Funktionsumfang (geplant)

- Öffentliche Marketing-Seiten: Startseite, Unterkünfte-Übersicht, Einzel-Unterkunft, Über uns.
- **Buchungs-Engine:** Verfügbarkeit (inkl. Airbnb-iCal-Sync gegen Doppelbuchung),
  Preisberechnung, Buchung + Zahlung (Stripe).
- **Rabattlogik:** QR-Direktbucher-Rabatt, Wiederkehrer-Rabatt, manuelle Promo-Codes.
- **Inhaltspflege:** mehrere Wohnungen verwalten (perspektivisch leichtes CMS/Admin).

→ Domänen-Skelett & offene Entscheidungen: siehe [`lib/booking/README.md`](../lib/booking/README.md).

## 5. Tech-Stack

| Bereich        | Wahl                                              |
|----------------|---------------------------------------------------|
| Framework      | **Next.js 16** (App Router, RSC, TypeScript)      |
| Styling        | **Tailwind CSS v4**                               |
| Backend/DB/Auth| **Supabase** (Postgres, Auth, Storage)            |
| Zahlung        | **Stripe** (PaymentIntent + Webhook)              |
| Datum/Logik    | date-fns, zod                                     |
| Hosting        | TBD (Vercel oder Hetzner/Coolify wie andere Projekte) |
| Dev-Port       | **3030**                                          |

**Warum Next.js (statt Expo):** öffentliche Buchungs-Website → SEO, schnelle
Server-Rendering-Seiten, eigene Buchungs-/Zahlungs-Routen. Deckt sich mit dem
bewährten Website-/Software-Stack der Agentur (vgl. Marquardt).

## 6. Ordnerstruktur

```
black-forest-retreats/
├── app/
│   ├── (marketing)/      # öffentliche Seiten (Home, Unterkünfte, About)
│   ├── (booking)/        # Buchungs-Flow
│   └── api/              # Route Handlers (Verfügbarkeit, Checkout, Stripe-Webhook)
├── components/ui/        # wiederverwendbare UI-Bausteine
├── lib/
│   ├── typography.ts     # Schrift-Rollen (Single Source of Truth)
│   ├── theme/colors.ts   # Farb-Tokens (Schwarzwald-Palette)
│   ├── i18n/useStrings.ts
│   ├── strings/de.ts     # alle UI-Texte (Quellsprache DE)
│   ├── supabase/         # Browser- + Server-Client
│   └── booking/          # Buchungs-/Rabatt-Domäne (types + Logik)
├── data/retreats.ts      # Seed-Daten (bis Supabase befüllt)
├── supabase/migrations/  # DB-Migrationen
├── public/images/
└── docs/CONTEXT.md       # dieses Dokument
```

## 7. Konventionen (verbindlich, aus globaler CLAUDE.md)

- **Typografie:** keine Hardcodes — nur `type.*`; Schriftwechsel nur über `fonts`-Map.
- **i18n:** keine UI-Strings inline — nur über `useStrings()` / `lib/strings/de.ts`.
- **Kausalitäten vollständig bauen:** neue Funktion = alle Folge-Schritte mitbauen + prüfen.
- **Git:** Feature-Branch, PR, nie direkt auf main (Branch-Naming siehe CLAUDE.md).

## 8. Status & nächster Schritt

- [x] Ordnerstruktur + Tech-Stack aufgesetzt, Backend-Deps installiert.
- [ ] **DESIGN-PHASE (als Nächstes):** Kunde liefert Referenzen → gemeinsam Look &
  Feel (Farben/Typo/Hero/Komponenten) festlegen. **Erst danach** Implementierung.
- [ ] Buchungs-Engine + Rabattlogik + Stripe.
- [ ] Inhalte/Wohnungen + Hosting/Deploy.
