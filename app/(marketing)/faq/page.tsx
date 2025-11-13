import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqItems = [
  {
    category: "Bestellung & Zahlung",
    questions: [
      {
        question: "Wie kann ich bestellen?",
        answer:
          "Wähle deine gewünschten Produkte aus, lege sie in den Warenkorb und folge den Checkout-Schritten. Du kannst als Gast bestellen oder dich für schnellere zukünftige Bestellungen registrieren.",
      },
      {
        question: "Welche Zahlungsmethoden akzeptiert ihr?",
        answer:
          "Wir akzeptieren Kreditkarte (Visa, Mastercard, Amex), PayPal, SEPA-Lastschrift, Sofortüberweisung und Rechnung (für Bestandskunden).",
      },
      {
        question: "Ist die Zahlung sicher?",
        answer:
          "Ja, alle Zahlungen werden über eine verschlüsselte SSL-Verbindung abgewickelt. Wir speichern keine Kreditkartendaten auf unseren Servern.",
      },
      {
        question: "Kann ich meine Bestellung stornieren?",
        answer:
          "Solange deine Bestellung noch nicht versandt wurde, kannst du sie stornieren. Kontaktiere uns umgehend per E-Mail oder Telefon.",
      },
    ],
  },
  {
    category: "Versand & Lieferung",
    questions: [
      {
        question: "Ab wann ist der Versand kostenlos?",
        answer:
          "Der Versand ist innerhalb Deutschlands ab einem Bestellwert von 50€ kostenlos. Darunter berechnen wir 4,99€.",
      },
      {
        question: "Wie lange dauert die Lieferung?",
        answer:
          "In Deutschland beträgt die Lieferzeit 2-3 Werktage. Express-Versand (24h) ist gegen Aufpreis verfügbar.",
      },
      {
        question: "Kann ich den Versandstatus verfolgen?",
        answer:
          "Ja, du erhältst eine E-Mail mit Tracking-Nummer, sobald dein Paket versandt wurde.",
      },
      {
        question: "Liefert ihr auch ins Ausland?",
        answer:
          "Ja, wir liefern in alle EU-Länder sowie in die Schweiz und nach Österreich. Die Versandkosten variieren je nach Land.",
      },
    ],
  },
  {
    category: "Produkte & Futter",
    questions: [
      {
        question: "Sind eure Produkte natürlich?",
        answer:
          "Ja, wir setzen auf 100% natürliche Zutaten ohne künstliche Zusatzstoffe, Konservierungsmittel oder Füllstoffe.",
      },
      {
        question: "Welches Futter ist für meinen Hund geeignet?",
        answer:
          "Das hängt von Alter, Größe und Gesundheitszustand ab. Nutze unsere Kategorien (Welpen, Adult, Senior) oder kontaktiere unsere Ernährungsberatung.",
      },
      {
        question: "Habt ihr auch glutenfreies Futter?",
        answer:
          "Ja, in unserer Kategorie 'Getreidefreies Futter' findest du viele Optionen ohne Getreide und Gluten.",
      },
      {
        question: "Wie lagere ich das Futter richtig?",
        answer:
          "Trockenfutter sollte kühl, trocken und verschlossen gelagert werden. Nassfutter gehört nach dem Öffnen in den Kühlschrank und sollte innerhalb von 2-3 Tagen verbraucht werden.",
      },
    ],
  },
  {
    category: "Rücksendung & Umtausch",
    questions: [
      {
        question: "Kann ich Produkte zurücksenden?",
        answer:
          "Ja, du hast ein 30-tägiges Rückgaberecht. Die Ware sollte ungeöffnet und im Originalzustand sein.",
      },
      {
        question: "Wer trägt die Rücksendekosten?",
        answer:
          "Bei Widerruf trägt der Kunde die Rücksendekosten. Bei fehlerhafter Ware übernehmen wir die Kosten.",
      },
      {
        question: "Wie bekomme ich mein Geld zurück?",
        answer:
          "Die Rückerstattung erfolgt auf das ursprüngliche Zahlungsmittel innerhalb von 14 Tagen nach Wareneingang.",
      },
      {
        question: "Was ist, wenn das Produkt beschädigt ankommt?",
        answer:
          "Bitte melde beschädigte Ware sofort mit Fotos an unseren Kundenservice. Wir senden kostenlos Ersatz oder erstatten den Kaufpreis.",
      },
    ],
  },
  {
    category: "Kundenkonto",
    questions: [
      {
        question: "Brauche ich ein Kundenkonto?",
        answer:
          "Nein, du kannst auch als Gast bestellen. Ein Konto bietet jedoch Vorteile wie schnelleres Bestellen und Bestellhistorie.",
      },
      {
        question: "Wie ändere ich mein Passwort?",
        answer:
          "Gehe zu 'Mein Konto' > 'Einstellungen' und klicke auf 'Passwort ändern'.",
      },
      {
        question: "Kann ich mehrere Lieferadressen speichern?",
        answer:
          "Ja, in deinem Konto unter 'Adressen' kannst du mehrere Adressen verwalten.",
      },
      {
        question: "Wie lösche ich mein Konto?",
        answer:
          "Gehe zu 'Einstellungen' und klicke auf 'Konto löschen'. Beachte, dass dies unwiderruflich ist.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="container max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Häufig gestellte Fragen</h1>
        <p className="text-muted-foreground">
          Hier findest du Antworten auf die häufigsten Fragen
        </p>
      </div>

      <div className="space-y-8">
        {faqItems.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((item, itemIndex) => (
                <Card key={itemIndex}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Kontakt Card */}
      <Card className="mt-12 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
              Deine Frage war nicht dabei?
            </h3>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              Unser Kundenservice hilft dir gerne weiter!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild>
                <Link href="/kontakt">Kontaktformular</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:info@elite-dog-treats.de">E-Mail senden</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:+491234567890">Anrufen</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
