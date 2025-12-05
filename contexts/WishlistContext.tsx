"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type WishlistItem = {
  productId: string;
  addedAt: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  wishlistCount: number;
  isLoading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const WISHLIST_STORAGE_KEY = "user-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load wishlist on mount and when user changes
  useEffect(() => {
    const supabase = createClient();

    const loadWishlist = async () => {
      setIsLoading(true);

      if (user) {
        // Authenticated user: load from database
        const { data, error } = await supabase
          .from("wishlist_items")
          .select("product_id, added_at")
          .eq("user_id", user.id)
          .order("added_at", { ascending: false });

        if (error) {
          console.error("Error loading wishlist from database:", error);
          setWishlist([]);
        } else {
          const items = (data || []).map((item) => ({
            productId: item.product_id,
            addedAt: item.added_at || new Date().toISOString(),
          }));
          setWishlist(items);

          // Sync localStorage wishlist to database on login
          const localWishlist = loadLocalWishlist();
          if (localWishlist.length > 0) {
            await syncLocalToDatabase(localWishlist, user.id, supabase);
            localStorage.removeItem(WISHLIST_STORAGE_KEY);

            // Reload wishlist after sync to get the merged data
            const { data: updatedData } = await supabase
              .from("wishlist_items")
              .select("product_id, added_at")
              .eq("user_id", user.id)
              .order("added_at", { ascending: false });

            if (updatedData) {
              const updatedItems = updatedData.map((item) => ({
                productId: item.product_id,
                addedAt: item.added_at || new Date().toISOString(),
              }));
              setWishlist(updatedItems);
            }
          }
        }
      } else {
        // Guest user: load from localStorage
        const localWishlist = loadLocalWishlist();
        setWishlist(localWishlist);
      }

      setIsLoading(false);
    };

    loadWishlist();
  }, [user]);

  const loadLocalWishlist = (): WishlistItem[] => {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("Error parsing localStorage wishlist:", error);
        return [];
      }
    }
    return [];
  };

  const syncLocalToDatabase = async (
    localItems: WishlistItem[],
    userId: string,
    supabase: ReturnType<typeof createClient>
  ) => {
    // Insert items one by one, ignoring duplicates
    for (const item of localItems) {
      const { error } = await supabase
        .from("wishlist_items")
        .insert({
          user_id: userId,
          product_id: item.productId,
          added_at: item.addedAt,
        })
        .select();

      // Ignore duplicate key errors (23505 is PostgreSQL unique violation)
      if (error && !error.message.includes("duplicate key")) {
        console.error("Error syncing item to database:", error);
      }
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => item.productId === productId);
  };

  const addToWishlist = async (productId: string) => {
    if (isInWishlist(productId)) return;

    const newItem = { productId, addedAt: new Date().toISOString() };

    if (user) {
      // Authenticated: add to database
      const supabase = createClient();
      const { error } = await supabase
        .from("wishlist_items")
        .insert({
          user_id: user.id,
          product_id: productId,
          added_at: newItem.addedAt,
        })
        .select();

      if (error) {
        console.error("Error adding to wishlist:", error);
        // Don't update UI if database operation failed
        return;
      }

      // Only update local state if database operation succeeded
      setWishlist((prev) => [newItem, ...prev]);
    } else {
      // Guest: add to localStorage
      const updated = [newItem, ...wishlist];
      setWishlist(updated);
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    }

    // Show success toast with heart animation
    toast.custom(
      () => (
        <div className="flex items-center gap-3 bg-card border-2 border-primary/20 rounded-lg p-4 shadow-xl animate-slide-in-right">
          <div className="shrink-0">
            <div className="relative">
              <svg
                className="w-10 h-10 text-primary animate-heartbeat"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-bold text-primary text-base">
              Zur Wunschliste hinzugefügt!
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Produkt wurde gespeichert
            </p>
          </div>
        </div>
      ),
      {
        duration: 3000,
      }
    );
  };

  const removeFromWishlist = async (productId: string) => {
    if (user) {
      // Authenticated: remove from database
      const supabase = createClient();
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) {
        console.error("Error removing from wishlist:", error);
        // Don't update UI if database operation failed
        return;
      }

      // Only update local state if database operation succeeded
      setWishlist((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } else {
      // Guest: remove from localStorage
      const updated = wishlist.filter((item) => item.productId !== productId);
      setWishlist(updated);
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const clearWishlist = async () => {
    if (user) {
      // Authenticated: clear database
      const supabase = createClient();
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("Error clearing wishlist:", error);
        // Don't update UI if database operation failed
        return;
      }

      // Only update local state if database operation succeeded
      setWishlist([]);
    } else {
      // Guest: clear localStorage
      setWishlist([]);
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
