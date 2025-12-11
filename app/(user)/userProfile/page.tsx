"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, lazy } from "react";

// ✅ Lazy load tab components for better performance (code splitting)
const ProfileSection = lazy(() =>
  import("@/components/profile/ProfileSection").then((m) => ({
    default: m.ProfileSection,
  }))
);
const AddressesSection = lazy(() =>
  import("@/components/profile/AddressesSection").then((m) => ({
    default: m.AddressesSection,
  }))
);
const WishlistSection = lazy(() =>
  import("@/components/profile/WishlistSection").then((m) => ({
    default: m.WishlistSection,
  }))
);
const OrdersSection = lazy(() =>
  import("@/components/profile/OrdersSection").then((m) => ({
    default: m.OrdersSection,
  }))
);

// Loading skeleton component
function TabLoadingSkeleton() {
  return (
    <div className="bg-card rounded-xl border shadow-sm animate-pulse">
      <div className="p-6 border-b border-border">
        <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 rounded"></div>
      </div>
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  );
}

function UserProfileContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "profile" | "addresses" | "wishlist" | "orders"
  >("profile");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Read tab from URL parameter on mount
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam === "wishlist" ||
      tabParam === "addresses" ||
      tabParam === "profile" ||
      tabParam === "orders"
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // ✅ Improved auth check with redirect state to prevent hanging
  useEffect(() => {
    if (!authLoading && !user && !isRedirecting) {
      setIsRedirecting(true);
      router.push(
        "/auth/login?message=Bitte melden Sie sich an um Ihr Profil zu sehen."
      );
    }
  }, [user, authLoading, router, isRedirecting]);

  // ✅ Show loading only while auth is loading or redirecting
  if (authLoading || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Lädt...</p>
        </div>
      </div>
    );
  }

  // ✅ Early return if no user (should redirect via useEffect)
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
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors hover:cursor-pointer ${
              activeTab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
            }`}
          >
            Persönliche Daten
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors hover:cursor-pointer ${
              activeTab === "addresses"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
            }`}
          >
            Adressen
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors hover:cursor-pointer ${
              activeTab === "wishlist"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
            }`}
          >
            Wunschliste
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors hover:cursor-pointer ${
              activeTab === "orders"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
            }`}
          >
            Bestellungen
          </button>
        </nav>
      </div>

      {/* Tab Content - Only render active tab with Suspense boundary */}
      <div className="mt-6">
        <Suspense fallback={<TabLoadingSkeleton />}>
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "addresses" && <AddressesSection />}
          {activeTab === "wishlist" && <WishlistSection />}
          {activeTab === "orders" && <OrdersSection />}
        </Suspense>
      </div>
    </div>
  );
}

export default function UserProfile() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-muted-foreground">Lädt...</p>
          </div>
        </div>
      }
    >
      <UserProfileContent />
    </Suspense>
  );
}
