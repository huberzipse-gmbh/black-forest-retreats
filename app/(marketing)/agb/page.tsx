import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/legal/LegalLayout";

export const metadata: Metadata = {
  title: "AGB · Black Forest Retreats",
  description:
    "Allgemeine Geschäftsbedingungen der Axiecentro Germany GmbH für die Vermietung von Ferienunterkünften und die Nutzung der Website.",
};

// HINWEIS: Die in § 5 und § 6 genannten Prozentsätze/Fristen (Anzahlung,
// Restzahlung, Stornostaffel) sind kaufmännische Festlegungen und können an
// das tatsächliche Geschäftsmodell angepasst werden. Die rechtlich relevanten
// Pflicht-Klauseln (Nachweis geringerer Aufwendungen, Haftungsbegrenzung, kein
// Widerrufsrecht) sollten unverändert bleiben.

export default function AgbPage() {
  return (
    <LegalLayout
      title="Allgemeine Geschäftsbedingungen"
      updated="Juli 2026"
    >
      <h2>§ 1 Geltungsbereich, Vertragspartner</h2>
      <p>
        (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für
        die Vermietung von Ferienunterkünften (nachfolgend „Unterkunft") durch die
      </p>
      <p>
        <strong>Axiecentro Germany GmbH</strong>, Hockenheimer Straße 6, 68723
        Oftersheim (nachfolgend „Vermieterin"), sowie für die Nutzung der unter der
        Marke „Black Forest Retreats" betriebenen Website.
      </p>
      <p>
        (2) Die AGB gelten gegenüber Verbrauchern (§ 13 BGB) und Unternehmern (§ 14
        BGB). Vertragspartner der Gäste (nachfolgend „Gast") ist ausschließlich die
        Vermieterin.
      </p>
      <p>
        (3) Abweichende, entgegenstehende oder ergänzende Allgemeine
        Geschäftsbedingungen des Gastes werden nicht Vertragsbestandteil, es sei
        denn, die Vermieterin stimmt ihrer Geltung ausdrücklich in Textform zu.
      </p>

      <h2>§ 2 Vertragsschluss</h2>
      <p>
        (1) Die Darstellung der Unterkünfte auf der Website stellt kein rechtlich
        bindendes Angebot, sondern eine unverbindliche Aufforderung zur Abgabe einer
        Buchungsanfrage dar.
      </p>
      <p>
        (2) Mit Absenden der Buchungsanfrage gibt der Gast ein verbindliches Angebot
        auf Abschluss eines Mietvertrags über die Unterkunft ab. Der Vertrag kommt
        erst mit der Buchungsbestätigung der Vermieterin in Textform (z. B. per
        E-Mail) zustande.
      </p>
      <p>
        (3) Erfolgt die Buchung über eine Vermittlungsplattform (z. B. Airbnb),
        gelten ergänzend die jeweiligen Bedingungen der Plattform; im Verhältnis zur
        Vermieterin gelten diese AGB, soweit zulässig.
      </p>

      <h2>§ 3 Leistungen, keine Pauschalreise</h2>
      <p>
        (1) Geschuldet ist die zeitweise Überlassung der gebuchten Unterkunft zu
        Beherbergungszwecken nebst der in der Buchungsbestätigung bezeichneten
        Ausstattung und Nebenleistungen. Ein bestimmter Ausblick, bestimmte
        Witterungsverhältnisse oder die Verfügbarkeit von Angeboten Dritter in der
        Umgebung werden nicht geschuldet.
      </p>
      <p>
        (2) Gegenstand des Vertrags ist allein die Beherbergung. Es handelt sich
        nicht um eine Pauschalreise im Sinne der §§ 651a ff. BGB; pauschalreise- und
        reisevermittlungsrechtliche Vorschriften finden keine Anwendung.
      </p>

      <h2>§ 4 Preise, Nebenkosten, Kurtaxe</h2>
      <p>
        (1) Es gelten die zum Zeitpunkt der Buchung auf der Website bzw. in der
        Buchungsbestätigung angegebenen Preise. Die Preise verstehen sich inklusive
        der gesetzlichen Umsatzsteuer.
      </p>
      <p>
        (2) Etwaige Nebenkosten (z. B. Endreinigung, Bettwäsche) werden gesondert
        ausgewiesen. Eine gegebenenfalls anfallende Kurtaxe oder Gästetaxe ist vom
        Gast nach Maßgabe der jeweiligen kommunalen Satzung zu tragen.
      </p>

      <h2>§ 5 Zahlung, Kaution, Verzug</h2>
      <p>
        (1) Erfolgt die Buchung über eine Vermittlungsplattform (z. B. Airbnb),
        richten sich Zeitpunkt, Höhe und Abwicklung der Zahlung ausschließlich nach
        den Vorgaben und dem Bezahlsystem der jeweiligen Plattform.
      </p>
      <p>
        (2) Bei Direktbuchungen über die Vermieterin gilt, sofern in der
        Buchungsbestätigung nichts Abweichendes vereinbart ist: Innerhalb von sieben
        Tagen nach Vertragsschluss ist eine Anzahlung in Höhe von 20 % des
        Gesamtpreises zu leisten. Der Restbetrag ist spätestens 14 Tage vor dem
        Anreisetag fällig. Bei kurzfristigen Buchungen (weniger als 14 Tage vor
        Anreise) ist der Gesamtbetrag sofort fällig.
      </p>
      <p>
        (3) Die Vermieterin ist berechtigt, eine angemessene Kaution zu verlangen.
        Die Kaution wird nach ordnungsgemäßer Rückgabe der Unterkunft und nach Abzug
        etwaiger berechtigter Forderungen unverzüglich zurückerstattet.
      </p>
      <p>
        (4) Kommt der Gast mit einer Zahlung in Verzug, ist die Vermieterin nach
        erfolglosem Ablauf einer angemessenen Frist berechtigt, vom Vertrag
        zurückzutreten und die Unterkunft anderweitig zu vergeben; § 6 gilt
        entsprechend.
      </p>

      <h2>§ 6 Rücktritt des Gastes, Stornierung, Nichtanreise</h2>
      <p>
        (1) Bei Buchungen über eine Vermittlungsplattform (z. B. Airbnb) gelten
        ausschließlich die dem Gast bei der Buchung angezeigten und von ihm
        akzeptierten Stornierungsbedingungen der jeweiligen Plattform. Diese gehen den
        nachfolgenden Absätzen vor.
      </p>
      <p>
        (2) Für Direktbuchungen über die Vermieterin kann der Gast jederzeit vor
        Anreise in Textform vom Vertrag zurücktreten; maßgeblich ist der Zugang der
        Erklärung bei der Vermieterin. Es gilt folgende Stornierungsregelung:
      </p>
      <ul>
        <li>
          bis 30 Tage vor Anreise: kostenfreie Stornierung (volle Rückerstattung
          bereits geleisteter Zahlungen),
        </li>
        <li>29 bis 14 Tage vor Anreise: 50 % des Gesamtpreises,</li>
        <li>
          13 bis 0 Tage vor Anreise sowie bei Nichtanreise (No-Show): 90 % des
          Gesamtpreises.
        </li>
      </ul>
      <p>
        (3) Die Vermieterin muss sich den Wert ersparter Aufwendungen sowie
        Einnahmen aus einer anderweitigen Vermietung der Unterkunft anrechnen lassen.
        Dem Gast bleibt der Nachweis ausdrücklich vorbehalten, dass der Vermieterin
        kein oder ein wesentlich geringerer Schaden entstanden ist. Der Gast ist
        zudem berechtigt, einen geeigneten Ersatzgast zu stellen; die Vermieterin kann
        der Person aus sachlichem Grund widersprechen.
      </p>

      <h2>§ 7 Rücktritt der Vermieterin</h2>
      <p>
        Die Vermieterin kann vom Vertrag zurücktreten, wenn der Gast trotz
        angemessener Fristsetzung mit der Zahlung in Verzug ist, wenn die Unterkunft
        infolge höherer Gewalt oder aus anderen, von der Vermieterin nicht zu
        vertretenden Umständen nicht zur Verfügung steht, oder wenn die Buchung unter
        Angabe irreführender oder falscher Angaben (z. B. zur Personenzahl oder zum
        Aufenthaltszweck) erfolgte. Bereits geleistete Zahlungen werden in diesen
        Fällen, soweit kein Anspruch der Vermieterin besteht, unverzüglich
        erstattet; weitergehende Ansprüche des Gastes sind ausgeschlossen, soweit die
        Vermieterin den Rücktrittsgrund nicht zu vertreten hat.
      </p>

      <h2>§ 8 Widerrufsrecht</h2>
      <p>
        (1) Bei Verträgen über die Bereitstellung von Beherbergungsleistungen zu einem
        bestimmten Termin oder Zeitraum besteht gemäß § 312g Abs. 2 Nr. 9 BGB kein
        gesetzliches Widerrufsrecht. Für Buchungen gelten ausschließlich die
        Stornierungsregelungen nach § 6 dieser AGB.
      </p>
      <p>
        (2) Beim Kauf von Gutscheinen (§ 16) steht Verbrauchern dagegen ein
        gesetzliches Widerrufsrecht von vierzehn Tagen zu. Einzelheiten und das
        Muster-Widerrufsformular finden Sie in unserer{" "}
        <a href="/widerruf">Widerrufsbelehrung</a>.
      </p>

      <h2>§ 9 An- und Abreise, Schlüssel</h2>
      <p>
        (1) Die Unterkunft steht dem Gast am Anreisetag ab der in der
        Buchungsbestätigung genannten Uhrzeit zur Verfügung und ist am Abreisetag bis
        zur dort genannten Uhrzeit geräumt und besenrein zu übergeben.
      </p>
      <p>
        (2) Erfolgt der Zugang über eine Schlüsselbox oder ein vergleichbares System,
        ist der Gast verpflichtet, die Zugangsdaten vertraulich zu behandeln und den
        Schlüssel ordnungsgemäß zurückzugeben. Für den Verlust von Schlüsseln oder
        Zugangsmitteln haftet der Gast nach den gesetzlichen Bestimmungen.
      </p>

      <h2>§ 10 Pflichten des Gastes, Hausordnung</h2>
      <p>
        (1) Die Unterkunft darf nur mit der in der Buchungsbestätigung angegebenen
        Personenzahl belegt werden. Eine Überbelegung sowie die entgeltliche oder
        unentgeltliche Überlassung an Dritte sind ohne vorherige Zustimmung der
        Vermieterin nicht gestattet.
      </p>
      <p>
        (2) Der Gast verpflichtet sich, die Unterkunft pfleglich zu behandeln,
        bestehende Hausordnungen einzuhalten sowie auf die Nachtruhe und die übrigen
        Hausbewohner Rücksicht zu nehmen. Das Rauchen ist in den Innenräumen
        untersagt. Die Mitnahme von Haustieren bedarf der vorherigen Zustimmung der
        Vermieterin.
      </p>

      <h2>§ 11 Haftung des Gastes</h2>
      <p>
        Der Gast haftet für während des Aufenthalts durch ihn, seine
        Mitreisenden oder Besucher schuldhaft verursachte Schäden an der Unterkunft,
        am Inventar oder an gemeinschaftlich genutzten Einrichtungen nach den
        gesetzlichen Bestimmungen. Der Gast ist verpflichtet, Schäden unverzüglich
        anzuzeigen.
      </p>

      <h2>§ 12 Haftung der Vermieterin</h2>
      <p>
        (1) Die Vermieterin haftet uneingeschränkt für Schäden aus der Verletzung des
        Lebens, des Körpers oder der Gesundheit, die auf einer fahrlässigen oder
        vorsätzlichen Pflichtverletzung beruhen, sowie für sonstige Schäden, die auf
        einer vorsätzlichen oder grob fahrlässigen Pflichtverletzung beruhen.
      </p>
      <p>
        (2) Bei einer lediglich leicht fahrlässigen Verletzung einer wesentlichen
        Vertragspflicht (Kardinalpflicht), deren Erfüllung die ordnungsgemäße
        Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung
        der Gast regelmäßig vertrauen darf, ist die Haftung der Vermieterin auf den
        bei Vertragsschluss vorhersehbaren, vertragstypischen Schaden begrenzt.
      </p>
      <p>
        (3) Im Übrigen ist die Haftung der Vermieterin, gleich aus welchem
        Rechtsgrund, ausgeschlossen. Dies gilt insbesondere für leicht fahrlässige
        Pflichtverletzungen, die keine wesentlichen Vertragspflichten betreffen.
      </p>
      <p>
        (4) Die vorstehenden Haftungsbeschränkungen gelten nicht, soweit die
        Vermieterin einen Mangel arglistig verschwiegen oder eine Garantie für die
        Beschaffenheit übernommen hat, sowie für Ansprüche nach dem
        Produkthaftungsgesetz. Sie gelten auch zugunsten der gesetzlichen Vertreter,
        Mitarbeiter und Erfüllungsgehilfen der Vermieterin.
      </p>
      <p>
        (5) Für die vom Gast eingebrachten Sachen wird keine Haftung übernommen,
        soweit nicht die vorstehenden Absätze (1) und (2) eingreifen. Ein etwaiger
        Stellplatz oder Parkplatz wird ohne Bewachung und ohne Abschluss eines
        Verwahrungsvertrags überlassen; für Beschädigung oder Verlust abgestellter
        Fahrzeuge und deren Inhalt haftet die Vermieterin nur nach Maßgabe der
        Absätze (1) bis (4).
      </p>

      <h2>§ 13 Höhere Gewalt</h2>
      <p>
        Ereignisse höherer Gewalt, die der Vermieterin die Leistung wesentlich
        erschweren oder unmöglich machen (z. B. Naturkatastrophen, behördliche
        Anordnungen, Energieausfälle), hat die Vermieterin nicht zu vertreten. In
        diesen Fällen sind beide Vertragsparteien berechtigt, vom Vertrag
        zurückzutreten; bereits erbrachte Zahlungen ohne erbrachte Gegenleistung
        werden erstattet, weitergehende Ansprüche bestehen nicht.
      </p>

      <h2>§ 14 Mängel, Obliegenheiten des Gastes</h2>
      <p>
        Auftretende Mängel oder Störungen hat der Gast der Vermieterin unverzüglich
        anzuzeigen und ihr Gelegenheit zur Abhilfe innerhalb angemessener Frist zu
        geben. Unterlässt der Gast die unverzügliche Anzeige schuldhaft, so treten
        Ansprüche des Gastes insoweit nicht ein, als die Vermieterin infolge der
        unterbliebenen Anzeige keine Abhilfe schaffen konnte.
      </p>

      <h2>§ 15 Datenschutz</h2>
      <p>
        Die Vermieterin verarbeitet personenbezogene Daten des Gastes ausschließlich
        im Rahmen der geltenden datenschutzrechtlichen Bestimmungen. Einzelheiten
        ergeben sich aus unserer{" "}
        <a href="/datenschutz">Datenschutzerklärung</a>.
      </p>

      <h2>§ 16 Gutscheine</h2>
      <p>
        (1) Über die Website können Gutscheine über einen frei wählbaren Betrag
        erworben werden. Der Vertrag über den Kauf eines Gutscheins kommt mit der
        Bestätigung der Vermieterin in Textform zustande; der Gutschein wird nach
        vollständigem Zahlungseingang ausgestellt und per E-Mail zugestellt.
      </p>
      <p>
        (2) Gutscheine sind drei Jahre ab Ausstellung gültig. Die Frist beginnt mit
        dem Tag der Zahlung. Nach Ablauf der Gültigkeit kann der Gutschein nicht mehr
        eingelöst werden; gesetzliche Ansprüche des Inhabers bleiben unberührt.
      </p>
      <p>
        (3) Gutscheine sind übertragbar und werden auf den Preis einer Buchung
        angerechnet. Eine Barauszahlung des Gutscheinwerts oder eines Restbetrags ist
        ausgeschlossen. Übersteigt der Buchungsbetrag den Gutscheinwert, ist die
        Differenz vom Gast zu zahlen.
      </p>
      <p>
        (4) Ein Gutschein begründet keinen Anspruch auf Verfügbarkeit einer bestimmten
        Unterkunft zu einem bestimmten Zeitraum. Die Einlösung setzt eine reguläre
        Buchung nach diesen AGB voraus.
      </p>
      <p>
        (5) Verbraucher haben beim Kauf eines Gutscheins ein vierzehntägiges
        Widerrufsrecht nach § 8 Abs. 2 dieser AGB. Näheres regelt die{" "}
        <a href="/widerruf">Widerrufsbelehrung</a>.
      </p>

      <h2>§ 17 Schlussbestimmungen</h2>
      <p>
        (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
        UN-Kaufrechts (CISG). Zwingende verbraucherschützende Vorschriften des
        Staates, in dem der Gast als Verbraucher seinen gewöhnlichen Aufenthalt hat,
        bleiben unberührt.
      </p>
      <p>
        (2) Ist der Gast Kaufmann, juristische Person des öffentlichen Rechts oder
        öffentlich-rechtliches Sondervermögen oder hat er keinen allgemeinen
        Gerichtsstand in Deutschland, ist ausschließlicher Gerichtsstand für alle
        Streitigkeiten aus dem Vertragsverhältnis der Sitz der Vermieterin.
      </p>
      <p>
        (3) Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam
        sein oder werden, so wird hierdurch die Wirksamkeit der übrigen Bestimmungen
        nicht berührt. An die Stelle der unwirksamen Bestimmung tritt die gesetzliche
        Regelung.
      </p>
      <p>
        (4) Änderungen und Ergänzungen des Vertrags oder dieser AGB bedürfen der
        Textform.
      </p>
    </LegalLayout>
  );
}
