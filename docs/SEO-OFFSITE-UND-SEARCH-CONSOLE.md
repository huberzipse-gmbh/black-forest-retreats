# Off-Site-Sichtbarkeit + Google Search Console

Die stärksten Hebel für KI-Sichtbarkeit liegen laut Recherche NICHT auf der
eigenen Website, sondern in Erwähnungen auf Drittseiten. Die Website ist
notwendig, aber nicht hinreichend.

## Off-Site-Checkliste (in dieser Reihenfolge)

1. **Google Business Profile** vollständig ausfüllen: Kategorie
   "Ferienunterkunft", echte Adresse Neuenbürg, viele echte Fotos, Amenities,
   Buchungslink auf die eigene Seite, Q&A-Bereich selbst vorbefüllen (speist auch
   KI-Antworten). Verifizierung sauber über Postkarte/Video.
2. **NAP-Konsistenz**: Name, Adresse, Telefon exakt zeichengleich auf Website
   (Impressum + Footer + Schema), GBP, Airbnb, allen Portalen und Verzeichnissen.
   Die verbindliche Fassung steht in `lib/seo/config.ts`.
3. **Bing Places** (speist Copilot und teils ChatGPT) + **Apple Business Connect**
   (iPhone-Karten/Siri).
4. **Echte Bewertungen** extern aufbauen (Google, Airbnb) - nach Check-out per
   Mail einsammeln. Für Local Pack und KI-Zusammenfassungen wichtiger als jeder
   Text auf der Seite. Nicht selbst als Schema markieren.

## Tourismus-Verzeichnisse (die wertvollsten Backlinks hier)

- **Schwarzwald Tourismus GmbH** (schwarzwald-tourismus.info) - Gastgeber-Eintrag
  im OGS-Verzeichnis, meist kostenlos über die Gemeinde/Tourist-Info.
- **Stadt Neuenbürg** (neuenbuerg.de) und **Tourist-Info Bad Wildbad/Enzkreis**
  direkt anfragen.
- **Nationalparkregion Schwarzwald** (nationalparkregion-schwarzwald.de) -
  Gastgeberverzeichnis.
- **Nationalpark-Partner-Programm** - starkes Vertrauens-/Link-Signal, an
  Nachhaltigkeitskriterien geknüpft. Neuenbürg liegt nicht direkt am Park,
  Zulässigkeit vorab klären.
- **Enzkreis / Tourismus Nordschwarzwald**, Wander-/Radportale (Enztalradweg,
  Westweg-Etappen, Outdooractive), Hunde-Portale.
- **Wikidata**-Eintrag bzw. sameAs-Verknüpfung zur Region (maschinenlesbar,
  speist Wikipedia-Kontext und LLMs).
- **KONUS-Gästekarte**, falls über die Gemeinde ausgebbar - Buchungsargument und
  Content-Thema zugleich.

---

## Google Search Console: URL-Indexierung beantragen

Damit ich die Indexierung anstoßen kann, wird Folgendes benötigt:

1. **Google-Konto** für die Property (idealerweise ein Firmenkonto, damit es
   übertragbar bleibt). Entweder Zugang, oder Sie legen die Property an und laden
   mich/den Betreiber als Nutzer ein.

2. **Domain-Verifizierung** - zwei Wege:
   - **Domain-Property (empfohlen)**: ein DNS-TXT-Record bei GoDaddy. Ich brauche
     nur den Verifizierungs-String aus der Search Console; den Record setze ich
     mit den vorhandenen GoDaddy-Credentials selbst.
   - **URL-Präfix-Property**: HTML-Datei oder Meta-Tag auf der Seite. Kann ich
     ohne Ihr Zutun deployen (rein technisch, unsichtbar).

3. **Domain live und öffentlich erreichbar.** Achtung: von Nicos Mac aus liefert
   ein Netz-Interceptor teils die GoDaddy-Parking-Seite - Verifikation immer per
   SSH am Server. Der Apex-A-Record muss auf `178.104.42.87` zeigen.

4. **Env-Variable im Deployment:** `NEXT_PUBLIC_SITE_URL=https://blackforest-retreats.de`
   in Coolify setzen. Ohne sie fällt `metadataBase` zwar auf die Produktions-
   Domain zurück (fest im Code hinterlegt), aber die Env-Variable ist die saubere
   Quelle und deckt einen späteren Domain-Wechsel ab.

5. **Sitemap einreichen** unter `https://blackforest-retreats.de/sitemap.xml`,
   plus manuelle URL-Prüfung der Kernseiten. Erwartung: "Indexierung beantragen"
   ist eine Bitte, keine Garantie; die Aufnahme dauert Tage bis Wochen.

6. **Optional: Bing Webmaster Tools** - Property per Import aus der Search Console
   anlegen, speist Copilot/ChatGPT.

---

## Offene technische Empfehlungen (separat testbar)

- **Hero-Video LCP:** Der Hero (`components/sections/HeroVideo.tsx`) ist ein
  bewusst fragil gebautes Autoplay-Konstrukt. Der Best-Practice-Feinschliff
  (`preload="none"` am Video, Poster als priorisiertes Bild) wurde NICHT
  angefasst, weil er nur mit echtem Autoplay-Test auf iOS/Safari verantwortbar
  ist. Separat angehen, wenn Core Web Vitals es zeigen.
- **`sameAs` im Organization-Schema** in `lib/seo/config.ts` befüllen, sobald
  Airbnb-/Instagram-/GBP-URLs bestätigt sind (aktuell leer gelassen, damit kein
  falscher Link gesetzt wird).
- **Objektgenaue Geo-Koordinaten:** aktuell steht die Ortsmitte Neuenbürg für
  alle Objekte. Sobald die Einzeladressen bestätigt sind, pro Objekt setzen.
