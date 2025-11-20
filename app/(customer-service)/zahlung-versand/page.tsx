export default function ZahlungVersandPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Zahlung & Versand
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Zahlungsmethoden */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))]">
              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6">
                Zahlungsmethoden
              </h2>

              <div className="space-y-4">
                <div className="flex items-center p-4 border border-[hsl(var(--border))] rounded-lg">
                  <div className="text-2xl mr-4">💳</div>
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Kreditkarte
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Visa, Mastercard, American Express
                    </p>
                  </div>
                  <div className="ml-auto text-green-600">✓</div>
                </div>

                <div className="flex items-center p-4 border border-[hsl(var(--border))] rounded-lg">
                  <div className="text-2xl mr-4">📱</div>
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      PayPal
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Schnell und sicher bezahlen
                    </p>
                  </div>
                  <div className="ml-auto text-green-600">✓</div>
                </div>

                <div className="flex items-center p-4 border border-[hsl(var(--border))] rounded-lg">
                  <div className="text-2xl mr-4">🏦</div>
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Sofortüberweisung
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Echtzeit-Überweisung
                    </p>
                  </div>
                  <div className="ml-auto text-green-600">✓</div>
                </div>

                <div className="flex items-center p-4 border border-[hsl(var(--border))] rounded-lg">
                  <div className="text-2xl mr-4">📄</div>
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Rechnung
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Für Geschäftskunden (ab 500€)
                    </p>
                  </div>
                  <div className="ml-auto text-green-600">✓</div>
                </div>

                <div className="flex items-center p-4 border border-[hsl(var(--border))] rounded-lg">
                  <div className="text-2xl mr-4">💰</div>
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Nachnahme
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Barzahlung bei Lieferung
                    </p>
                  </div>
                  <div className="ml-auto text-green-600">✓</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[hsl(var(--secondary))] rounded-lg">
                <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                  Sicherheit
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Alle Zahlungen werden SSL-verschlüsselt verarbeitet. Ihre
                  Daten sind sicher.
                </p>
              </div>
            </div>

            {/* Versandoptionen */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))]">
              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6">
                Versandoptionen
              </h2>

              <div className="space-y-4">
                <div className="p-4 border border-[hsl(var(--border))] rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Standardversand
                    </h3>
                    <span className="font-bold text-[hsl(var(--primary))]">
                      €4,90
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    1-3 Werktage • Kostenlos ab €50
                  </p>
                </div>

                <div className="p-4 border border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Expressversand
                    </h3>
                    <span className="font-bold text-[hsl(var(--primary))]">
                      €9,90
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Nächster Werktag • Bis 12 Uhr bestellt
                  </p>
                </div>

                <div className="p-4 border border-[hsl(var(--border))] rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Abholung
                    </h3>
                    <span className="font-bold text-green-600">Kostenlos</span>
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    In unserem Ladengeschäft • Nach Terminvereinbarung
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  Kostenloser Versand
                </h3>
                <p className="text-sm text-green-700">
                  Bei Bestellungen über €50 liefern wir versandkostenfrei
                  innerhalb Deutschlands.
                </p>
              </div>
            </div>
          </div>

          {/* Zusätzliche Informationen */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] text-center">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Sichere Zahlung
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                SSL-verschlüsselte Zahlungsabwicklung
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] text-center">
              <div className="text-3xl mb-4">📦</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Sorgfältige Verpackung
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                Ihre Leckerlis werden frisch verpackt
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] text-center">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Sendungsverfolgung
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                Vollständige Transparenz über den Versandweg
              </p>
            </div>
          </div>

          <div className="mt-8 bg-[hsl(var(--secondary))] rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4 text-center">
              Haben Sie Fragen?
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] text-center mb-6">
              Unser Kundenservice hilft Ihnen gerne bei allen Fragen zu Zahlung
              und Versand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-3 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors font-semibold">
                Kontakt aufnehmen
              </button>
              <button className="border border-[hsl(var(--primary))] text-[hsl(var(--primary))] px-6 py-3 rounded-lg hover:bg-[hsl(var(--primary))]/10 transition-colors font-semibold">
                Live Chat starten
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
