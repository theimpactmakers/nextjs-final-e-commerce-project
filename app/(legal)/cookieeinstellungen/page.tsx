export default function CookieeinstellungenPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Cookie-Einstellungen
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8">
            <div className="prose prose-lg max-w-none text-[hsl(var(--foreground))]">
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
                Stand: November 2025
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                Was sind Cookies?
              </h2>
              <p className="mb-4">
                Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert
                werden, wenn Sie eine Website besuchen. Sie helfen uns, die
                Website für Sie zu optimieren und bestimmte Funktionen
                bereitzustellen.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                Welche Cookies verwenden wir?
              </h2>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Notwendige Cookies
              </h3>
              <p className="mb-4">
                Diese Cookies sind für den Betrieb der Website unbedingt
                erforderlich. Ohne diese Cookies können bestimmte Dienste nicht
                bereitgestellt werden.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Session-Cookies für die Anmeldung</li>
                <li>Warenkorb-Funktionalität</li>
                <li>Sicherheits-Cookies</li>
              </ul>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Funktionale Cookies
              </h3>
              <p className="mb-4">
                Diese Cookies ermöglichen erweiterte Funktionalität und
                Personalisierung.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Spracheinstellungen</li>
                <li>Anzeigepräferenzen</li>
                <li>Zuletzt angesehene Produkte</li>
              </ul>

              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                Analyse-Cookies
              </h3>
              <p className="mb-4">
                Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer
                Website interagieren, indem Informationen anonym gesammelt und
                gemeldet werden.
              </p>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                Ihre Cookie-Einstellungen verwalten
              </h2>
              <p className="mb-4">
                Sie können Ihre Cookie-Einstellungen jederzeit ändern. Bitte
                beachten Sie, dass das Deaktivieren bestimmter Cookies die
                Funktionalität unserer Website beeinträchtigen kann.
              </p>

              <div className="bg-[hsl(var(--muted))] p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">
                  Cookie-Präferenzen
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notwendige Cookies</h4>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Immer aktiv - können nicht deaktiviert werden
                      </p>
                    </div>
                    <div className="text-[hsl(var(--primary))]">✓ Aktiv</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Funktionale Cookies</h4>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Verbessern Ihre Nutzererfahrung
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded hover:bg-[hsl(var(--primary))]/90 transition-colors">
                      Aktivieren
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Analyse-Cookies</h4>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Helfen uns die Website zu verbessern
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded hover:bg-[hsl(var(--primary))]/90 transition-colors">
                      Aktivieren
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <button className="flex-1 px-4 py-2 bg-[hsl(var(--accent))] text-white rounded hover:bg-[hsl(var(--accent))]/90 transition-colors">
                    Alle akzeptieren
                  </button>
                  <button className="flex-1 px-4 py-2 border border-[hsl(var(--border))] rounded hover:bg-[hsl(var(--muted))] transition-colors">
                    Nur notwendige
                  </button>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                Cookies in Ihrem Browser löschen
              </h2>
              <p className="mb-4">
                Sie können Cookies auch direkt in Ihrem Browser verwalten und
                löschen. Die genauen Schritte hängen von Ihrem Browser ab:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Chrome:</strong> Einstellungen → Datenschutz und
                  Sicherheit → Cookies
                </li>
                <li>
                  <strong>Firefox:</strong> Einstellungen → Datenschutz &
                  Sicherheit → Cookies und Website-Daten
                </li>
                <li>
                  <strong>Safari:</strong> Einstellungen → Datenschutz → Cookies
                  und Website-Daten
                </li>
                <li>
                  <strong>Edge:</strong> Einstellungen → Cookies und
                  Websiteberechtigungen
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                Weitere Informationen
              </h2>
              <p className="mb-4">
                Weitere Informationen zum Datenschutz finden Sie in unserer{" "}
                <a
                  href="/datenschutz"
                  className="text-[hsl(var(--accent))] hover:underline"
                >
                  Datenschutzerklärung
                </a>
                .
              </p>

              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-8">
                Bei Fragen zu unseren Cookie-Richtlinien kontaktieren Sie uns
                bitte über unsere{" "}
                <a
                  href="/contact"
                  className="text-[hsl(var(--accent))] hover:underline"
                >
                  Kontaktseite
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
