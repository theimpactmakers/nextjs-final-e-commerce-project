import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AGBPage() {
  return (
    <div className="container max-w-4xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        Allgemeine Geschäftsbedingungen (AGB)
      </h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>§ 1 Geltungsbereich</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle
              Bestellungen, die über den Online-Shop Elite Dog Treats getätigt
              werden. Mit der Bestellung erkennt der Kunde diese AGB
              ausdrücklich an.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>§ 2 Vertragspartner</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              Der Kaufvertrag kommt zustande mit Elite Dog Treats GmbH,
              Musterstraße 123, 12345 Musterstadt, Deutschland.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>§ 3 Vertragsschluss</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-3">
              Die Darstellung der Produkte im Online-Shop stellt kein
              rechtlich bindendes Angebot dar, sondern eine Aufforderung zur
              Bestellung.
            </p>
            <p className="text-muted-foreground">
              Durch Anklicken des Buttons "Jetzt kostenpflichtig bestellen"
              geben Sie eine verbindliche Bestellung ab. Der Kaufvertrag kommt
              zustande, wenn wir Ihre Bestellung durch eine
              Auftragsbestätigung per E-Mail annehmen.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>§ 4 Preise und Versandkosten</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-3">
              Alle Preise sind Endpreise und enthalten die gesetzliche
              Mehrwertsteuer.
            </p>
            <p className="text-muted-foreground">
              Zusätzlich zu den angegebenen Preisen berechnen wir für die
              Lieferung innerhalb Deutschlands pauschal 4,99 €. Ab einem
              Bestellwert von 50,00 € liefern wir versandkostenfrei.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>§ 5 Lieferung</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-3">
              Die Lieferung erfolgt innerhalb Deutschlands in der Regel
              innerhalb von 2-3 Werktagen nach Zahlungseingang.
            </p>
            <p className="text-muted-foreground">
              Sollte die Lieferung der Ware durch Umstände, die wir nicht zu
              vertreten haben, unmöglich werden, behalten wir uns das Recht
              vor, vom Vertrag zurückzutreten.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>§ 6 Zahlungsbedingungen</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              Die Zahlung kann per Kreditkarte, PayPal oder auf Rechnung
              erfolgen. Bei Zahlung auf Rechnung ist der Rechnungsbetrag
              innerhalb von 14 Tagen nach Erhalt der Ware ohne Abzug zu
              überweisen.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>§ 7 Widerrufsrecht</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-3">
              Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Die
              Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem Sie oder ein
              von Ihnen benannter Dritter die Waren in Besitz genommen haben.
            </p>
            <p className="text-muted-foreground">
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer
              eindeutigen Erklärung (z.B. per E-Mail) über Ihren Entschluss,
              diesen Vertrag zu widerrufen, informieren.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>§ 8 Gewährleistung</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              Es gelten die gesetzlichen Gewährleistungsrechte. Die
              Gewährleistungsfrist für Neuware beträgt zwei Jahre ab Erhalt
              der Ware.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>§ 9 Datenschutz</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              Wir verarbeiten personenbezogene Daten des Kunden nur im Rahmen
              der gesetzlichen Bestimmungen. Weitere Informationen finden Sie
              in unserer Datenschutzerklärung.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>§ 10 Schlussbestimmungen</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              Es gilt das Recht der Bundesrepublik Deutschland unter
              Ausschluss des UN-Kaufrechts. Sollten einzelne Bestimmungen
              dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit
              der übrigen Bestimmungen hiervon unberührt.
            </p>
          </CardContent>
        </Card>

        <div className="pt-6 text-sm text-muted-foreground">
          <p>Stand: November 2024</p>
        </div>
      </div>
    </div>
  );
}
