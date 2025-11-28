"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { CartItem, DbCartItem, CartContextType } from "@/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // Get cart from localStorage (for guests)
  const getLocalCart = (): CartItem[] => {
    if (typeof window === "undefined") return [];
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  };

  // Save cart to localStorage (for guests)
  const saveLocalCart = (cartItems: CartItem[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("cart", JSON.stringify(cartItems));
  };

  // Load cart from database
  const loadDatabaseCart = useCallback(
    async (userId: string) => {
      try {
        // Get or create cart
        let { data: cart } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", userId)
          .eq("status", "OPEN")
          .single();

        if (!cart) {
          // Create new cart
          const { data: newCart } = await supabase
            .from("carts")
            .insert({ user_id: userId })
            .select("id")
            .single();
          cart = newCart;
        }

        if (cart) {
          // Get cart items with product details
          const { data: cartItems } = await supabase
            .from("cart_items")
            .select(
              `
            id,
            quantity,
            price_at_add,
            variant_id,
            product_variants!inner(
              id,
              name,
              price,
              compare_at_price,
              stock_quantity,
              product_id,
              products!inner(
                id,
                name,
                slug
              )
            )
          `
            )
            .eq("cart_id", cart.id);

          if (cartItems) {
            // Get primary images for each product
            const productIds = (cartItems as DbCartItem[])
              .map((item) => {
                // Handle both array and object responses from Supabase
                const variant = Array.isArray(item.product_variants)
                  ? item.product_variants[0]
                  : item.product_variants;
                return variant?.product_id;
              })
              .filter((id): id is string => id !== undefined);

            const { data: images } = await supabase
              .from("product_images")
              .select("product_id, image_url")
              .in("product_id", productIds)
              .eq("is_primary", true);

            const imageMap = new Map(
              images?.map((img) => [img.product_id, img.image_url]) || []
            );

            const formattedItems: CartItem[] = (cartItems as DbCartItem[])
              .filter((item) => {
                // Handle both array and object responses from Supabase
                const variant = Array.isArray(item.product_variants)
                  ? item.product_variants[0]
                  : item.product_variants;
                const product = variant
                  ? Array.isArray(variant.products)
                    ? variant.products[0]
                    : variant.products
                  : null;
                return variant && product;
              })
              .map((item) => {
                // Handle both array and object responses from Supabase
                const variant = Array.isArray(item.product_variants)
                  ? item.product_variants[0]
                  : item.product_variants;
                const product = Array.isArray(variant.products)
                  ? variant.products[0]
                  : variant.products;

                return {
                  id: item.id,
                  variant_id: item.variant_id,
                  product_id: variant.product_id,
                  product_name: product.name,
                  variant_name: variant.name,
                  price: parseFloat(item.price_at_add),
                  original_price: variant.compare_at_price
                    ? parseFloat(variant.compare_at_price)
                    : parseFloat(variant.price),
                  quantity: item.quantity,
                  image_url: imageMap.get(variant.product_id) || null,
                  stock_quantity: variant.stock_quantity,
                };
              });

            setItems(formattedItems);
          }
        }
      } catch (error) {
        console.error("Error loading cart from database:", error);
        setItems([]);
      }
    },
    [supabase]
  );

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);

      // Check if user is logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      if (user) {
        // Load from database for logged-in users
        await loadDatabaseCart(user.id);
      } else {
        // Load from localStorage for guests
        setItems(getLocalCart());
      }

      setIsLoading(false);
    };

    loadCart();
  }, [loadDatabaseCart, supabase.auth]);

  // Refresh cart
  const refreshCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await loadDatabaseCart(user.id);
    } else {
      setItems(getLocalCart());
    }
  };

  // Add to cart
  const addToCart = async (
    variantId: string,
    productId: string,
    productName: string,
    variantName: string,
    price: number,
    imageUrl: string | null,
    stockQuantity: number,
    quantity: number = 1
  ) => {
    if (userId) {
      // Add to database for logged-in users
      try {
        // Get or create cart
        let { data: cart } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", userId)
          .eq("status", "OPEN")
          .single();

        if (!cart) {
          const { data: newCart } = await supabase
            .from("carts")
            .insert({ user_id: userId })
            .select("id")
            .single();
          cart = newCart;
        }

        if (cart) {
          // Check if item already exists
          const { data: existingItem } = await supabase
            .from("cart_items")
            .select("id, quantity")
            .eq("cart_id", cart.id)
            .eq("variant_id", variantId)
            .single();

          if (existingItem) {
            // Update quantity
            await supabase
              .from("cart_items")
              .update({ quantity: existingItem.quantity + quantity })
              .eq("id", existingItem.id);
          } else {
            // Insert new item
            await supabase.from("cart_items").insert({
              cart_id: cart.id,
              variant_id: variantId,
              quantity,
              price_at_add: price,
            });
          }

          await loadDatabaseCart(userId);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      // Add to localStorage for guests
      const localCart = getLocalCart();
      const existingItemIndex = localCart.findIndex(
        (item) => item.variant_id === variantId
      );

      if (existingItemIndex > -1) {
        localCart[existingItemIndex].quantity += quantity;
      } else {
        localCart.push({
          id: `local-${Date.now()}-${variantId}`,
          variant_id: variantId,
          product_id: productId,
          product_name: productName,
          variant_name: variantName,
          price,
          quantity,
          image_url: imageUrl,
          stock_quantity: stockQuantity,
        });
      }

      saveLocalCart(localCart);
      setItems(localCart);
    }
  };

  // Update quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    if (userId) {
      // Update in database
      try {
        await supabase.from("cart_items").update({ quantity }).eq("id", itemId);

        await loadDatabaseCart(userId);
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else {
      // Update in localStorage
      const localCart = getLocalCart();
      const itemIndex = localCart.findIndex((item) => item.id === itemId);

      if (itemIndex > -1) {
        localCart[itemIndex].quantity = quantity;
        saveLocalCart(localCart);
        setItems(localCart);
      }
    }
  };

  // Remove item
  const removeItem = async (itemId: string) => {
    if (userId) {
      // Remove from database
      try {
        await supabase.from("cart_items").delete().eq("id", itemId);
        await loadDatabaseCart(userId);
      } catch (error) {
        console.error("Error removing item:", error);
      }
    } else {
      // Remove from localStorage
      const localCart = getLocalCart().filter((item) => item.id !== itemId);
      saveLocalCart(localCart);
      setItems(localCart);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (userId) {
      try {
        const { data: cart } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", userId)
          .eq("status", "OPEN")
          .single();

        if (cart) {
          await supabase.from("cart_items").delete().eq("cart_id", cart.id);
        }

        setItems([]);
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    } else {
      localStorage.removeItem("cart");
      setItems([]);
    }
  };

  // Calculate totals
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
