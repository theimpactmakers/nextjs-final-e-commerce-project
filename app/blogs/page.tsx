export default function BlogsPage() {
  const blogPosts = [
    {
      title: "Die besten natürlichen Zutaten für Hundeleckerlis",
      excerpt:
        "Entdecken Sie, welche natürlichen Zutaten besonders gut für die Gesundheit Ihres Hundes sind...",
      date: "2024-01-15",
      readTime: "5 min",
      category: "Ernährung",
    },
    {
      title: "So erkennen Sie Qualität bei Hundesnacks",
      excerpt:
        "Worauf sollten Sie beim Kauf von Hundeleckerlis achten? Unser Leitfaden hilft Ihnen...",
      date: "2024-01-10",
      readTime: "7 min",
      category: "Qualität",
    },
    {
      title: "Saisonale Leckerlis für Ihren Vierbeiner",
      excerpt:
        "Passen Sie die Ernährung Ihres Hundes an die Jahreszeiten an...",
      date: "2024-01-05",
      readTime: "4 min",
      category: "Saison",
    },
    {
      title: "Die Bedeutung von Proteinen in der Hundeernährung",
      excerpt:
        "Warum Proteine so wichtig für Ihren Hund sind und welche Quellen die besten sind...",
      date: "2023-12-28",
      readTime: "6 min",
      category: "Ernährung",
    },
    {
      title: "Hausgemachte Alternativen zu kommerziellen Leckerlis",
      excerpt:
        "Lernen Sie, wie Sie gesunde Leckerlis selbst zubereiten können...",
      date: "2023-12-20",
      readTime: "8 min",
      category: "DIY",
    },
    {
      title: "Allergien bei Hunden: Was tun?",
      excerpt: "Erkennen und behandeln Sie Allergien bei Ihrem Hund richtig...",
      date: "2023-12-15",
      readTime: "6 min",
      category: "Gesundheit",
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] mb-8 text-center">
          Blog & Ratgeber
        </h1>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-xl text-[hsl(var(--muted-foreground))] text-center">
              Expertenwissen, Tipps und Ratgeber rund um die Hundeernährung und
              -gesundheit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-md border border-[hsl(var(--border))] overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                      {post.readTime} lesen
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-3 line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-[hsl(var(--muted-foreground))] mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">
                      {new Date(post.date).toLocaleDateString("de-DE")}
                    </span>
                    <button className="text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))] font-medium transition-colors">
                      Weiterlesen →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-[hsl(var(--secondary))] rounded-lg p-8">
              <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-4">
                Bleiben Sie informiert
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] mb-6">
                Abonnieren Sie unseren Newsletter und erhalten Sie die neuesten
                Artikel direkt in Ihr Postfach.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Ihre E-Mail-Adresse"
                  className="flex-1 px-4 py-3 border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/30"
                />
                <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-3 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors font-semibold">
                  Abonnieren
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
