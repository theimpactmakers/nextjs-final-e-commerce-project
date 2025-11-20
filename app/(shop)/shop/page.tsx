export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Shop
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Placeholder für Produkte */}
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-4 border border-[hsl(var(--border))]"
            >
              <div className="aspect-square bg-[hsl(var(--secondary))] rounded-lg mb-4 flex items-center justify-center">
                <span className="text-[hsl(var(--muted-foreground))]">
                  Produkt {i + 1}
                </span>
              </div>
              <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                Premium Dog Treat {i + 1}
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] text-sm mb-4">
                Hochwertige Leckerlis für Ihren Hund
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[hsl(var(--primary))]">
                  €{(Math.random() * 20 + 5).toFixed(2)}
                </span>
                <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors">
                  In den Warenkorb
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
