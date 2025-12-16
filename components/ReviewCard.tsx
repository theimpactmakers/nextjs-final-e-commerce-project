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

export default function ReviewCard({
  review,
  onEdit,
  onDelete,
  isOwnReview,
}: ReviewCardProps) {
  const userName = review.profiles
    ? `${review.profiles.first_name || ""} ${
        review.profiles.last_name || ""
      }`.trim() || "Anonymer Nutzer"
    : "Anonymer Nutzer";

  const createdDate = review.created_at
    ? format(new Date(review.created_at), "dd. MMMM yyyy")
    : "";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative">
      {/* User Avatar Icon - Top Right */}
      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30">
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4 pr-14">
        <div className="flex-1">
          {/* Stars */}
          <div className="flex gap-0.5 mb-3">
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

          <p className="text-base font-semibold text-gray-900 mb-1">
            {userName}
          </p>
          {review.is_verified_purchase && (
            <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium border border-green-200">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verifizierter Kauf
            </span>
          )}
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
        <h4 className="font-semibold text-gray-900 mb-3 text-base">
          {review.title}
        </h4>
      )}

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap flex-1 mb-4">
          {review.comment}
        </p>
      )}

      {/* Date at bottom left */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">{createdDate}</p>
      </div>
    </div>
  );
}
