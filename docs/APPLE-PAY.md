# Apple Pay (und Google Pay) im Checkout

## Wie es funktioniert

Buchung und Gutschein nutzen beide das Stripe **Payment Element** mit
`automatic_payment_methods: { enabled: true }`. Damit steuert Stripe, welche
Zahlarten angezeigt werden. Apple Pay und Google Pay erscheinen automatisch
oben im Element, sobald **alle** vier Bedingungen erfüllt sind:

1. Die Zahlart ist im Stripe-Dashboard aktiviert (Apple Pay / Google Pay).
2. Die Domain ist bei Stripe als **Payment method domain** registriert und
   verifiziert (das ist der Punkt, der bisher gefehlt hat).
3. Die Seite läuft über HTTPS (auf blackforest-retreats.de gegeben).
4. Der Besucher nutzt ein passendes Gerät mit hinterlegter Karte
   (Apple Pay: Safari auf iPhone/Mac; Google Pay: Chrome mit Karte im Konto).

Es braucht **keinen zusätzlichen Code** im Frontend. Fehlt Punkt 2, blendet
Stripe die Wallet-Buttons stillschweigend aus, und es bleibt nur "Karte".

## Was im Code liegt

Die Verifikationsdatei von Stripe liegt unter

    public/.well-known/apple-developer-merchantid-domain-association

und wird von Next.js unter
`https://blackforest-retreats.de/.well-known/apple-developer-merchantid-domain-association`
ausgeliefert. Apple und Stripe rufen genau diese URL ab, um zu prüfen, dass die
Domain uns gehört.

## Was noch im Stripe-Dashboard passieren muss (einmalig, pro Domain)

1. Auf https://dashboard.stripe.com einloggen, oben rechts in den **Live-Modus**
   wechseln (nicht Testmodus).
2. Links **Mehr** (bzw. Einstellungen, Zahnrad) → **Zahlungen** →
   **Zahlungsmethoden**. Prüfen, dass **Apple Pay** und **Google Pay** auf
   "Ein" stehen. Falls nicht: aktivieren.
3. Zahnrad → **Zahlungsmethoden-Domains** ("Payment method domains") öffnen.
4. **Neue Domain hinzufügen** klicken, `blackforest-retreats.de` eintragen.
5. Stripe prüft nun automatisch die oben genannte Datei. Grüner Haken
   ("Verifiziert") = fertig. Falls Stripe meckert, die Datei sei nicht
   erreichbar: die URL im Browser aufrufen, es muss ein langer Zeichensalat
   erscheinen (kein 404). Dann in Stripe "Erneut prüfen" klicken.
6. Wird die Seite auch unter `www.blackforest-retreats.de` ausgeliefert, diese
   Domain in Schritt 4 ebenfalls hinzufügen.

Danach erscheint der schwarze **Apple-Pay-Button** im Checkout automatisch,
sobald ein iPhone/Safari mit hinterlegter Karte die Seite öffnet. Auf dem
Mac-Simulator oder in Chrome auf dem iPhone erscheint er nicht, das ist normal.

## Testen

- iPhone, **Safari** (nicht Chrome), Karte in der Wallet hinterlegt.
- Gutschein-Flow bis "Weiter zur Zahlung" durchklicken: Über den Kartenfeldern
  muss der Apple-Pay-Button stehen.
- Erscheint er nicht: in Stripe unter "Zahlungsmethoden-Domains" prüfen, ob die
  Domain als verifiziert markiert ist.
