"use client";

import { useTransition } from "react";
import { approveReview, rejectReview, deleteReview } from "./actions";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

export function ReviewActions({
  reviewId,
  isApproved,
}: {
  reviewId: string;
  isApproved: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      await approveReview(reviewId);
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      await rejectReview(reviewId);
    });
  };

  const handleDelete = () => {
    if (
      confirm(
        "Sind Sie sicher, dass Sie diese Bewertung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
      )
    ) {
      startTransition(async () => {
        await deleteReview(reviewId);
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!isApproved && (
        <button
          onClick={handleApprove}
          disabled={isPending}
          className="cursor-pointer rounded p-1 text-green-600 hover:bg-green-50 disabled:opacity-50"
          title="Genehmigen"
        >
          <CheckCircle className="h-5 w-5" />
        </button>
      )}
      {isApproved && (
        <button
          onClick={handleReject}
          disabled={isPending}
          className="cursor-pointer rounded p-1 text-orange-600 hover:bg-orange-50 disabled:opacity-50"
          title="Ablehnen"
        >
          <XCircle className="h-5 w-5" />
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="cursor-pointer rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
        title="Löschen"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
