import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Über uns</h1>

      <div className="space-y-8">
        {/* Hero Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Elite Dog Treats</h2>
                <p className="text-lg text-muted-foreground">
                  Seit 2015 bieten wir hochwertiges, artgerechtes Hundefutter
                  für deinen besten Freund.
                </p>
                <p className="text-muted-foreground">
                  Unsere Mission ist es, Hunden durch qualitativ hochwertige
                  Ernährung ein gesundes und glückliches Leben zu ermöglichen.
                  Wir arbeiten nur mit den besten Lieferanten zusammen und
                  achten auf höchste Qualitätsstandards.
                </p>
              </div>
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                <span className="text-4xl">🐕</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unsere Werte */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Unsere Werte</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🌱</span>
                  Natürlich
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  100% natürliche Zutaten ohne künstliche Zusatzstoffe,
                  Konservierungsmittel oder Füllstoffe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  Qualität
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Höchste Qualitätsstandards bei der Auswahl unserer Produkte
                  und Lieferanten.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">❤️</span>
                  Tierliebe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Aus Liebe zu Hunden - artgerechte Ernährung steht bei uns an
                  erster Stelle.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Unser Team */}
        <Card>
          <CardHeader>
            <CardTitle>Unser Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Wir sind ein Team von Hundeliebhabern und Ernährungsexperten, die
              ihre Leidenschaft zum Beruf gemacht haben. Mit über 20 Jahren
              kombinierter Erfahrung in der Haustierbranche wissen wir genau,
              was Hunde brauchen.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center text-3xl">
                  👨‍💼
                </div>
                <h3 className="font-semibold">Max Mustermann</h3>
                <p className="text-sm text-muted-foreground">Geschäftsführer</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center text-3xl">
                  👩‍💼
                </div>
                <h3 className="font-semibold">Anna Schmidt</h3>
                <p className="text-sm text-muted-foreground">
                  Ernährungsberaterin
                </p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center text-3xl">
                  👨‍🔬
                </div>
                <h3 className="font-semibold">Dr. Peter Müller</h3>
                <p className="text-sm text-muted-foreground">Tierarzt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nachhaltigkeit */}
        <Card>
          <CardHeader>
            <CardTitle>Nachhaltigkeit & Verantwortung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Wir nehmen unsere Verantwortung für die Umwelt ernst:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>
                  Umweltfreundliche Verpackungen aus recycelbaren Materialien
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Regionale Lieferanten wo immer möglich</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Klimaneutraler Versand</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>1% unseres Umsatzes geht an Tierschutzorganisationen</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
