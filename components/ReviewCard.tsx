"use client";

import { format } from "date-fns";
import type { Database } from "@/types";

type Review = Database["public"]["Tables"]["reviews"]["Row"] & {
  profiles?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  };
};

interface ReviewCardProps {
  review: Review;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwnReview?: boolean;
}

export default function ReviewCard({ review, onEdit, onDelete, isOwnReview }: ReviewCardProps) {
  const userName = review.profiles
    ? `${review.profiles.first_name || ""} ${review.profiles.last_name || ""}`.trim() || "Anonymer Nutzer"
    : "Anonymer Nutzer";

  const createdDate = review.created_at
    ? format(new Date(review.created_at), "dd. MMMM yyyy")
    : "";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* Stars */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= review.rating
                      ? "fill-yellow-400 stroke-yellow-500"
                      : "fill-gray-200 stroke-gray-300"
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            {review.is_verified_purchase && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                Verifizierter Kauf
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">{createdDate}</p>
        </div>

        {isOwnReview && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Bearbeiten
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Löschen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
      )}

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {review.comment}
        </p>
      )}

      {/* Helpful Counter (optional future feature) */}
      {review.helpful_count && review.helpful_count > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {review.helpful_count} {review.helpful_count === 1 ? "Person fand" : "Personen fanden"} diese Bewertung hilfreich
          </p>
        </div>
      )}
    </div>
  );
}
