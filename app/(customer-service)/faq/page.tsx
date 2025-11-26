export default function FAQPage() {
  const faqs = [
    {
      question: "Sind Ihre Produkte für alle Hunderassen geeignet?",
      answer:
        "Ja, unsere Leckerlis sind für alle Hunderassen geeignet. Wir empfehlen jedoch, die Portionsgrößen an die Größe Ihres Hundes anzupassen. Bei speziellen Ernährungsbedürfnissen oder Allergien beraten wir Sie gerne individuell.",
    },
    {
      question: "Wie lange sind die Leckerlis haltbar?",
      answer:
        "Unsere Leckerlis haben eine Mindesthaltbarkeit von 12 Monaten ab Produktionsdatum. Nach dem Öffnen der Verpackung sollten sie innerhalb von 2-3 Monaten verbraucht werden. Lagern Sie sie kühl und trocken.",
    },
    {
      question: "Enthalten Ihre Produkte Zucker oder künstliche Zusätze?",
      answer:
        "Nein, unsere Leckerlis sind komplett ohne Zucker und künstliche Zusätze. Wir verwenden nur natürliche Zutaten und Süßstoffe wie Honig oder Früchte.",
    },
    {
      question: "Wie hoch ist der Proteingehalt Ihrer Leckerlis?",
      answer:
        "Der Proteingehalt variiert je nach Produkt zwischen 15% und 35%. Wir verwenden hochwertige Proteinquellen wie Fleisch, Fisch oder Hülsenfrüchte.",
    },
    {
      question: "Bieten Sie auch vegetarische oder vegane Alternativen?",
      answer:
        "Ja, wir haben eine Auswahl an vegetarischen Leckerlis auf Basis von Hülsenfrüchten und Gemüse. Diese sind besonders für Hunde mit Fleischunverträglichkeiten geeignet.",
    },
    {
      question: "Wie schnell erfolgt der Versand?",
      answer:
        "Innerhalb Deutschlands liefern wir in der Regel innerhalb von 1-2 Werktagen. Bei Expressversand ist sogar eine Lieferung am nächsten Tag möglich.",
    },
    {
      question: "Bieten Sie eine Geld-zurück-Garantie?",
      answer:
        "Ja, wir bieten eine 30-tägige Geld-zurück-Garantie. Wenn Ihr Hund die Leckerlis nicht mag, erstatten wir Ihnen den vollen Kaufpreis.",
    },
    {
      question: "Kann ich die Leckerlis auch für Welpen verwenden?",
      answer:
        "Unsere Leckerlis sind für Hunde ab 12 Wochen geeignet. Für Welpen empfehlen wir kleinere Portionsgrößen und weiche Texturen.",
    },
    {
      question: "Wo werden Ihre Produkte hergestellt?",
      answer:
        "Alle unsere Produkte werden in Deutschland in zertifizierten Betrieben hergestellt. Wir legen größten Wert auf Qualität und Hygiene.",
    },
    {
      question: "Bieten Sie Beratung für allergische Hunde?",
      answer:
        "Ja, unsere Tierernährungsberater helfen Ihnen gerne bei der Auswahl geeigneter Produkte für allergische Hunde. Kontaktieren Sie uns für eine individuelle Beratung.",
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Häufig gestellte Fragen
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <p className="text-xl text-[hsl(var(--muted-foreground))]">
              Hier finden Sie Antworten auf die am häufigsten gestellten Fragen
              zu unseren Produkten und Dienstleistungen.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-white rounded-lg shadow-md border border-[hsl(var(--border))] group"
              >
                <summary className="cursor-pointer p-6 font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors flex justify-between items-center">
                  <span>{faq.question}</span>
                  <span className="text-2xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 text-[hsl(var(--muted-foreground))]">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 bg-[hsl(var(--secondary))] rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
              Haben Sie weitere Fragen?
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">
              Unsere Experten helfen Ihnen gerne weiter. Kontaktieren Sie uns
              jederzeit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary">Kontakt aufnehmen</Button>
              <Button variant="outline">Live Chat starten</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
