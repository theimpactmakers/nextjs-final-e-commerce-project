export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Kontakt
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kontaktformular */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))]">
              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6">
                Schreiben Sie uns
              </h2>

              <form className="space-y-6">
                <div>
                  <label className="block text-[hsl(var(--foreground))] font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[hsl(var(--foreground))] font-medium mb-2">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[hsl(var(--foreground))] font-medium mb-2">
                    Betreff
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/30"
                  />
                </div>

                <div>
                  <label className="block text-[hsl(var(--foreground))] font-medium mb-2">
                    Nachricht *
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/30 resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-3 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors font-semibold"
                >
                  Nachricht senden
                </button>
              </form>
            </div>

            {/* Kontaktinformationen */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))]">
                <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6">
                  Kontaktinformationen
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-2xl mr-4">📍</div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        Adresse
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        Elite Dog TREATS GmbH
                        <br />
                        Musterstraße 123
                        <br />
                        12345 Musterstadt
                        <br />
                        Deutschland
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-2xl mr-4">📞</div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        Telefon
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        +49 123 456789
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-2xl mr-4">📧</div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        E-Mail
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        info@elitedogtreats.de
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-2xl mr-4">🕒</div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        Öffnungszeiten
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        Mo-Fr: 9:00 - 18:00 Uhr
                        <br />
                        Sa: 10:00 - 16:00 Uhr
                        <br />
                        So: Geschlossen
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))]">
                <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                  Schnelle Antwort garantiert
                </h2>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Wir bemühen uns, alle Anfragen innerhalb von 24 Stunden zu
                  beantworten. Für dringende Angelegenheiten erreichen Sie uns
                  telefonisch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
