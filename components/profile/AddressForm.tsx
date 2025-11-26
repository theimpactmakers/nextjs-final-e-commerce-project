"use client";

import { useProfile } from "@/contexts/ProfileContext";
import { useState, useEffect } from "react";
import type { AddressFormData, AddressType, Address } from "@/types/profile";

export function AddressForm({
  addressId,
  initialType,
  defaultBillingAddress,
  onCancel,
  onSuccess,
}: {
  addressId?: string | null;
  initialType?: AddressType | null;
  defaultBillingAddress?: Address;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const { addresses, createAddress, updateAddress } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const [formData, setFormData] = useState<AddressFormData>({
    address_type: (initialType || "shipping") as AddressType,
    is_default: false,
    company: "",
    first_name: "",
    last_name: "",
    street: "",
    house_number: "",
    address_line2: "",
    postal_code: "",
    city: "",
    state: "",
    country: "DE",
    phone: "",
  });

  // Load existing address if editing
  useEffect(() => {
    if (addressId) {
      const address = addresses.find((a) => a.id === addressId);
      if (address) {
        setFormData({
          address_type: address.address_type,
          is_default: address.is_default,
          company: address.company || "",
          first_name: address.first_name,
          last_name: address.last_name,
          street: address.street,
          house_number: address.house_number,
          address_line2: address.address_line2 || "",
          postal_code: address.postal_code,
          city: address.city,
          state: address.state || "",
          country: address.country,
          phone: address.phone || "",
        });
      }
    }
  }, [addressId, addresses]);

  // Handle "Same as Billing Address" checkbox
  useEffect(() => {
    if (
      sameAsBilling &&
      defaultBillingAddress &&
      formData.address_type === "shipping"
    ) {
      setFormData((prev) => ({
        ...prev,
        company: defaultBillingAddress.company || "",
        first_name: defaultBillingAddress.first_name,
        last_name: defaultBillingAddress.last_name,
        street: defaultBillingAddress.street,
        house_number: defaultBillingAddress.house_number,
        address_line2: defaultBillingAddress.address_line2 || "",
        postal_code: defaultBillingAddress.postal_code,
        city: defaultBillingAddress.city,
        state: defaultBillingAddress.state || "",
        country: defaultBillingAddress.country,
        phone: defaultBillingAddress.phone || "",
      }));
    }
  }, [sameAsBilling, defaultBillingAddress, formData.address_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    let result;
    if (addressId) {
      result = await updateAddress(addressId, formData);
    } else {
      result = await createAddress(formData);
    }

    if (result.error) {
      setError(result.error.message);
      setIsSaving(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold">
          {addressId ? "Adresse bearbeiten" : "Neue Adresse hinzufügen"}
        </h2>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Address Type */}
            <div className="grid gap-2">
              <label htmlFor="address_type" className="text-sm font-medium">
                Adresstyp *
              </label>
              <select
                id="address_type"
                required
                value={formData.address_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address_type: e.target.value as AddressType,
                  })
                }
                disabled={!!addressId || !!initialType}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="billing">Rechnungsadresse</option>
                <option value="shipping">Lieferadresse</option>
              </select>
            </div>

            {/* Same as Billing Address (only for shipping) */}
            {formData.address_type === "shipping" &&
              defaultBillingAddress &&
              !addressId && (
                <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <input
                    id="same_as_billing"
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <label
                    htmlFor="same_as_billing"
                    className="text-sm font-medium"
                  >
                    Gleiche Adresse wie Rechnungsadresse verwenden
                  </label>
                </div>
              )}

            {/* Is Default */}
            <div className="flex items-center gap-2">
              <input
                id="is_default"
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) =>
                  setFormData({ ...formData, is_default: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="is_default" className="text-sm font-medium">
                Als Standardadresse setzen
              </label>
            </div>

            {/* Company */}
            <div className="grid gap-2">
              <label htmlFor="company" className="text-sm font-medium">
                Firma (optional)
              </label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            {/* First & Last Name */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="first_name" className="text-sm font-medium">
                  Vorname *
                </label>
                <input
                  id="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="last_name" className="text-sm font-medium">
                  Nachname *
                </label>
                <input
                  id="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            {/* Street & House Number */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2 md:col-span-2">
                <label htmlFor="street" className="text-sm font-medium">
                  Straße *
                </label>
                <input
                  id="street"
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="house_number" className="text-sm font-medium">
                  Nr. *
                </label>
                <input
                  id="house_number"
                  type="text"
                  required
                  value={formData.house_number}
                  onChange={(e) =>
                    setFormData({ ...formData, house_number: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            {/* Address Line 2 */}
            <div className="grid gap-2">
              <label htmlFor="address_line2" className="text-sm font-medium">
                Adresszusatz (optional)
              </label>
              <input
                id="address_line2"
                type="text"
                value={formData.address_line2}
                onChange={(e) =>
                  setFormData({ ...formData, address_line2: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            {/* Postal Code & City */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <label htmlFor="postal_code" className="text-sm font-medium">
                  PLZ *
                </label>
                <input
                  id="postal_code"
                  type="text"
                  required
                  value={formData.postal_code}
                  onChange={(e) =>
                    setFormData({ ...formData, postal_code: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <label htmlFor="city" className="text-sm font-medium">
                  Stadt *
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            {/* State */}
            <div className="grid gap-2">
              <label htmlFor="state" className="text-sm font-medium">
                Bundesland (optional)
              </label>
              <input
                id="state"
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            {/* Country */}
            <div className="grid gap-2">
              <label htmlFor="country" className="text-sm font-medium">
                Land *
              </label>
              <select
                id="country"
                required
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
                <option value="CH">Schweiz</option>
              </select>
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Telefonnummer (optional)
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {isSaving ? "Wird gespeichert..." : "Speichern"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
