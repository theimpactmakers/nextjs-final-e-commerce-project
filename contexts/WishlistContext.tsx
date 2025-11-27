"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type WishlistItem = {
  productId: string;
  addedAt: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const WISHLIST_STORAGE_KEY = "user-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Error loading wishlist:", error);
        setWishlist([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => item.productId === productId);
  };

  const addToWishlist = (productId: string) => {
    if (!isInWishlist(productId)) {
      setWishlist((prev) => [
        ...prev,
        { productId, addedAt: new Date().toISOString() },
      ]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
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
