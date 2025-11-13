import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ZahlungVersandPage() {
  return (
    <div className="container max-w-4xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Zahlung & Versand</h1>

      <div className="space-y-6">
        {/* Zahlungsmethoden */}
        <Card>
          <CardHeader>
            <CardTitle>Zahlungsmethoden</CardTitle>
            <CardDescription>
              Wir akzeptieren folgende Zahlungsarten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <span className="text-2xl">💳</span>
              <div>
                <h3 className="font-semibold mb-1">Kreditkarte</h3>
                <p className="text-sm text-muted-foreground">
                  Visa, Mastercard, American Express - Sichere Zahlung über
                  verschlüsselte Verbindung
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <span className="text-2xl">💰</span>
              <div>
                <h3 className="font-semibold mb-1">PayPal</h3>
                <p className="text-sm text-muted-foreground">
                  Schnell und sicher mit deinem PayPal-Konto bezahlen
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <span className="text-2xl">🏦</span>
              <div>
                <h3 className="font-semibold mb-1">SEPA-Lastschrift</h3>
                <p className="text-sm text-muted-foreground">
                  Bequem per Bankeinzug bezahlen
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <span className="text-2xl">📄</span>
              <div>
                <h3 className="font-semibold mb-1">Rechnung</h3>
                <p className="text-sm text-muted-foreground">
                  Zahlung innerhalb von 14 Tagen nach Erhalt der Ware (nur für
                  Bestandskunden)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <span className="text-2xl">💶</span>
              <div>
                <h3 className="font-semibold mb-1">Sofortüberweisung</h3>
                <p className="text-sm text-muted-foreground">
                  Direkte Überweisung über dein Online-Banking
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Versandkosten */}
        <Card>
          <CardHeader>
            <CardTitle>Versandkosten</CardTitle>
            <CardDescription>
              Übersicht unserer Versandkosten nach Regionen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Region</th>
                    <th className="text-left p-3 font-semibold">
                      Bestellwert unter 50€
                    </th>
                    <th className="text-left p-3 font-semibold">
                      Bestellwert ab 50€
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">Deutschland</td>
                    <td className="p-3">4,99 €</td>
                    <td className="p-3 text-green-600 font-medium">
                      Kostenlos
                    </td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3">Österreich</td>
                    <td className="p-3">6,99 €</td>
                    <td className="p-3 text-green-600 font-medium">
                      Kostenlos
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Schweiz</td>
                    <td className="p-3">9,99 €</td>
                    <td className="p-3">4,99 €</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3">EU-Länder</td>
                    <td className="p-3">7,99 €</td>
                    <td className="p-3">3,99 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              * Alle Preise verstehen sich inklusive der gesetzlichen
              Mehrwertsteuer
            </p>
          </CardContent>
        </Card>

        {/* Lieferzeiten */}
        <Card>
          <CardHeader>
            <CardTitle>Lieferzeiten</CardTitle>
            <CardDescription>
              Wann kommt deine Bestellung an?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <h3 className="font-semibold mb-2">Standard-Versand</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Deutschland: 2-3 Werktage</li>
                  <li>• Österreich: 3-5 Werktage</li>
                  <li>• Schweiz: 4-6 Werktage</li>
                  <li>• EU-Länder: 5-7 Werktage</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-semibold mb-2">Express-Versand</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Gegen Aufpreis von 9,99 € verfügbar (nur Deutschland):
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Bestellung bis 12:00 Uhr = Versand am selben Tag</li>
                  <li>• Zustellung am nächsten Werktag</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
              <div className="flex gap-2">
                <span>ℹ️</span>
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Sendungsverfolgung
                  </p>
                  <p className="text-blue-800 dark:text-blue-200">
                    Du erhältst automatisch eine E-Mail mit der
                    Sendungsverfolgungsnummer, sobald dein Paket versendet
                    wurde.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Versandpartner */}
        <Card>
          <CardHeader>
            <CardTitle>Unsere Versandpartner</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Wir arbeiten mit folgenden zuverlässigen Versanddienstleistern
              zusammen:
            </p>
            <div className="flex gap-4 flex-wrap">
              <div className="px-6 py-3 border rounded-lg font-medium">
                DHL
              </div>
              <div className="px-6 py-3 border rounded-lg font-medium">
                DPD
              </div>
              <div className="px-6 py-3 border rounded-lg font-medium">
                Hermes
              </div>
              <div className="px-6 py-3 border rounded-lg font-medium">
                UPS
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verpackung */}
        <Card>
          <CardHeader>
            <CardTitle>Nachhaltige Verpackung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Wir legen großen Wert auf umweltfreundliche Verpackungen:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>100% recycelbare Kartons</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Plastikfreies Füllmaterial aus Papier</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Klimaneutraler Versand mit DHL GoGreen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Wiederverwendbare Versandtaschen wo möglich</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
