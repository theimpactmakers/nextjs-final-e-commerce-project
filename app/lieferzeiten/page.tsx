export default function LieferzeitenPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Lieferzeiten
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))] mb-8">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6">
              Schnelle und zuverlässige Lieferung
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-4">
                  Deutschland
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[hsl(var(--secondary))] rounded-lg">
                    <span className="font-medium text-[hsl(var(--foreground))]">
                      Standardversand
                    </span>
                    <span className="font-bold text-[hsl(var(--primary))]">
                      1-3 Werktage
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[hsl(var(--accent))]/10 border-2 border-[hsl(var(--accent))] rounded-lg">
                    <span className="font-medium text-[hsl(var(--foreground))]">
                      Expressversand
                    </span>
                    <span className="font-bold text-[hsl(var(--primary))]">
                      Nächster Werktag*
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="font-medium text-[hsl(var(--foreground))]">
                      Abholung im Laden
                    </span>
                    <span className="font-bold text-green-600">
                      Nach Vereinbarung
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-4">
                  Europa
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[hsl(var(--secondary))] rounded-lg">
                    <span className="font-medium text-[hsl(var(--foreground))]">
                      Österreich & Niederlande
                    </span>
                    <span className="font-bold text-[hsl(var(--primary))]">
                      2-5 Werktage
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[hsl(var(--secondary))] rounded-lg">
                    <span className="font-medium text-[hsl(var(--foreground))]">
                      Übriges Europa
                    </span>
                    <span className="font-bold text-[hsl(var(--primary))]">
                      3-7 Werktage
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <span className="font-medium text-[hsl(var(--foreground))]">
                      Inseln (UK, Irland)
                    </span>
                    <span className="font-bold text-orange-600">
                      5-10 Werktage
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>* Expressversand:</strong> Bestellungen bis 12:00 Uhr
                werden am nächsten Werktag geliefert. Nicht verfügbar für Inseln
                und abgelegene Regionen.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Kostenloser Versand
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                Ab €50 Bestellwert innerhalb Deutschlands
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Sendungsverfolgung
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                Vollständige Transparenz über den Lieferweg
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Flexibel & Zuverlässig
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                Terminänderungen jederzeit möglich
              </p>
            </div>
          </div>

          <div className="bg-[hsl(var(--secondary))] rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6 text-center">
              Wichtige Hinweise zu Lieferzeiten
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-3">
                  Feiertage & Ferien
                </h3>
                <ul className="space-y-2 text-[hsl(var(--muted-foreground))]">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3 mt-2"></span>
                    Weihnachten: +2-3 Tage
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3 mt-2"></span>
                    Ostern: +1-2 Tage
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3 mt-2"></span>
                    Sommerferien: Normale Zeiten
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-3">
                  Zusätzliche Services
                </h3>
                <ul className="space-y-2 text-[hsl(var(--muted-foreground))]">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3 mt-2"></span>
                    Wunschtermin möglich
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3 mt-2"></span>
                    Nachbarzustellung
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3 mt-2"></span>
                    Packstation-Lieferung
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">
                Haben Sie Fragen zu Ihrer Lieferung?
              </h2>
              <p className="mb-6">
                Unser Kundenservice hilft Ihnen gerne bei allen Fragen zu
                Lieferzeiten und -kosten.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[hsl(var(--primary))] px-6 py-3 rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors font-semibold">
                  Lieferstatus prüfen
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold">
                  Kontakt aufnehmen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
