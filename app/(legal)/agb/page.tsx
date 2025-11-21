export default function AGBPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Allgemeine Geschäftsbedingungen
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))]">
            <div className="prose prose-lg max-w-none text-[hsl(var(--foreground))]">
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
                Stand: Januar 2024
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                1. Geltungsbereich
              </h2>
              <p className="mb-4">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle
                Verträge, die ein Verbraucher oder Unternehmer (nachfolgend
                „Kunde&rdquo;) mit der Elite Dog TREATS GmbH hinsichtlich der von uns
                in unserem Online-Shop dargebotenen Waren abschließt.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                2. Vertragspartner
              </h2>
              <div className="bg-[hsl(var(--secondary))] p-4 rounded-lg mb-4">
                <p>
                  <strong>Elite Dog TREATS GmbH</strong>
                  <br />
                  Musterstraße 123
                  <br />
                  12345 Musterstadt
                  <br />
                  Deutschland
                  <br />
                  Handelsregister: Amtsgericht Musterstadt, HRB 12345
                  <br />
                  Geschäftsführer: Max Mustermann
                  <br />
                  USt-ID: DE123456789
                </p>
              </div>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                3. Vertragsschluss
              </h2>
              <p className="mb-4">
                Die Präsentation der Waren in unserem Online-Shop stellt kein
                rechtlich bindendes Vertragsangebot dar, sondern eine
                unverbindliche Aufforderung zur Abgabe einer Bestellung. Mit der
                Bestellung einer Ware gibt der Kunde ein verbindliches
                Vertragsangebot ab.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                4. Preise und Zahlungsbedingungen
              </h2>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Preise
              </h3>
              <p className="mb-4">
                Die in den jeweiligen Angeboten angeführten Preise sowie die
                Versandkosten sind Endpreise. Sie beinhalten alle
                Preisbestandteile einschließlich aller anfallenden Steuern.
              </p>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Zahlungsarten
              </h3>
              <p className="mb-4">
                Der Kunde kann die Zahlung per Kreditkarte, PayPal,
                Sofortüberweisung oder Rechnung vornehmen. Wir behalten uns vor,
                einzelne Zahlungsarten auszuschließen.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                5. Lieferung und Versand
              </h2>
              <p className="mb-4">
                Die Lieferung erfolgt innerhalb Deutschlands in der Regel
                innerhalb von 1-3 Werktagen nach Zahlungseingang. Bei
                Expressversand ist eine Lieferung am nächsten Werktag möglich.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                6. Eigentumsvorbehalt
              </h2>
              <p className="mb-4">
                Die gelieferte Ware bleibt bis zur vollständigen Bezahlung unser
                Eigentum.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                7. Gewährleistung
              </h2>
              <p className="mb-4">
                Es gelten die gesetzlichen Gewährleistungsrechte. Bei Mängeln
                der Ware haben Sie das Recht auf Nacherfüllung, Rücktritt vom
                Vertrag oder Minderung.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                8. Haftung
              </h2>
              <p className="mb-4">
                Wir haften für Vorsatz und grobe Fahrlässigkeit sowie bei
                Verletzung wesentlicher Vertragspflichten. Die Haftung ist in
                jedem Fall auf den vertragstypischen, vorhersehbaren Schaden
                begrenzt.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                9. Widerrufsrecht
              </h2>
              <p className="mb-4">
                Verbrauchern steht ein Widerrufsrecht zu. Die Widerrufsfrist
                beträgt 14 Tage ab dem Tag, an dem Sie oder ein von Ihnen
                benannter Dritter die Ware in Besitz genommen haben.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                10. Datenschutz
              </h2>
              <p className="mb-4">
                Ihre Daten werden gemäß unserer Datenschutzerklärung
                verarbeitet. Diese finden Sie unter{" "}
                <a
                  href="/datenschutz"
                  className="text-[hsl(var(--primary))] hover:underline"
                >
                  Datenschutz
                </a>
                .
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                11. Schlussbestimmungen
              </h2>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Anwendbares Recht
              </h3>
              <p className="mb-4">
                Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.
              </p>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Gerichtsstand
              </h3>
              <p className="mb-4">
                Gerichtsstand ist Musterstadt, sofern der Kunde Kaufmann ist
                oder keinen allgemeinen Gerichtsstand in Deutschland hat.
              </p>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Salvatorische Klausel
              </h3>
              <p className="mb-4">
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt
                die Wirksamkeit der übrigen Bestimmungen unberührt.
              </p>

              <div className="mt-8 p-4 bg-[hsl(var(--secondary))] rounded-lg">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  <strong>Hinweis:</strong> Diese AGB wurden mit größter
                  Sorgfalt erstellt. Bei Fragen zu diesen AGB kontaktieren Sie
                  uns bitte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
