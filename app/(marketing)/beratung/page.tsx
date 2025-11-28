import Button from "@/components/Button";

export default function BeratungPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Individuelle Beratung
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))] mb-8">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6">
              Persönliche Ernährungsberatung für Ihren Hund
            </h2>
            <p className="text-[hsl(var(--foreground))] mb-6">
              Jedes Tier ist einzigartig und hat individuelle Bedürfnisse.
              Unsere zertifizierten Tierernährungsberater helfen Ihnen dabei,
              die perfekten Leckerlis für Ihren Vierbeiner zu finden.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">
                  Was wir bieten:
                </h3>
                <ul className="space-y-2 text-[hsl(var(--foreground))]">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                    Individuelle Futterempfehlungen
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                    Allergieberatung
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                    Gewichtsmanagement
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                    Gesundheitsberatung
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">
                  Unsere Expertise:
                </h3>
                <ul className="space-y-2 text-[hsl(var(--foreground))]">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                    Zertifizierte Tierernährungsberater
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                    Über 10 Jahre Erfahrung
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                    Wissenschaftlich fundierte Empfehlungen
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                    Kostenlose Erstberatung
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <Button variant="secondary" className="text-lg px-8 py-4">
                Kostenlose Erstberatung vereinbaren
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] text-center">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Telefon
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                +49 123 456789
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Chat
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                Live-Chat auf unserer Website
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                E-Mail
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                beratung@elitedogtreats.de
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
