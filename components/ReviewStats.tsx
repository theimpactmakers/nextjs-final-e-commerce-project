"use client";

import type { Database } from "@/types";

type ReviewStats = {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
};

interface ReviewStatsProps {
  stats: ReviewStats;
}

export default function ReviewStats({ stats }: ReviewStatsProps) {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  // Calculate percentage for each rating
  const getRatingPercentage = (rating: number) => {
    if (totalReviews === 0) return 0;
    return ((ratingDistribution[rating] || 0) / totalReviews) * 100;
  };

  return (
    <div className="bg-linear-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Average Rating */}
        <div className="flex flex-col items-center justify-center md:border-r md:pr-8 md:border-slate-200">
          <div className="text-5xl font-bold text-slate-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(averageRating)
                    ? "text-amber-400 fill-current"
                    : "text-gray-300"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            {totalReviews} {totalReviews === 1 ? "Bewertung" : "Bewertungen"}
          </div>
        </div>

        {/* Right: Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const percentage = getRatingPercentage(rating);
            const count = ratingDistribution[rating] || 0;

            return (
              <div key={rating} className="flex items-center gap-3">
                {/* Stars */}
                <div className="flex items-center gap-1 w-24">
                  <span className="text-sm font-medium text-slate-700 w-3">{rating}</span>
                  <svg
                    className="w-4 h-4 text-amber-400 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>

                {/* Progress Bar */}
                <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Count */}
                <div className="text-sm text-gray-600 w-8 text-right">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
