import Image from "next/image";
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export const metadata = {
  title:
    "Unsere Geschichte | Elite Dog TREATS - Von der Idee zum Premium-Futter",
  description:
    "Entdecken Sie die Geschichte hinter Elite Dog TREATS und wie unsere Leidenschaft für Hunde zu Premium-Leckerlis wurde.",
};

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 mb-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/dog-head.webp"
                  alt="Hundekopf"
                  width={300}
                  height={72}
                  style={{ borderRadius: "50%" }}
                />
              </div>
              <h1 className="text-4xl font-bold text-[hsl(var(--primary))] mb-4">
                Wie alles begann...
              </h1>
            </div>

            <div className="space-y-6 text-[hsl(var(--foreground))]">
              <p>
                Die Liebe zu meiner Vizsla-Hündin Maya war der eigentliche
                Auslöser für alles. Denn sie ist nicht nur ein Familienmitglied,
                sondern meine beste Freundin und treue Begleiterin in allen Lebenslagen. Von Anfang
                an wollte ich für sie nur das Beste – vor allem, wenn es um ihre
                Ernährung ging. Doch schnell wurde mir klar, wie schwierig es
                ist, wirklich hochwertiges, natürliches und artgerechtes Futter
                zu finden, das den Ansprüchen eines aktiven, sensiblen Hundes
                wie Maya gerecht wird. Viele Produkte im Handel waren voller
                künstlicher Zusätze, Getreide oder minderwertiger Zutaten. Ich
                wollte Maya aber nur das geben, was sie wirklich verdient:
                <strong> ehrliche, gesunde und natürliche Leckerlis, die ihre Vitalität
                und Lebensfreude unterstützen.</strong>
              </p>
              <p>
                Unsere Geschichte begann also 2025 mit einem einfachen Wunsch: Die
                besten Leckerlis für meinen geliebten Hund zu finden. Nach
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
                <h3 className="text-2xl font-semibold text-primary mb-2">
                  Unser erster Meilenstein
                </h3>
                <p className=" text-primary ">
                  Nach unzähligen Testrunden mit unserem eigenen Hund und denen
                  unserer Freunde und Familie hatten wir endlich die perfekte
                  Formel gefunden. Die ersten &bdquo;EliteDogTREATS&rdquo;
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
                Heute sind wir stolz darauf, tausenden
                von Hunden weltweit Freude zu bereiten. Jedes Leckerli wird mit
                der gleichen Sorgfalt und Liebe hergestellt, mit der wir unsere
                eigenen Hunde verwöhnen würden.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border">
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

            <div className="bg-white rounded-lg shadow-md p-6 border ">
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
        </div>
      </div>
    </div>
  );
}
