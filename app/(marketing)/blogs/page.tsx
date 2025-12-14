export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour (blogs change more frequently)

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
          Blogs & Ratgeber
        </h1>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-xl text-center">
              Expertenwissen, Tipps und Ratgeber rund um die Hundeernährung und
              -gesundheit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium bg-primary/80 text-white px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-black">
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
                    <span className="text-sm text-primary">
                      {new Date(post.date).toLocaleDateString("de-DE")}
                    </span>
                    <button className="text-accent hover:text-black font-medium transition-colors cursor-pointer">
                      <span className="underline hover:no-underline mr-1">
                        Weiterlesen
                      </span>
                      →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
