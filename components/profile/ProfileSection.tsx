"use client";

import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import type { ProfileUpdateData } from "@/types/profile";

export function ProfileSection() {
  const { profile, updateProfile, isLoading } = useProfile();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<ProfileUpdateData>({
    first_name: "",
    last_name: "",
    gender: null,
    date_of_birth: null,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        gender: profile.gender || null,
        date_of_birth: profile.date_of_birth || null,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    const { error: updateError } = await updateProfile(formData);

    if (updateError) {
      setError(updateError.message);
      setIsSaving(false);
    } else {
      setSuccess(true);
      setIsEditing(false);
      setIsSaving(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        gender: profile.gender || null,
        date_of_birth: profile.date_of_birth || null,
      });
    }
    setIsEditing(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Lädt Profildaten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border shadow-sm">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Persönliche Daten</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ihre Kontoinformationen und persönlichen Daten
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Bearbeiten
          </button>
        )}
      </div>

      <div className="p-6">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              Profil erfolgreich aktualisiert!
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Email (read-only) */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">E-Mail-Adresse</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm cursor-not-allowed opacity-60"
              />
              <p className="text-xs text-muted-foreground">
                Die E-Mail-Adresse kann nicht geändert werden
              </p>
            </div>

            {/* First Name */}
            <div className="grid gap-2">
              <label htmlFor="first_name" className="text-sm font-medium">
                Vorname *
              </label>
              <input
                id="first_name"
                type="text"
                required
                disabled={!isEditing}
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Last Name */}
            <div className="grid gap-2">
              <label htmlFor="last_name" className="text-sm font-medium">
                Nachname *
              </label>
              <input
                id="last_name"
                type="text"
                required
                disabled={!isEditing}
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Gender */}
            <div className="grid gap-2">
              <label htmlFor="gender" className="text-sm font-medium">
                Geschlecht
              </label>
              <select
                id="gender"
                disabled={!isEditing}
                value={formData.gender || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value
                      ? (e.target.value as "M" | "F" | "D")
                      : null,
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Bitte wählen</option>
                <option value="M">Männlich</option>
                <option value="F">Weiblich</option>
                <option value="D">Divers</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="grid gap-2">
              <label htmlFor="date_of_birth" className="text-sm font-medium">
                Geburtsdatum
              </label>
              <input
                id="date_of_birth"
                type="date"
                disabled={!isEditing}
                value={formData.date_of_birth || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    date_of_birth: e.target.value || null,
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Action Buttons */}
            {isEditing && (
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
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Abbrechen
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
