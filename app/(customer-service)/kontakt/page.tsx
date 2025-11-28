import Button from "@/components/Button";

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Kontakt & Support
        </h1>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Kontaktoptionen */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))]">
                <h2 className="text-xl font-bold text-[hsl(var(--primary))] mb-4">
                  Wie können wir Ihnen helfen?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors cursor-pointer">
                    <div className="text-2xl mb-2">🛒</div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))] mb-1">
                      Bestellung
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Fragen zu Ihrer Bestellung oder Lieferung
                    </p>
                  </div>

                  <div className="p-4 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors cursor-pointer">
                    <div className="text-2xl mb-2">🐕</div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))] mb-1">
                      Produkte
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Informationen zu unseren Leckerlis
                    </p>
                  </div>

                  <div className="p-4 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors cursor-pointer">
                    <div className="text-2xl mb-2">👨‍⚕️</div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))] mb-1">
                      Beratung
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Individuelle Ernährungsberatung
                    </p>
                  </div>

                  <div className="p-4 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors cursor-pointer">
                    <div className="text-2xl mb-2">📞</div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))] mb-1">
                      Support
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Technischer Support & Hilfe
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))]">
                <h2 className="text-xl font-bold text-[hsl(var(--primary))] mb-4">
                  Schnellkontakt
                </h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[hsl(var(--foreground))] font-medium mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-[hsl(var(--border))] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/30"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[hsl(var(--foreground))] font-medium mb-1">
                        E-Mail *
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-[hsl(var(--border))] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/30"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[hsl(var(--foreground))] font-medium mb-1">
                      Thema
                    </label>
                    <select className="w-full px-3 py-2 border border-[hsl(var(--border))] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/30">
                      <option>Bestellung</option>
                      <option>Produkte</option>
                      <option>Beratung</option>
                      <option>Support</option>
                      <option>Allgemein</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[hsl(var(--foreground))] font-medium mb-1">
                      Nachricht *
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-[hsl(var(--border))] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[hsl(var(--accent))]/30 resize-none"
                      required
                    ></textarea>
                  </div>

                  <Button type="submit" variant="secondary" className="w-full">
                    Nachricht senden
                  </Button>
                </form>
              </div>
            </div>

            {/* Kontaktinformationen */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))]">
                <h2 className="text-xl font-bold text-[hsl(var(--primary))] mb-4">
                  Kontaktinformationen
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-xl mr-3 mt-1">📍</div>
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
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-xl mr-3 mt-1">📞</div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        Telefon
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        +49 123 456789
                        <br />
                        Mo-Fr: 9:00 - 18:00 Uhr
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-xl mr-3 mt-1">📧</div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        E-Mail
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        info@elitedogtreats.de
                        <br />
                        support@elitedogtreats.de
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-xl mr-3 mt-1">💬</div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        Live Chat
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        Täglich 10:00 - 18:00 Uhr
                        <br />
                        Durchschnittliche Wartezeit: 2 Min.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--accent))]/10 rounded-lg p-6 border border-[hsl(var(--border))]">
                <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                  Notfall-Hotline
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] mb-3">
                  Bei dringenden Fragen zu unseren Produkten:
                </p>
                <div className="text-2xl font-bold text-[hsl(var(--primary))]">
                  +49 123 456789
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  24/7 erreichbar
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[hsl(var(--secondary))] rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
              Folgen Sie uns
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">
              Bleiben Sie auf dem Laufenden mit unseren neuesten Produkten und
              Tipps.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-3 rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors">
                📘
              </button>
              <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-3 rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors">
                📷
              </button>
              <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-3 rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors">
                🐦
              </button>
              <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-3 rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors">
                📺
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
