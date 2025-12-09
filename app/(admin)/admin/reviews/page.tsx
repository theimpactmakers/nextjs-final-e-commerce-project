import { createClient } from "@/lib/supabase/server";
import { Star, CheckCircle, XCircle, Clock } from "lucide-react";

async function getReviews() {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      *,
      products(name, slug),
      profiles(email, full_name)
    `
    )
    .order("created_at", { ascending: false });

  return reviews || [];
}

export default async function ReviewsPage() {
  const reviews = await getReviews();

  const approvedCount = reviews.filter((r) => r.is_approved).length;
  const pendingCount = reviews.filter((r) => !r.is_approved).length;
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="mt-2 text-gray-600">
          Moderate and manage customer reviews
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved Reviews</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {approvedCount}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Reviews</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {pendingCount}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {avgRating}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const productName = Array.isArray(review.products)
            ? review.products[0]?.name
            : "Unknown Product";
          const customerName = Array.isArray(review.profiles)
            ? review.profiles[0]?.full_name || review.profiles[0]?.email
            : "Unknown Customer";

          return (
            <div key={review.id} className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {review.rating}.0
                    </span>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">
                        {customerName}
                      </span>{" "}
                      reviewed{" "}
                      <span className="font-medium text-gray-900">
                        {productName}
                      </span>
                    </p>
                  </div>

                  {review.review_text && (
                    <p className="mt-3 text-gray-700">{review.review_text}</p>
                  )}

                  <div className="mt-3 text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  {review.is_approved ? (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      Approved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                      <Clock className="h-4 w-4" />
                      Pending
                    </span>
                  )}
                  <button
                    className="rounded p-2 text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {reviews.length === 0 && (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <p className="text-gray-500">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
}
