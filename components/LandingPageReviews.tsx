import { createClient } from "@/lib/supabase/server";
import ReviewCard from "./ReviewCard";

export default async function LandingPageReviews() {
  const supabase = await createClient();

  // Hole die neuesten Bewertungen
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profiles:user_id (
        id,
        first_name,
        last_name
      )
    `
    )
    .order("rating", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(8);

  console.log("Reviews fetched:", reviews?.length || 0, "reviews");
  if (error) console.error("Reviews error:", error);

  if (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }

  if (!reviews || reviews.length === 0) {
    // Zeige die Section trotzdem mit Platzhalter
    return (
      <section className="max-w-7xl mx-auto mb-16 px-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Was unsere Kunden sagen
          </h2>
          <p className="text-muted-foreground text-sm">
            Seien Sie der Erste, der eine Bewertung abgibt!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto mb-16 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Was unsere Kunden sagen
        </h2>
        <p className="text-muted-foreground text-sm">
          Vertraue auf die Erfahrungen von begeisterten Hundebesitzern
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Link zu allen Bewertungen */}
      <div className="text-right mt-8">
        <a
          href="/shop"
          className="text-accent font-semibold underline hover:no-underline transition-all"
        >
          Alle Bewertungen ansehen →
        </a>
      </div>
    </section>
  );
}
