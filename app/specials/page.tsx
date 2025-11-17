export default function SpecialsPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Specials & Angebote
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-[hsl(var(--accent))]/10 to-[hsl(var(--primary))]/10 rounded-lg p-6 border border-[hsl(var(--border))]">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
              Sommer-Special
            </h2>
            <p className="text-[hsl(var(--foreground))] mb-4">
              20% Rabatt auf alle Sommer-Leckerlis für Ihren Vierbeiner!
            </p>
            <div className="text-3xl font-bold text-[hsl(var(--accent))] mb-4">
              -20%
            </div>
            <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-3 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors w-full">
              Jetzt shoppen
            </button>
          </div>

          <div className="bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--muted))] rounded-lg p-6 border border-[hsl(var(--border))]">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
              Neukunden-Rabatt
            </h2>
            <p className="text-[hsl(var(--foreground))] mb-4">
              Erhalten Sie 15% Rabatt auf Ihre erste Bestellung!
            </p>
            <div className="text-3xl font-bold text-[hsl(var(--accent))] mb-4">
              -15%
            </div>
            <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-3 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors w-full">
              Registrieren
            </button>
          </div>

          <div className="bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--accent))]/10 rounded-lg p-6 border border-[hsl(var(--border))]">
            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
              Bundle-Angebot
            </h2>
            <p className="text-[hsl(var(--foreground))] mb-4">
              3 für 2 - Sparen Sie bei unseren beliebtesten Produkten!
            </p>
            <div className="text-3xl font-bold text-[hsl(var(--accent))] mb-4">
              3=2
            </div>
            <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-3 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors w-full">
              Mehr erfahren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
