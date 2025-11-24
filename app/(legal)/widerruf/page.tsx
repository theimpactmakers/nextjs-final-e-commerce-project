export default function WiderrufPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Widerrufsrecht
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))] mb-8">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6">
              Ihr Widerrufsrecht
            </h2>

            <div className="mb-6">
              <p className="text-[hsl(var(--foreground))] mb-4">
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von
                Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt
                vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen
                benannter Dritter, der nicht der Beförderer ist, die letzte Ware
                in Besitz genommen haben bzw. hat.
              </p>

              <p className="text-[hsl(var(--foreground))] mb-4">
                Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Elite Dog
                TREATS GmbH, Musterstraße 123, 12345 Musterstadt, Deutschland,
                Telefon: +49 123 456789, E-Mail: info@elitedogtreats.de) mittels
                einer eindeutigen Erklärung (z. B. ein mit der Post versandter
                Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu
                widerrufen, informieren.
              </p>
            </div>

            <div className="bg-[hsl(var(--secondary))] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-[hsl(var(--primary))] mb-4">
                Muster-Widerrufsformular
              </h3>

              <div className="text-[hsl(var(--foreground))] space-y-2">
                <p>
                  <strong>An:</strong> Elite Dog TREATS GmbH, Musterstraße 123,
                  12345 Musterstadt, Deutschland
                </p>
                <p>
                  <strong>E-Mail:</strong> widerruf@elitedogtreats.de
                </p>
                <br />
                <p>
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
                  abgeschlossenen Vertrag über den Kauf der folgenden Waren (*):
                </p>
                <p>
                  ___________________________________________________________
                </p>
                <p>
                  Bestellt am (*)/erhalten am (*): ___________________________
                </p>
                <p>
                  Name des/der Verbraucher(s): _______________________________
                </p>
                <p>
                  Anschrift des/der Verbraucher(s): ___________________________
                </p>
                <p>
                  ___________________________________________________________
                </p>
                <p>Datum: ___________________________</p>
                <p>
                  ___________________________________________________________
                </p>
                <p>(*) Unzutreffendes streichen</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-4">
              Folgen des Widerrufs
            </h3>

            <p className="text-[hsl(var(--foreground))] mb-4">
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle
              Zahlungen, die wir von Ihnen erhalten haben, einschließlich der
              Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich
              daraus ergeben, dass Sie eine andere Art der Lieferung als die von
              uns angebotene, günstigste Standardlieferung gewählt haben),
              unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag
              zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses
              Vertrags bei uns eingegangen ist.
            </p>

            <p className="text-[hsl(var(--foreground))] mb-4">
              Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das
              Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei
              denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in
              keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte
              berechnet.
            </p>

            <p className="text-[hsl(var(--foreground))] mb-4">
              Wir können die Rückzahlung verweigern, bis wir die Waren wieder
              zurückerhalten haben oder bis Sie den Nachweis erbracht haben,
              dass Sie die Waren zurückgesandt haben, je nachdem, welches der
              frühere Zeitpunkt ist.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))] mb-8">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6">
              Ausschluss des Widerrufsrechts
            </h2>

            <p className="text-[hsl(var(--foreground))] mb-4">
              Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von
              Waren, die nicht vorgefertigt sind und für deren Herstellung eine
              individuelle Auswahl oder Bestimmung durch den Verbraucher
              maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse
              des Verbrauchers zugeschnitten sind.
            </p>

            <p className="text-[hsl(var(--foreground))] mb-4">
              Das Widerrufsrecht erlischt vorzeitig bei Verträgen zur Lieferung
              versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder
              der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre
              Versiegelung nach der Lieferung entfernt wurde.
            </p>
          </div>

          <div className="bg-[hsl(var(--secondary))] rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6 text-center">
              Noch Fragen zum Widerruf?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📞</div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-1">
                  Telefon
                </h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  +49 123 456789
                </p>
              </div>

              <div className="text-center">
                <div className="text-3xl mb-2">📧</div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-1">
                  E-Mail
                </h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  widerruf@elitedogtreats.de
                </p>
              </div>

              <div className="text-center">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-1">
                  Live Chat
                </h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Online Support
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[hsl(var(--muted-foreground))]">
                Unser Kundenservice steht Ihnen bei allen Fragen zum
                Widerrufsrecht zur Verfügung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
