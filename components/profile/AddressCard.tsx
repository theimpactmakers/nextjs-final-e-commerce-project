"use client";

import { useProfile } from "@/contexts/ProfileContext";
import { useState } from "react";
import type { Address } from "@/types/profile";

export function AddressCard({
  address,
  onEdit,
}: {
  address: Address;
  onEdit: () => void;
}) {
  const { deleteAddress, setDefaultAddress } = useProfile();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteAddress(address.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const handleSetDefault = async () => {
    await setDefaultAddress(address.id, address.address_type);
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm p-6 relative">
      {address.is_default && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Standard
          </span>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <h3 className="font-semibold">
          {address.first_name} {address.last_name}
        </h3>
        {address.company && (
          <p className="text-sm text-muted-foreground">{address.company}</p>
        )}
        <p className="text-sm">
          {address.street} {address.house_number}
        </p>
        {address.address_line2 && (
          <p className="text-sm">{address.address_line2}</p>
        )}
        <p className="text-sm">
          {address.postal_code} {address.city}
        </p>
        {address.state && <p className="text-sm">{address.state}</p>}
        <p className="text-sm">{address.country}</p>
        {address.phone && (
          <p className="text-sm text-muted-foreground">Tel: {address.phone}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-border">
        {!address.is_default && (
          <button
            onClick={handleSetDefault}
            className="text-sm text-primary hover:underline"
          >
            Als Standard setzen
          </button>
        )}
        <button
          onClick={onEdit}
          className="text-sm text-primary hover:underline ml-auto"
        >
          Bearbeiten
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-sm text-red-600 hover:underline"
        >
          Löschen
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border shadow-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Adresse löschen?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Möchten Sie diese Adresse wirklich löschen? Diese Aktion kann
              nicht rückgängig gemacht werden.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2 flex-1 disabled:opacity-50"
              >
                {isDeleting ? "Wird gelöscht..." : "Löschen"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex-1 disabled:opacity-50"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
