import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung · Black Forest Retreats",
  description:
    "Widerrufsrecht beim Kauf von Gutscheinen sowie Hinweise zum Ausschluss des Widerrufsrechts bei Beherbergungsleistungen.",
};

// Zwei Fälle, die auseinandergehalten werden müssen:
// - Beherbergung zu einem bestimmten Zeitraum → kein Widerrufsrecht
//   (§ 312g Abs. 2 Nr. 9 BGB). Es gelten die Stornobedingungen der AGB.
// - Gutscheinkauf → die Bereichsausnahme greift NICHT, hier besteht das
//   gesetzliche 14-tägige Widerrufsrecht.

export default function WiderrufPage() {
  return (
    <LegalLayout title="Widerrufsbelehrung" updated="Juli 2026">
      <p>
        Diese Belehrung gilt für Verbraucher. Verbraucher ist jede natürliche
        Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder
        ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet
        werden können (§ 13 BGB).
      </p>

      <h2>1. Kein Widerrufsrecht bei Buchung einer Unterkunft</h2>
      <p>
        Bei Verträgen über die Bereitstellung von Beherbergungsleistungen zu einem
        bestimmten Termin oder Zeitraum besteht nach § 312g Abs. 2 Nr. 9 BGB kein
        gesetzliches Widerrufsrecht. Für die Buchung einer unserer Unterkünfte gelten
        daher ausschließlich die in unseren Allgemeinen Geschäftsbedingungen
        vereinbarten Stornierungsbedingungen.
      </p>

      <h2>2. Widerrufsrecht beim Kauf von Gutscheinen</h2>
      <p>
        Für den Kauf von Gutscheinen über diese Website steht Ihnen ein gesetzliches
        Widerrufsrecht zu.
      </p>

      <h3>Widerrufsrecht</h3>
      <p>
        Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen
        Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des
        Vertragsschlusses.
      </p>
      <p>
        Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
      </p>
      <p>
        <strong>Axiecentro Germany GmbH</strong>
        <br />
        Hockenheimer Straße 6
        <br />
        68723 Oftersheim
        <br />
        Deutschland
        <br />
        Telefon: <a href="tel:+491603756052">+49 160 3756052</a>
        <br />
        E-Mail:{" "}
        <a href="mailto:blackforestretreats@gmail.com">
          blackforestretreats@gmail.com
        </a>
      </p>
      <p>
        mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief
        oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen,
        informieren. Sie können dafür das unten stehende Muster-Widerrufsformular
        verwenden, das jedoch nicht vorgeschrieben ist.
      </p>
      <p>
        Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die
        Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
      </p>

      <h3>Folgen des Widerrufs</h3>
      <p>
        Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von
        Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der
        zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der
        Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt
        haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag
        zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei
        uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe
        Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es
        sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall
        werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
      </p>

      <h3>Vorzeitiges Erlöschen des Widerrufsrechts</h3>
      <p>
        Das Widerrufsrecht erlischt vorzeitig, wenn der Gutschein bereits vollständig
        eingelöst wurde und Sie vor Beginn der Ausführung ausdrücklich zugestimmt
        haben, dass wir mit der Ausführung beginnen, und Sie Ihre Kenntnis davon
        bestätigt haben, dass Sie durch die vollständige Vertragserfüllung Ihr
        Widerrufsrecht verlieren.
      </p>

      <h2>3. Muster-Widerrufsformular</h2>
      <p>
        Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus
        und senden Sie es zurück.
      </p>
      <ul>
        <li>
          An: Axiecentro Germany GmbH, Hockenheimer Straße 6, 68723 Oftersheim,
          Deutschland, E-Mail: blackforestretreats@gmail.com
        </li>
        <li>
          Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über den
          Kauf des folgenden Gutscheins:
        </li>
        <li>Bestellt am / erhalten am:</li>
        <li>Name des/der Verbraucher(s):</li>
        <li>Anschrift des/der Verbraucher(s):</li>
        <li>
          Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
        </li>
        <li>Datum:</li>
      </ul>
    </LegalLayout>
  );
}
