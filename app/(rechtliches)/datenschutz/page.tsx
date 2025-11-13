import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DatenschutzPage() {
  return (
    <div className="container max-w-4xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Datenschutzerklärung</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Datenschutz auf einen Blick</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-3">
            <h3 className="font-semibold">Allgemeine Hinweise</h3>
            <p className="text-muted-foreground">
              Die folgenden Hinweise geben einen einfachen Überblick darüber,
              was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
              Website besuchen. Personenbezogene Daten sind alle Daten, mit
              denen Sie persönlich identifiziert werden können.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Verantwortliche Stelle</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-3">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p className="text-muted-foreground">
              Elite Dog Treats GmbH
              <br />
              Musterstraße 123
              <br />
              12345 Musterstadt
              <br />
              Deutschland
              <br />
              <br />
              E-Mail: datenschutz@elite-dog-treats.de
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Datenerfassung auf dieser Website</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-3">
            <h3 className="font-semibold">Cookies</h3>
            <p className="text-muted-foreground">
              Unsere Internetseiten verwenden Cookies. Cookies sind kleine
              Textdateien, die auf Ihrem Endgerät gespeichert werden und die
              Ihr Browser speichert. Sie richten keinen Schaden an.
            </p>

            <h3 className="font-semibold mt-4">Server-Log-Dateien</h3>
            <p className="text-muted-foreground">
              Der Provider der Seiten erhebt und speichert automatisch
              Informationen in sogenannten Server-Log-Dateien, die Ihr Browser
              automatisch an uns übermittelt.
            </p>

            <h3 className="font-semibold mt-4">Kontaktformular</h3>
            <p className="text-muted-foreground">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden
              Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort
              angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für
              den Fall von Anschlussfragen bei uns gespeichert.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Bestelldaten</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              Wenn Sie bei uns bestellen, speichern wir folgende Daten:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Name und Anschrift</li>
              <li>E-Mail-Adresse</li>
              <li>Zahlungsinformationen</li>
              <li>Bestellhistorie</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Diese Daten werden ausschließlich zur Abwicklung Ihrer Bestellung
              verwendet und nach Ablauf der gesetzlichen Aufbewahrungsfristen
              gelöscht.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Ihre Rechte</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-2">
              Sie haben jederzeit das Recht:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Auskunft über Ihre bei uns gespeicherten Daten zu erhalten</li>
              <li>Berichtigung unrichtiger Daten zu verlangen</li>
              <li>Löschung Ihrer Daten zu verlangen</li>
              <li>Einschränkung der Datenverarbeitung zu verlangen</li>
              <li>Widerspruch gegen die Verarbeitung einzulegen</li>
              <li>Datenübertragbarkeit zu fordern</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Zahlungsdienstleister</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              Wir setzen externe Zahlungsdienstleister ein, über deren
              Plattformen die Nutzer und wir Zahlungstransaktionen vornehmen
              können. Die Datenschutzerklärungen der jeweiligen
              Zahlungsdienstleister finden Sie auf deren Websites.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. SSL-Verschlüsselung</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
              Übertragung vertraulicher Inhalte eine SSL-Verschlüsselung. Eine
              verschlüsselte Verbindung erkennen Sie daran, dass die
              Adresszeile des Browsers von "http://" auf "https://" wechselt.
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
