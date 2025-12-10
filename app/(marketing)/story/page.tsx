export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Unsere Geschichte
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 border border-[hsl(var(--border))] mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🐕</div>
              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                Wie alles begann
              </h2>
            </div>

            <div className="space-y-6 text-[hsl(var(--foreground))]">
              <p>
                Unsere Geschichte begann 2018 mit einem einfachen Wunsch: Die
                besten Leckerlis für unseren eigenen Hund zu finden. Nach
                monatelanger Suche nach hochwertigen, natürlichen Alternativen
                zu den industriell gefertigten Produkten im Handel, stellten wir
                fest, dass es eine Lücke im Markt gab.
              </p>

              <p>
                Als leidenschaftliche Hundebesitzer und Ernährungsexperten
                entschieden wir uns, diese Lücke zu schließen. Wir begannen in
                unserer kleinen Küche mit der Entwicklung der ersten Rezepte –
                natürlich, gesund und unwiderstehlich lecker.
              </p>

              <div className="bg-[hsl(var(--secondary))] rounded-lg p-6 my-8">
                <h3 className="font-semibold text-[hsl(var(--primary))] mb-2">
                  Unser erster Meilenstein
                </h3>
                <p>
                  Nach unzähligen Testrunden mit unserem eigenen Hund und denen
                  unserer Freunde und Familie hatten wir endlich die perfekte
                  Formel gefunden. Die ersten &bdquo;Elite Dog TREATS&rdquo;
                  waren geboren!
                </p>
              </div>

              <p>
                Was als Hobby begann, entwickelte sich schnell zu einer Mission.
                Wir erkannten, dass viele Hundebesitzer die gleichen Probleme
                hatten: Schwierigkeiten, gesunde Alternativen zu finden, die
                auch noch schmecken. So gründeten wir Elite Dog TREATS als
                Unternehmen.
              </p>

              <p>
                Heute, nur wenige Jahre später, sind wir stolz darauf, tausenden
                von Hunden weltweit Freude zu bereiten. Jedes Leckerli wird mit
                der gleichen Sorgfalt und Liebe hergestellt, mit der wir unsere
                eigenen Hunde verwöhnen würden.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))]">
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-4 text-center">
                Unsere Werte
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                  <span className="text-[hsl(var(--foreground))]">
                    <strong>Qualität:</strong> Nur die besten Zutaten
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                  <span className="text-[hsl(var(--foreground))]">
                    <strong>Natur:</strong> 100% natürliche Inhaltsstoffe
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                  <span className="text-[hsl(var(--foreground))]">
                    <strong>Gesundheit:</strong> Förderung der Hundegesundheit
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                  <span className="text-[hsl(var(--foreground))]">
                    <strong>Liebe:</strong> Mit Herz für Tiere gemacht
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-[hsl(var(--border))]">
              <h3 className="font-semibold text-[hsl(var(--primary))] mb-4 text-center">
                Unsere Ziele
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                  <span className="text-[hsl(var(--foreground))]">
                    <strong>Expansion:</strong> Neue Märkte erschließen
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                  <span className="text-[hsl(var(--foreground))]">
                    <strong>Innovation:</strong> Neue Produkte entwickeln
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                  <span className="text-[hsl(var(--foreground))]">
                    <strong>Bildung:</strong> Hundebesitzer informieren
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full mr-3"></span>
                  <span className="text-[hsl(var(--foreground))]">
                    <strong>Nachhaltigkeit:</strong> Umweltfreundliche
                    Produktion
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-linear-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">
                Teil unserer Geschichte werden
              </h2>
              <p className="mb-6">
                Werden Sie Teil unserer Community und helfen Sie uns dabei, noch
                mehr Hunden ein glückliches und gesundes Leben zu ermöglichen.
              </p>
              <button className="bg-white text-[hsl(var(--primary))] px-8 py-3 rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors font-semibold">
                Jetzt mitmachen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
