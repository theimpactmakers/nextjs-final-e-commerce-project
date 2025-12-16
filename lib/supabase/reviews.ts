import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types";

type Review = Database["public"]["Tables"]["reviews"]["Row"];

export async function getProductWithRatings(productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products_with_ratings")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    console.error("Error fetching product with ratings:", error);
    return null;
  }

  return data;
}

export async function getProductReviews(productId: string, limit: number = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      profiles:user_id (
        id,
        first_name,
        last_name
      )
    `)
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }

  return data;
}

export async function checkUserCanReview(userId: string, productId: string) {
  const supabase = await createClient();

  // Check if user has purchased this product
  const { data: orderData } = await supabase
    .from("order_items")
    .select(`
      id,
      orders!inner (
        user_id,
        status
      )
    `)
    .eq("orders.user_id", userId)
    .eq("orders.status", "delivered")
    .limit(1);

  const hasPurchased = orderData && orderData.length > 0;

  // Check if user already reviewed this product
  const { data: reviewData } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  const hasReviewed = !!reviewData;

  return {
    canReview: !hasReviewed,
    hasPurchased,
    hasReviewed,
  };
}

export async function getReviewStats(productId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("is_approved", true);

  if (!data || data.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const totalReviews = data.length;
  const sumRatings = data.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = sumRatings / totalReviews;

  const ratingDistribution = data.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    ratingDistribution: {
      5: ratingDistribution[5] || 0,
      4: ratingDistribution[4] || 0,
      3: ratingDistribution[3] || 0,
      2: ratingDistribution[2] || 0,
      1: ratingDistribution[1] || 0,
    },
  };
}
