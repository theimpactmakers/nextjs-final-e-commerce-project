"use client";

import { useProfile } from "@/contexts/ProfileContext";
import { useState } from "react";
import { AddressForm } from "./AddressForm";
import { AddressCard } from "./AddressCard";

const MAX_ADDRESSES_PER_TYPE = 1;

export function AddressesSection() {
  const { addresses, isLoading } = useProfile();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [newAddressType, setNewAddressType] = useState<
    "billing" | "shipping" | null
  >(null);

  const billingAddresses = addresses.filter(
    (a) => a.address_type === "billing"
  );
  const shippingAddresses = addresses.filter(
    (a) => a.address_type === "shipping"
  );

  const canAddBilling = billingAddresses.length < MAX_ADDRESSES_PER_TYPE;
  const canAddShipping = shippingAddresses.length < MAX_ADDRESSES_PER_TYPE;
  const hasDefaultBilling = billingAddresses.some((a) => a.is_default);

  const handleAddAddress = (type: "billing" | "shipping") => {
    setNewAddressType(type);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Lädt Adressen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add/Edit Form */}
      {(showForm || editingAddress) && (
        <AddressForm
          addressId={editingAddress}
          initialType={newAddressType}
          defaultBillingAddress={
            hasDefaultBilling
              ? billingAddresses.find((a) => a.is_default)
              : undefined
          }
          onCancel={() => {
            setShowForm(false);
            setEditingAddress(null);
            setNewAddressType(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingAddress(null);
            setNewAddressType(null);
          }}
        />
      )}

      {/* Billing Addresses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Rechnungsadressen</h2>
          {!showForm && !editingAddress && (
            <button
              onClick={() => handleAddAddress("billing")}
              disabled={!canAddBilling}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Hinzufügen
            </button>
          )}
        </div>
        {!canAddBilling && (
          <p className="text-sm text-muted-foreground mb-4">
            Es kann nur eine Rechnungsadresse gespeichert werden
          </p>
        )}
        {billingAddresses.length === 0 ? (
          <div className="bg-card rounded-xl border shadow-sm p-8 text-center">
            <p className="text-muted-foreground">
              Noch keine Rechnungsadresse hinterlegt
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {billingAddresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => setEditingAddress(address.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Shipping Addresses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lieferadressen</h2>
          {!showForm && !editingAddress && (
            <button
              onClick={() => handleAddAddress("shipping")}
              disabled={!canAddShipping}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Hinzufügen
            </button>
          )}
        </div>
        {!canAddShipping && (
          <p className="text-sm text-muted-foreground mb-4">
            Es kann nur eine Lieferadresse gespeichert werden
          </p>
        )}
        {shippingAddresses.length === 0 ? (
          <div className="bg-card rounded-xl border shadow-sm p-8 text-center">
            <p className="text-muted-foreground">
              Noch keine Lieferadresse hinterlegt
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {shippingAddresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => setEditingAddress(address.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
