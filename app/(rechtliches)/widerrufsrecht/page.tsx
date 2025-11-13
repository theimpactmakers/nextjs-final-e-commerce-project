"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WiderrufsrechtPage() {
  const downloadWiderrufsformular = () => {
    const formularText = `Widerrufsformular

An
Elite Dog Treats GmbH
Musterstraße 123
12345 Musterstadt
E-Mail: widerruf@elite-dog-treats.de

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag 
über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)

Bestellt am (*)/erhalten am (*)
_______________________________

Name des/der Verbraucher(s)
_______________________________

Anschrift des/der Verbraucher(s)
_______________________________
_______________________________

Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)
_______________________________

Datum
_______________________________

(*) Unzutreffendes streichen.`;

    const blob = new Blob([formularText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Widerrufsformular.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container max-w-4xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Widerrufsrecht</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Widerrufsbelehrung</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-4">
            <h3 className="font-semibold">Widerrufsrecht</h3>
            <p className="text-muted-foreground">
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von
              Gründen diesen Vertrag zu widerrufen.
            </p>
            <p className="text-muted-foreground">
              Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie
              oder ein von Ihnen benannter Dritter, der nicht der Beförderer
              ist, die letzte Ware in Besitz genommen haben bzw. hat.
            </p>
            <p className="text-muted-foreground">
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Elite Dog
              Treats GmbH, Musterstraße 123, 12345 Musterstadt, E-Mail:
              widerruf@elite-dog-treats.de) mittels einer eindeutigen
              Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail)
              über Ihren Entschluss, diesen Vertrag zu widerrufen,
              informieren.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Widerrufsfolgen</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-4">
            <p className="text-muted-foreground">
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle
              Zahlungen, die wir von Ihnen erhalten haben, einschließlich der
              Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich
              daraus ergeben, dass Sie eine andere Art der Lieferung als die
              von uns angebotene, günstigste Standardlieferung gewählt haben),
              unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag
              zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses
              Vertrags bei uns eingegangen ist.
            </p>
            <p className="text-muted-foreground">
              Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das
              Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei
              denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in
              keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte
              berechnet.
            </p>
            <p className="text-muted-foreground">
              Wir können die Rückzahlung verweigern, bis wir die Waren wieder
              zurückerhalten haben oder bis Sie den Nachweis erbracht haben,
              dass Sie die Waren zurückgesandt haben, je nachdem, welches der
              frühere Zeitpunkt ist.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rücksendung der Ware</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-4">
            <p className="text-muted-foreground">
              Sie haben die Waren unverzüglich und in jedem Fall spätestens
              binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den
              Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder
              zu übergeben.
            </p>
            <p className="text-muted-foreground">
              Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist
              von vierzehn Tagen absenden.
            </p>
            <p className="text-muted-foreground font-semibold">
              Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
            </p>
            <p className="text-muted-foreground">
              Sie müssen für einen etwaigen Wertverlust der Waren nur
              aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der
              Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht
              notwendigen Umgang mit ihnen zurückzuführen ist.
            </p>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Rücksendeanschrift:
              </h4>
              <p className="text-blue-800 dark:text-blue-200">
                Elite Dog Treats GmbH
                <br />
                Retouren-Abteilung
                <br />
                Musterstraße 123
                <br />
                12345 Musterstadt
                <br />
                Deutschland
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Muster-Widerrufsformular</CardTitle>
            <CardDescription>
              Sie können dieses Formular verwenden, sind aber nicht dazu
              verpflichtet
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="bg-muted p-6 rounded-lg font-mono text-sm">
              <p className="mb-4">An</p>
              <p className="mb-4">
                Elite Dog Treats GmbH
                <br />
                Musterstraße 123
                <br />
                12345 Musterstadt
                <br />
                E-Mail: widerruf@elite-dog-treats.de
              </p>
              <p className="mb-4">
                Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
                abgeschlossenen Vertrag über den Kauf der folgenden Waren
                (*)/die Erbringung der folgenden Dienstleistung (*)
              </p>
              <p className="mb-4">
                Bestellt am (*)/erhalten am (*)
                <br />
                Name des/der Verbraucher(s)
                <br />
                Anschrift des/der Verbraucher(s)
                <br />
                Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf
                Papier)
                <br />
                Datum
              </p>
              <p className="text-xs mt-4">(*) Unzutreffendes streichen.</p>
            </div>
            <div className="mt-4">
              <Button onClick={downloadWiderrufsformular} variant="outline">
                📥 Formular herunterladen
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ausschluss des Widerrufsrechts</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-3">
              Das Widerrufsrecht besteht nicht bei Verträgen:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                • zur Lieferung von Waren, die nicht vorgefertigt sind und für
                deren Herstellung eine individuelle Auswahl oder Bestimmung
                durch den Verbraucher maßgeblich ist
              </li>
              <li>
                • zur Lieferung von Waren, die schnell verderben können oder
                deren Verfallsdatum schnell überschritten würde
              </li>
              <li>
                • zur Lieferung versiegelter Waren, die aus Gründen des
                Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe
                geeignet sind, wenn ihre Versiegelung nach der Lieferung
                entfernt wurde
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="pt-6">
          <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <span className="text-2xl">💚</span>
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Kundenservice
                  </h3>
                  <p className="text-green-800 dark:text-green-200 text-sm mb-3">
                    Bei Fragen zu Ihrem Widerrufsrecht oder zur Rücksendung
                    helfen wir Ihnen gerne weiter.
                  </p>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    📧 widerruf@elite-dog-treats.de
                    <br />
                    📞 +49 123 456 7890
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center pt-6">
          <Link
            href="/shop"
            className="text-primary hover:underline font-medium"
          >
            ← Zurück zum Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
