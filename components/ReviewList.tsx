"use client";

import { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import type { Database } from "@/types";

type Review = Database["public"]["Tables"]["reviews"]["Row"] & {
  profiles?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  };
};

interface ReviewListProps {
  productId: string;
  initialReviews?: Review[];
  currentUserId?: string;
  onEditReview?: (review: Review) => void;
  onDeleteReview?: (reviewId: string) => void;
}

export default function ReviewList({
  productId,
  initialReviews = [],
  currentUserId,
  onEditReview,
  onDeleteReview,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [sortBy, setSortBy] = useState<"recent" | "rating-high" | "rating-low">("recent");

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "rating-high":
        return b.rating - a.rating;
      case "rating-low":
        return a.rating - b.rating;
      case "recent":
      default:
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
  });

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Noch keine Bewertungen
        </h3>
        <p className="text-gray-600">
          Seien Sie der Erste, der dieses Produkt bewertet!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Sort Options */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          {reviews.length} {reviews.length === 1 ? "Bewertung" : "Bewertungen"}
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="recent">Neueste zuerst</option>
          <option value="rating-high">Höchste Bewertung</option>
          <option value="rating-low">Niedrigste Bewertung</option>
        </select>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isOwnReview={currentUserId === review.user_id}
            onEdit={onEditReview ? () => onEditReview(review) : undefined}
            onDelete={onDeleteReview ? () => onDeleteReview(review.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
