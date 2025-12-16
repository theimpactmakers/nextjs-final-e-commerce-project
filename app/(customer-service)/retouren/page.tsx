export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

export default function RetourenPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Retouren & Rückgabe
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl text-center font-bold text-primary mb-16">
              Einfache Rückgabe innerhalb von 30 Tagen!
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-4">
                  Rückgaberecht für Verbraucher
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] mb-4">
                  Als Verbraucher haben Sie das Recht, binnen 30 Tagen ohne
                  Angabe von Gründen diesen Vertrag zu widerrufen. Die
                  Widerrufsfrist beträgt 30 Tage ab dem Tag, an dem Sie oder ein
                  von Ihnen benannter Dritter die Ware in Besitz genommen haben.
                </p>

                <div className="border border-accent bg-accent/10 rounded-lg p-4">
                  <h4 className="font-semibold text-accent mb-2">
                    Kostenlose Rückgabe
                  </h4>
                  <p className="text-sm text-accent">
                    Rücksendungen innerhalb Deutschlands sind für Sie kostenlos.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-4">
                  Wie funktioniert die Rückgabe?
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-[hsl(var(--muted-foreground))]">
                  <li>Kontaktieren Sie unseren Kundenservice</li>
                  <li>Erhalten Sie ein kostenloses Rücksendeetikett</li>
                  <li>Verpacken Sie die Ware sicher</li>
                  <li>Geben Sie das Paket bei der Post ab</li>
                  <li>
                    Erhalten Sie Ihre Rückerstattung innerhalb von 5-7 Tagen
                  </li>
                </ol>
              </div>
            </div>

            <div className="border-t border-primary pt-6">
              <h3 className="text-xl font-semibold text-[hsl(var(--muted-foreground))] mb-4">
                Rücksendebedingungen
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3 mt-2"></span>
                    <span className="text-[hsl(var(--muted-foreground))]">
                      Ware muss unbenutzt und in Originalverpackung sein
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3 mt-2"></span>
                    <span className="text-[hsl(var(--muted-foreground))]">
                      Alle Etiketten und Siegel müssen intakt sein
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3 mt-2"></span>
                    <span className="text-[hsl(var(--muted-foreground))]">
                      Rücksendung innerhalb von 30 Tagen
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3 mt-2"></span>
                    <span className="text-[hsl(var(--muted-foreground))]">
                      Keine Rückgabe bei beschädigter Originalverpackung
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3 mt-2"></span>
                    <span className="text-[hsl(var(--muted-foreground))]">
                      Keine Rückgabe bei geöffneten Lebensmitteln aus
                      Hygienegründen
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-accent rounded-full mr-3 mt-2"></span>
                    <span className="text-[hsl(var(--muted-foreground))]">
                      Keine Rückgabe nach 30 Tagen
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-16">
            <div className="bg-white rounded-lg shadow-md p-6 border border-accent text-center">
              <div className="text-3xl mb-4">📞</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Telefon
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] mb-4">
                +49 123 456789
              </p>
              <p className="text-sm text-primary">
                Mo-Fr: 9:00 - 18:00 Uhr
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-accent text-center">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                E-Mail
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] mb-4">
                retouren@elitedogtreats.de
              </p>
              <p className="text-sm text-primary">
                Antwort innerhalb 24h
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-accent text-center">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Live Chat
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] mb-4">
                Online Support
              </p>
              <p className="text-sm text-primary">
                Täglich 10:00 - 18:00 Uhr
              </p>
            </div>
          </div>

          <div className="bg-[hsl(var(--secondary))] rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-8 text-center">
              Rückerstattung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-primary mb-2">
                  Wie erfolgt die Rückerstattung?
                </h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Nach Erhalt und Prüfung der retournierten Ware erfolgt die
                  Rückerstattung automatisch auf die ursprüngliche
                  Zahlungsmethode. Bei Kreditkartenzahlung kann es 3-5 Werktage
                  dauern, bis der Betrag auf Ihrem Konto erscheint.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-2">
                  Bearbeitungszeit
                </h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Die Bearbeitung Ihrer Rücksendung nimmt in der Regel 5-7
                  Werktage in Anspruch. In der Vorweihnachtszeit kann es zu
                  längeren Bearbeitungszeiten kommen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
