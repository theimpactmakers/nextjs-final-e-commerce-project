/**
 * Checkout UI Types
 * Type definitions for the checkout process UI/business logic
 * Database types (shipping_methods, payment_methods) are imported from supabase.ts
 */

export type CheckoutStep = "data" | "delivery" | "payment" | "review";
