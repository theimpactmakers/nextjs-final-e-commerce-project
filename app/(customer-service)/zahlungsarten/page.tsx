export default function ZahlungsartenPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Zahlungsarten
        </h1>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-xl text-[hsl(var(--muted-foreground))] text-center">
              Wählen Sie die für Sie passende Zahlungsart aus. Alle Zahlungen
              sind SSL-verschlüsselt und sicher.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Kreditkarte */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">💳</div>
                <h2 className="text-xl font-bold text-[hsl(var(--primary))]">
                  Kreditkarte
                </h2>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Visa, Mastercard, American Express
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Sofortige Zahlung
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    SSL-verschlüsselt
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
              </div>

              <div className="text-center">
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  Beliebtste Zahlungsart
                </span>
              </div>
            </div>

            {/* PayPal */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📱</div>
                <h2 className="text-xl font-bold text-[hsl(var(--primary))]">
                  PayPal
                </h2>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Kostenlos
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Käuferschutz
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Schnell & sicher
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
              </div>

              <div className="text-center">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  Empfohlen
                </span>
              </div>
            </div>

            {/* Sofortüberweisung */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🏦</div>
                <h2 className="text-xl font-bold text-[hsl(var(--primary))]">
                  Sofortüberweisung
                </h2>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Echtzeit-Überweisung
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Keine Registrierung nötig
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Hohe Sicherheit
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
              </div>

              <div className="text-center">
                <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  Schnell
                </span>
              </div>
            </div>

            {/* Rechnung */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📄</div>
                <h2 className="text-xl font-bold text-[hsl(var(--primary))]">
                  Rechnung
                </h2>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Für Geschäftskunden
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Ab 500€ Bestellwert
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    14 Tage Zahlungsfrist
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
              </div>

              <div className="text-center">
                <span className="inline-block bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
                  Geschäftskunden
                </span>
              </div>
            </div>

            {/* Nachnahme */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">💰</div>
                <h2 className="text-xl font-bold text-[hsl(var(--primary))]">
                  Nachnahme
                </h2>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Barzahlung bei Lieferung
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Kein Risiko
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    +€5,90 Nachnahmegebühr
                  </span>
                  <span className="text-orange-600 font-semibold">ℹ</span>
                </div>
              </div>

              <div className="text-center">
                <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  Klassisch
                </span>
              </div>
            </div>

            {/* Geschenkgutscheine */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🎁</div>
                <h2 className="text-xl font-bold text-[hsl(var(--primary))]">
                  Geschenkgutscheine
                </h2>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Perfekt zum Verschenken
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Kein Ablaufdatum
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">
                    Verschiedene Beträge
                  </span>
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
              </div>

              <div className="text-center">
                <span className="inline-block bg-pink-100 text-pink-800 text-sm px-3 py-1 rounded-full">
                  Geschenkidee
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[hsl(var(--secondary))] rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6 text-center">
              Sicherheit & Datenschutz
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                  SSL-Verschlüsselung
                </h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Alle Zahlungen werden durch 256-Bit SSL-Verschlüsselung
                  geschützt.
                </p>
              </div>

              <div className="text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                  PCI DSS zertifiziert
                </h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Wir erfüllen die höchsten Sicherheitsstandards für
                  Kreditkartenzahlungen.
                </p>
              </div>

              <div className="text-center">
                <div className="text-3xl mb-2">👀</div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                  Keine Speicherung
                </h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Ihre Zahlungsdaten werden nicht auf unseren Servern
                  gespeichert.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
