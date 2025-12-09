"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthContext";
import type { Database } from "@/types";

type Review = Database["public"]["Tables"]["reviews"]["Row"];
type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

interface ReviewContextType {
  createReview: (
    review: ReviewInsert
  ) => Promise<{ data: Review | null; error: Error | null }>;
  updateReview: (
    id: string,
    updates: Partial<ReviewInsert>
  ) => Promise<{ data: Review | null; error: Error | null }>;
  deleteReview: (id: string) => Promise<{ error: Error | null }>;
  getProductReviews: (
    productId: string
  ) => Promise<{ data: Review[] | null; error: Error | null }>;
  getUserReviews: () => Promise<{ data: Review[] | null; error: Error | null }>;
  getUserReviewForProduct: (
    productId: string
  ) => Promise<{ data: Review | null; error: Error | null }>;
  checkUserCanReview: (
    productId: string
  ) => Promise<{
    canReview: boolean;
    hasPurchased: boolean;
    hasReviewed: boolean;
  }>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { user } = useAuth();

  const createReview = useCallback(async (review: ReviewInsert) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert(review)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error creating review:", error);
      return { data: null, error: error as Error };
    }
  }, [supabase]);

  const updateReview = useCallback(async (id: string, updates: Partial<ReviewInsert>) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error updating review:", error);
      return { data: null, error: error as Error };
    }
  }, [supabase]);

  const deleteReview = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error deleting review:", error);
      return { error: error as Error };
    }
  }, [supabase]);

  const getProductReviews = useCallback(async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          *,
          profiles:user_id (
            id,
            first_name,
            last_name
          )
        `
        )
        .eq("product_id", productId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      return { data: null, error: error as Error };
    }
  }, [supabase]);

  const getUserReviews = useCallback(async () => {
    if (!user) return { data: null, error: new Error("Not authenticated") };

    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          *,
          products (
            id,
            name,
            slug
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      return { data: null, error: error as Error };
    }
  }, [user, supabase]);

  const getUserReviewForProduct = useCallback(async (productId: string) => {
    if (!user) return { data: null, error: null };

    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching user review:", error);
      return { data: null, error: error as Error };
    }
  }, [user, supabase]);

  const checkUserCanReview = useCallback(async (productId: string) => {
    if (!user) {
      return { canReview: false, hasPurchased: false, hasReviewed: false };
    }

    try {
      // Check if user has purchased this specific product
      // User must have an order containing this product (any status except cancelled/failed)
      const { data: orderData, error: orderError } = await supabase
        .from("order_items")
        .select(
          `
          id,
          product_id,
          orders!inner (
            user_id,
            status
          )
        `
        )
        .eq("product_id", productId)
        .eq("orders.user_id", user.id)
        .not("orders.status", "in", "(cancelled,failed,refunded)")
        .limit(1);

      if (orderError) {
        console.error("Error fetching order data:", orderError);
      }

      console.log(
        "Order check for product:",
        productId,
        "User:",
        user.id,
        "Result:",
        orderData
      );

      const hasPurchased = !!(orderData && orderData.length > 0);

      // Check if user already reviewed this product
      const { data: reviewData, error: reviewError } = await supabase
        .from("reviews")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (reviewError) {
        console.error("Error fetching review data:", reviewError);
      }

      const hasReviewed = !!reviewData;

      console.log("Review permission check:", {
        productId,
        userId: user.id,
        hasPurchased,
        hasReviewed,
        canReview: hasPurchased && !hasReviewed,
      });

      return {
        canReview: hasPurchased && !hasReviewed ? true : false,
        hasPurchased: hasPurchased ? true : false,
        hasReviewed: hasReviewed ? true : false,
      };
    } catch (error) {
      console.error("Error checking review permission:", error);
      return { canReview: false, hasPurchased: false, hasReviewed: false };
    }
  }, [user, supabase]);

  const contextValue = useMemo(
    () => ({
      createReview,
      updateReview,
      deleteReview,
      getProductReviews,
      getUserReviews,
      getUserReviewForProduct,
      checkUserCanReview,
    }),
    [createReview, updateReview, deleteReview, getProductReviews, getUserReviews, getUserReviewForProduct, checkUserCanReview]
  );

  return (
    <ReviewContext.Provider value={contextValue}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewProvider");
  }
  return context;
}
