import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

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
            <div className="bg-white rounded-lg shadow-md p-8 border border-primary">
              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6">
                Zahlungsmethoden
              </h2>

              <div className="space-y-4">
                <div className="flex items-center p-4 border border-accent rounded-lg">
                  <Image
                    src="/images/payment/creditcard.webp"
                    alt="Kreditkarte"
                    width={40}
                    height={28}
                    className="mr-4 object-contain"
                  />
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Kreditkarte
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Visa, Mastercard, American Express
                    </p>
                  </div>
                  <div className="ml-auto text-accent">✓</div>
                </div>

                <div className="flex items-center p-4 border border-accent rounded-lg">
                  <Image
                    src="/images/payment/paypal.webp"
                    alt="PayPal"
                    width={40}
                    height={28}
                    className="mr-4 object-contain"
                  />
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      PayPal
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Schnell und sicher bezahlen
                    </p>
                  </div>
                  <div className="ml-auto text-accent">✓</div>
                </div>

                <div className="flex items-center p-4 border border-accent rounded-lg">
                  <Image
                    src="/images/payment/klarna.webp"
                    alt="Sofortüberweisung"
                    width={40}
                    height={28}
                    className="mr-4 object-contain"
                  />
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Klarna
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Rechnung, Raten, Sofortüberweisung
                    </p>
                  </div>
                  <div className="ml-auto text-accent">✓</div>
                </div>

                <div className="flex items-center p-4 border border-accent rounded-lg">
                  <Image
                    src="/images/payment/sepa.webp"
                    alt="Rechnung"
                    width={40}
                    height={28}
                    className="mr-4 object-contain"
                  />
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      SEPA Lastschrift
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Direkt von Ihrem Bankkonto
                    </p>
                  </div>
                  <div className="ml-auto text-accent">✓</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[hsl(var(--secondary))] rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Sicherheit</h3>
                <p className="text-sm text-primary">
                  Alle Zahlungen werden SSL-verschlüsselt verarbeitet. Ihre
                  Daten sind sicher.
                </p>
              </div>
            </div>

            {/* Versandoptionen */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-primary">
              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6">
                Versandoptionen
              </h2>

              <div className="space-y-4">
                <div className="p-4 border border-accent rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        Standardversand
                      </h3>
                      <Image
                        src="/images/shipping/dhl.webp"
                        alt="DHL"
                        width={40}
                        height={20}
                        className="ml-2 object-contain"
                      />
                    </div>
                    <span className="font-bold text-[hsl(var(--primary))]">
                      €4,90
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    1-3 Werktage • Kostenlos ab €50
                  </p>
                </div>

                <div className="p-4 border border-accent bg-[hsl(var(--accent))]/5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[hsl(var(--foreground))]">
                        Expressversand
                      </h3>
                      <Image
                        src="/images/shipping/express.webp"
                        alt="DHL Express"
                        width={40}
                        height={20}
                        className="ml-2 object-contain"
                      />
                    </div>
                    <span className="font-bold text-[hsl(var(--primary))]">
                      €9,90
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Nächster Werktag • Bis 12 Uhr bestellt
                  </p>
                </div>

                <div className="p-4 border border-accent rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      Abholung
                    </h3>
                    <span className="font-bold text-accent">Kostenlos</span>
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    In unserem Ladengeschäft • Nach Terminvereinbarung
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-accent/10 border border-accent rounded-lg">
                <h3 className="font-semibold text-accent mb-2">
                  Kostenloser Versand
                </h3>
                <p className="text-sm text-accent">
                  Bei Bestellungen über €50 liefern wir versandkostenfrei
                  innerhalb Deutschlands.
                </p>
              </div>
            </div>
          </div>

          {/* Zusätzliche Informationen */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary/30 rounded-lg shadow-md p-6 border border-primary text-center">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Sichere Zahlung
              </h3>
              <p className="text-primary">
                SSL-verschlüsselte Zahlungsabwicklung
              </p>
            </div>

            <div className="bg-primary/30 rounded-lg shadow-md p-6 border border-primary text-center">
              <div className="text-3xl mb-4">📦</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Sorgfältige Verpackung
              </h3>
              <p className="text-primary">
                Ihre Leckerlis werden frisch verpackt
              </p>
            </div>

            <div className="bg-primary/30 rounded-lg shadow-md p-6 border border-primary text-center">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Sendungsverfolgung
              </h3>
              <p className="text-primary">
                Vollständige Transparenz über den Versandweg
              </p>
            </div>
          </div>

          <div className="mt-8 bg-[hsl(var(--secondary))] rounded-lg p-8">
            <h2 className="text-3xl font-bold text-primary mb-4 text-center">
              Haben Sie Fragen?
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] text-center mb-6">
              Unser Kundenservice hilft Ihnen gerne bei allen Fragen zu Zahlung
              und Versand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kontakt">
                <span className="bg-accent text-white px-6 py-3 rounded-sm hover:bg-[hsl(var(--primary))]/90 hover:text-accent hover:border border-accent cursor-pointer transition-colors font-semibold block text-center">
                  Kontakt aufnehmen
                </span>
              </Link>
              <button className="border bg-accent/10 border-accent text-accent px-6 py-3 cursor-pointer rounded-sm hover:bg-white transition-colors font-semibold">
                Live Chat starten
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
