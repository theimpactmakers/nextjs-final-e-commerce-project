export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Über Elite Dog TREATS
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))] mb-8">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6">
              Unsere Mission
            </h2>
            <p className="text-[hsl(var(--foreground))] mb-6">
              Bei Elite Dog TREATS sind wir leidenschaftlich darum bemüht, die
              besten Leckerlis für Ihren Vierbeiner zu kreieren. Wir glauben,
              dass jeder Hund das Recht auf hochwertige, gesunde und
              schmackhafte Belohnungen hat.
            </p>
            <p className="text-[hsl(var(--foreground))] mb-6">
              Seit unserer Gründung im Jahr 2018 haben wir uns darauf
              konzentriert, innovative und natürliche Produkte zu entwickeln,
              die nicht nur Ihren Hund glücklich machen, sondern auch seine
              Gesundheit fördern.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                100% Natürlich
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                Alle unsere Zutaten stammen aus natürlichen Quellen ohne
                künstliche Zusätze.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Premium Qualität
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                Wir verwenden nur die besten Zutaten und höchste
                Qualitätsstandards.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))] text-center">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                Tierliebe
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                Jedes Produkt wird mit Liebe zum Tier entwickelt und
                hergestellt.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))] mb-8">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6">
              Unser Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                  Dr. Sarah Müller - Tierernährungsexpertin
                </h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Mit über 15 Jahren Erfahrung in der Tierernährung leitet Sarah
                  unsere Produktentwicklung und stellt sicher, dass jedes
                  Leckerli optimal für die Gesundheit Ihres Hundes ist.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                  Michael Schmidt - Qualitätsmanager
                </h3>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Michael überwacht jeden Schritt unserer Produktionskette, um
                  die höchsten Qualitätsstandards zu gewährleisten.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-linear-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">
                Werden Sie Teil unserer Community
              </h2>
              <p className="mb-6">
                Abonnieren Sie unseren Newsletter und erhalten Sie exklusive
                Angebote und Tipps für die Pflege Ihres Hundes.
              </p>
              <button className="bg-white text-[hsl(var(--primary))] px-8 py-3 rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors font-semibold">
                Newsletter abonnieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
