import Image from "next/image";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export default function LieferzeitenPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] pt-8">
      <div className="container mx-auto pt-4">
        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Lieferzeiten
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className=" rounded-lg shadow-md p-8 border border-primary mb-8">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] text-center mb-12">
              Schnelle und zuverlässige Lieferung
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] ml-3 mb-4">
                  Deutschland
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[hsl(var(--secondary))] rounded-lg">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/shipping/dhl.webp"
                        alt="DHL Logo"
                        width={48}
                        height={24}
                        className="object-contain"
                      />
                      <span className="font-medium text-[hsl(var(--foreground))]">
                        Standardversand
                      </span>
                    </div>
                    <span className="font-bold text-primary">1-3 Werktage</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/30 border border-primary rounded-lg">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/shipping/express.webp"
                        alt="DHL Express Logo"
                        width={48}
                        height={24}
                        className="object-contain"
                      />
                      <span className="font-medium text-[hsl(var(--foreground))]">
                        Expressversand
                      </span>
                    </div>
                    <span className="font-bold text-primary">
                      Nächster Werktag*
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-4 ml-3">
                  Europa
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[hsl(var(--secondary))] rounded-lg">
                    <span className="font-medium text-[hsl(var(--foreground))]">
                      Österreich & Niederlande
                    </span>
                    <span className="font-bold text-primary">2-5 Werktage</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[hsl(var(--secondary))] rounded-lg">
                    <span className="font-medium text-[hsl(var(--foreground))]">
                      Übriges Europa
                    </span>
                    <span className="font-bold text-primary">3-7 Werktage</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-6">
              <p className="text-accent text-sm">
                <strong>* Expressversand:</strong> Bestellungen bis 12:00 Uhr
                werden am nächsten Werktag geliefert.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-primary/20 rounded-lg shadow-md p-6 border border-primary text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Kostenloser Versand
              </h3>
              <p className="text-primary">
                Ab €50 Bestellwert innerhalb Deutschlands
              </p>
            </div>

            <div className="bg-primary/20 rounded-lg shadow-md p-6 border border-primary text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Sendungsverfolgung
              </h3>
              <p className="text-primary">
                Vollständige Transparenz über den Lieferweg
              </p>
            </div>

            <div className="bg-primary/20 rounded-lg shadow-md p-6 border border-primary text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Flexibel & Zuverlässig
              </h3>
              <p className="text-primary">Terminänderungen jederzeit möglich</p>
            </div>
          </div>

          <div className="bg-[hsl(var(--secondary))] rounded-lg p-8 mb-8">
            <h2 className="text-2xl ml-3 font-bold text-[hsl(var(--primary))] mb-8">
              Wichtige Hinweise zu Lieferzeiten:
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="ml-4 font-semibold text-primary mb-3">
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
                <h3 className="ml-4 font-semibold text-primary mb-3">
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
        </div>
      </div>
    </div>
  );
}
