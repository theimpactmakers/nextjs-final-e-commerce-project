export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Datenschutzerklärung
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))]">
            <div className="prose prose-lg max-w-none text-[hsl(var(--foreground))]">
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
                Stand: November 2025
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                1. Datenschutz auf einen Blick
              </h2>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Allgemeine Hinweise
              </h3>
              <p className="mb-4">
                Die folgenden Hinweise geben einen einfachen Überblick darüber,
                was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
                Website besuchen. Personenbezogene Daten sind alle Daten, mit
                denen Sie persönlich identifiziert werden können.
              </p>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Datenerfassung auf dieser Website
              </h3>
              <p className="mb-4">
                <strong>
                  Wer ist verantwortlich für die Datenerfassung auf dieser
                  Website?
                </strong>
                <br />
                Die Datenverarbeitung auf dieser Website erfolgt durch den
                Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt
                „Hinweis zur verantwortlichen Stelle in dieser
                Datenschutzerklärung entnehmen.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                2. Hosting
              </h2>
              <p className="mb-4">
                Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
              </p>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Externe Hostinganbieter
              </h3>
              <p className="mb-4">
                Diese Website wird extern gehostet. Die personenbezogenen Daten,
                die auf dieser Website erfasst werden, werden auf den Servern
                des Hosters gespeichert. Hierbei kann es sich um IP-Adressen,
                Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten,
                Kontaktdaten, Namen, Websitezugriffe und sonstige Daten handeln,
                die über eine Website generiert werden.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                3. Allgemeine Hinweise und Pflichtinformationen
              </h2>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Datenschutz
              </h3>
              <p className="mb-4">
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen
                Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
                vertraulich und entsprechend den gesetzlichen
                Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Hinweis zur verantwortlichen Stelle
              </h3>
              <p className="mb-4">
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser
                Website ist:
              </p>
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
                  Telefon: +49 123 456789
                  <br />
                  E-Mail: info@elitedogtreats.de
                </p>
              </div>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                4. Datenerfassung auf dieser Website
              </h2>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Cookies
              </h3>
              <p className="mb-4">
                Unsere Internetseiten verwenden teilweise so genannte Cookies.
                Cookies richten auf Ihrem Rechner keinen Schaden an und
                enthalten keine Viren. Cookies dienen dazu, unser Angebot
                nutzerfreundlicher, effektiver und sicherer zu machen.
              </p>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Kontaktformular
              </h3>
              <p className="mb-4">
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen,
                werden Ihre Angaben aus dem Anfrageformular inklusive der von
                Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der
                Anfrage und für den Fall von Anschlussfragen bei uns
                gespeichert.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                5. Ihre Rechte
              </h2>

              <p className="mb-4">Sie haben jederzeit das Recht:</p>

              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>
                  Auskunft über Ihre bei uns gespeicherten Daten zu verlangen
                </li>
                <li>
                  Berichtigung unrichtiger personenbezogener Daten zu verlangen
                </li>
                <li>Löschung Ihrer bei uns gespeicherten Daten zu verlangen</li>
                <li>Einschränkung der Datenverarbeitung zu verlangen</li>
                <li>Widerspruch gegen die Verarbeitung einzulegen</li>
                <li>Datenübertragbarkeit zu verlangen</li>
              </ul>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                6. Kontakt
              </h2>

              <p className="mb-4">
                Bei Fragen zu dieser Datenschutzerklärung wenden Sie sich bitte
                an unsere Datenschutzbeauftragte:
              </p>

              <div className="bg-[hsl(var(--secondary))] p-4 rounded-lg">
                <p>
                  <strong>Datenschutzbeauftragte</strong>
                  <br />
                  Elite Dog TREATS GmbH
                  <br />
                  E-Mail: datenschutz@elitedogtreats.de
                  <br />
                  Telefon: +49 123 456789
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
