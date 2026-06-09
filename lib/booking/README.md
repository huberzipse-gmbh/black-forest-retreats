# Buchungs- & Rabattlogik

Kern-Differenzierer des Projekts: Gäste sollen **direkt über uns statt über Airbnb**
buchen — günstiger für den Gast, provisionsfrei für uns.

## Bausteine (Implementierung folgt nach der Design-Phase)

- **`types.ts`** — Domänen-Typen (Retreat, AvailabilityBlock, Discount, PriceQuote, Booking).
- **`availability.ts`** _(geplant)_ — Verfügbarkeit prüfen; Sync mit Airbnb via **iCal-Import**,
  damit Doppelbuchungen vermieden werden, solange die Wohnungen noch auf Airbnb laufen.
- **`pricing.ts`** _(geplant)_ — Preisberechnung: `nights × basePrice + cleaningFee − discount`.
- **`discounts.ts`** _(geplant)_ — Rabattauflösung; insbesondere der **QR-Code-Direktbucher-Rabatt**.

## QR-Code-Direktbucher-Flow (Leitidee)

1. In jeder Wohnung hängt ein QR-Code (Tischaufsteller/Schild).
2. Scan → Landing der jeweiligen Unterkunft mit vorbelegtem `?discount=direct-qr`-Code.
3. Direktbucher-Rabatt wird im Preis sichtbar gegen den Airbnb-Preis gestellt
   („Du sparst X € gegenüber Airbnb").
4. Buchung + Zahlung laufen über uns (Stripe), kein Airbnb-Umweg beim nächsten Mal.

## Zahlung

Stripe (PaymentIntent). Bestätigung der Buchung erst nach erfolgreicher Zahlung
(Webhook → `booking.status = confirmed`).

## Offene Entscheidungen (für die nächste Phase)

- Verfügbarkeits-Quelle: iCal-Sync mit Airbnb vs. vollständig eigene Kalenderhoheit.
- Rabatthöhe Direktbucher (z. B. ~10–15 % = ungefähre Airbnb-Servicegebühr).
- Zahlung vollständig vorab vs. Anzahlung.
- Gäste-Accounts (Login für Wiederbucher) vs. gastbasierte Buchung per E-Mail.
