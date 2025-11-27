"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { AddressesSection } from "@/components/profile/AddressesSection";

export default function UserProfile() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "addresses">(
    "profile"
  );

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(
        "/auth/login?message=Bitte melden Sie sich an um Ihr Profil zu sehen."
      );
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Lädt...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mein Profil</h1>
        <p className="text-muted-foreground mt-2">
          Verwalten Sie Ihre persönlichen Daten und Adressen
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-8">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
            }`}
          >
            Persönliche Daten
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "addresses"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
            }`}
          >
            Adressen
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "profile" && <ProfileSection />}
        {activeTab === "addresses" && <AddressesSection />}
      </div>
    </div>
  );
}
