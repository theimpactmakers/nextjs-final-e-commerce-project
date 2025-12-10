import React from 'react';

export const dynamic = 'force-static';
export const revalidate = 604800; // 7 days

export const metadata = {
  title: "Impressum | Elite Dog TREATS",
  description: "Impressum und rechtliche Informationen der Elite Dog TREATS GmbH.",
};

export default function ImpressumPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Impressum</h1>
      
      <div className="space-y-8 text-gray-700">
        {/* Angaben gemäß § 5 TMG */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Angaben gemäß § 5 TMG</h2>
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">Elite Dog TREATS GmbH</p>
            <p>Musterstraße 123</p>
            <p>12345 Berlin</p>
            <p>Deutschland</p>
          </div>
        </section>

        {/* Vertreten durch */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Vertreten durch</h2>
          <p>Geschäftsführer: Max Mustermann</p>
        </section>

        {/* Kontakt */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Kontakt</h2>
          <div className="space-y-2">
            <p>Telefon: +49 (0) 30 12345678</p>
            <p>E-Mail: info@elitedogtreats.de</p>
            <p>Webseite: www.elitedogtreats.de</p>
          </div>
        </section>

        {/* Registereintrag */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Registereintrag</h2>
          <div className="space-y-2">
            <p>Eintragung im Handelsregister</p>
            <p>Registergericht: Amtsgericht Berlin-Charlottenburg</p>
            <p>Registernummer: HRB 123456 B</p>
          </div>
        </section>

        {/* Umsatzsteuer-ID */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Umsatzsteuer-ID</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz:</p>
          <p className="font-semibold">DE123456789</p>
        </section>

        {/* EU-Streitschlichtung */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
          </p>
          <a 
            href="https://ec.europa.eu/consumers/odr/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          <p className="mt-2">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
        </section>

        {/* Verbraucherstreitbeilegung */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        {/* Verantwortlich für den Inhalt */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">Max Mustermann</p>
            <p>Musterstraße 123</p>
            <p>12345 Berlin</p>
          </div>
        </section>

        {/* Haftungsausschluss */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Haftungsausschluss</h2>
          
          <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-900">Haftung für Inhalte</h3>
          <p className="mb-4">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
            allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
            zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p className="mb-4">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
            Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt 
            der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
            Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>

          <h3 className="text-xl font-semibold mb-2 mt-6 text-gray-900">Haftung für Links</h3>
          <p className="mb-4">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
            Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der 
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
          <p className="mb-4">
            Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. 
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche 
            Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht 
            zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>

          <h3 className="text-xl font-semibold mb-2 mt-6 text-gray-900">Urheberrecht</h3>
          <p className="mb-4">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
            Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
            Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
          <p>
            Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. 
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte 
            Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem 
            auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. 
            Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </section>

        {/* Bildnachweise */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Bildnachweise</h2>
          <p>
            Die auf dieser Website verwendeten Bilder stammen aus verschiedenen Quellen und sind entsprechend 
            lizenziert oder urheberrechtlich geschützt. Detaillierte Informationen zu den Bildquellen sind auf 
            Anfrage erhältlich.
          </p>
        </section>
      </div>
    </div>
  );
}
