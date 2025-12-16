"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useReviews } from "@/contexts/ReviewContext";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  existingReview?: {
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
  };
}

export default function ReviewForm({ productId, onSuccess, existingReview }: ReviewFormProps) {
  const { user } = useAuth();
  const { createReview, updateReview } = useReviews();
  const router = useRouter();

  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push("/auth/login?redirect=" + window.location.pathname);
      return;
    }

    if (rating === 0) {
      setError("Bitte wählen Sie eine Bewertung aus");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (existingReview) {
        const { error: updateError } = await updateReview(existingReview.id, {
          rating,
          title: title || null,
          comment: comment || null,
        });

        if (updateError) throw updateError;
      } else {
        const { error: createError } = await createReview({
          product_id: productId,
          user_id: user.id,
          rating,
          title: title || null,
          comment: comment || null,
          is_approved: true, // Auto-approve for now
        });

        if (createError) throw createError;
      }

      setTitle("");
      setComment("");
      setRating(0);
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Fehler beim Speichern der Bewertung. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-4">
          Bitte melden Sie sich an, um eine Bewertung abzugeben
        </p>
        <button
          onClick={() => router.push("/auth/login?redirect=" + window.location.pathname)}
          className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
        >
          Jetzt anmelden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold mb-4">
        {existingReview ? "Bewertung bearbeiten" : "Produkt bewerten"}
      </h3>

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bewertung*
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <svg
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 stroke-yellow-500"
                    : "fill-gray-200 stroke-gray-300"
                }`}
                viewBox="0 0 24 24"
                strokeWidth={1}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">
          Überschrift (optional)
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="z.B. Tolles Produkt!"
          maxLength={100}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
          Ihre Meinung (optional)
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Teilen Sie Ihre Erfahrungen mit diesem Produkt..."
          rows={4}
          maxLength={1000}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/1000 Zeichen
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? "Wird gespeichert..."
          : existingReview
          ? "Bewertung aktualisieren"
          : "Bewertung abgeben"}
      </button>
    </form>
  );
}
