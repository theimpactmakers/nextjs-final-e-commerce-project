"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "./actions";

type Props = {
  productId: string;
  productName: string;
};

export function ProductDeleteButton({ productId, productName }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProduct(productId);
      setShowConfirm(false);
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">{productName} löschen?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "..." : "Ja"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="rounded bg-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-400 disabled:opacity-50"
        >
          Nein
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-700"
      title="Produkt löschen"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
