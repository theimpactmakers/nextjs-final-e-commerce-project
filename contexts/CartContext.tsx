"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { calculatePromotionDiscount } from "@/lib/supabase/products";
import type { CartItem, DbCartItem, CartContextType } from "@/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // Format cart items helper
  const formatCartItems = async (
    cartItems: DbCartItem[]
  ): Promise<CartItem[]> => {
    const productIds = (cartItems || [])
      .map((item) => {
        const variant = Array.isArray(item.product_variants)
          ? item.product_variants[0]
          : item.product_variants;
        return variant?.product_id;
      })
      .filter((id) => id);
    const { data: images } = await supabase
      .from("product_images")
      .select("product_id, image_url")
      .in("product_id", productIds)
      .eq("is_primary", true);
    const imageMap = new Map<string, string>(
      (images?.map((img: { product_id: string; image_url: string }) => [
        img.product_id,
        img.image_url,
      ]) || []) as [string, string][]
    );
    const formattedItemsPromises = (cartItems || [])
      .filter((item) => {
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
      .map(async (item) => {
        const variant = Array.isArray(item.product_variants)
          ? item.product_variants[0]
          : item.product_variants;
        const product = Array.isArray(variant.products)
          ? variant.products[0]
          : variant.products;
        const promotionData = await calculatePromotionDiscount(
          variant.product_id,
          variant.id,
          parseFloat(variant.price)
        );
        const basePrice = parseFloat(variant.price);
        const comparePrice = variant.compare_at_price
          ? parseFloat(variant.compare_at_price)
          : null;
        let finalPrice = basePrice;
        let originalPrice = comparePrice || basePrice;
        if (promotionData) {
          finalPrice = promotionData.discountedPrice;
          originalPrice = promotionData.originalPrice;
        }
        return {
          id: item.id,
          variant_id: item.variant_id,
          product_id: variant.product_id,
          product_name: product.name,
          variant_name: variant.name,
          price: finalPrice,
          original_price: originalPrice,
          quantity: item.quantity,
          image_url:
            typeof imageMap.get(variant.product_id) === "string"
              ? imageMap.get(variant.product_id)!
              : null,
          stock_quantity: variant.stock_quantity,
        };
      });
    return Promise.all(formattedItemsPromises);
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
          // Try insert, handle 409 by always updating quantity
          const { error: insertError } = await supabase
            .from("cart_items")
            .insert({
              cart_id: cart.id,
              variant_id: variantId,
              quantity,
              price_at_add: price,
            });
          if (insertError && insertError.code === "409") {
            // Always update quantity if conflict
            const { data: retryItem } = await supabase
              .from("cart_items")
              .select("id, quantity")
              .eq("cart_id", cart.id)
              .eq("variant_id", variantId)
              .single();
            if (retryItem) {
              await supabase
                .from("cart_items")
                .update({ quantity: retryItem.quantity + quantity })
                .eq("id", retryItem.id);
            }
          }
          // Always reload cart after insert/update
          const { data: cartReload } = await supabase
            .from("carts")
            .select("id")
            .eq("user_id", userId)
            .eq("status", "OPEN")
            .single();
          if (!cartReload) {
            setItems([]);
            return;
          }
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
            .eq("cart_id", cartReload.id);
          const formattedItems = await formatCartItems(cartItems || []);
          setItems(formattedItems);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      // Guest: Add to localStorage
      const localCart = getLocalCart();
      const itemIndex = localCart.findIndex(
        (item) => item.variant_id === variantId
      );
      if (itemIndex > -1) {
        localCart[itemIndex].quantity += quantity;
      } else {
        localCart.push({
          id: `${variantId}-${Date.now()}`,
          variant_id: variantId,
          product_id: productId,
          product_name: productName,
          variant_name: variantName,
          price,
          original_price: price,
          quantity,
          image_url: imageUrl,
          stock_quantity: stockQuantity,
        });
      }
      saveLocalCart(localCart);
      setItems(localCart);
    }
  };

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

  // Load promotion prices for local cart items
  const loadLocalCartWithPromotions = useCallback(async (): Promise<
    CartItem[]
  > => {
    const localCart = getLocalCart();

    const updatedCartPromises = localCart.map(async (item) => {
      // Calculate promotion discount
      const promotionData = await calculatePromotionDiscount(
        item.product_id,
        item.variant_id,
        item.original_price || item.price
      );

      if (promotionData) {
        return {
          ...item,
          price: promotionData.discountedPrice,
          original_price: promotionData.originalPrice,
        };
      }

      return item;
    });

    return Promise.all(updatedCartPromises);
  }, []);

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
          const { data: cartItems, error: cartItemsError } = await supabase
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

          // Debug-Logging für cartItems und Fehler
          console.log("[CARTCONTEXT] cartItems (raw):", cartItems);
          if (cartItemsError) {
            console.error("[CARTCONTEXT] cartItemsError:", cartItemsError);
          }

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
              images?.map((img: { product_id: string; image_url: string }) => [
                img.product_id,
                img.image_url,
              ]) || []
            );

            // Format items with promotion prices
            const formattedItemsPromises = (cartItems as DbCartItem[])
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
              .map(async (item) => {
                // Handle both array and object responses from Supabase
                const variant = Array.isArray(item.product_variants)
                  ? item.product_variants[0]
                  : item.product_variants;
                const product = Array.isArray(variant.products)
                  ? variant.products[0]
                  : variant.products;

                // Calculate promotion discount
                const promotionData = await calculatePromotionDiscount(
                  variant.product_id,
                  variant.id,
                  parseFloat(variant.price)
                );

                // Determine final price and original price
                const basePrice = parseFloat(variant.price);
                const comparePrice = variant.compare_at_price
                  ? parseFloat(variant.compare_at_price)
                  : null;

                let finalPrice = basePrice;
                let originalPrice = comparePrice || basePrice;

                // If there's an active promotion, use promotion price
                if (promotionData) {
                  finalPrice = promotionData.discountedPrice;
                  originalPrice = promotionData.originalPrice;
                }

                return {
                  id: item.id,
                  variant_id: item.variant_id,
                  product_id: variant.product_id,
                  product_name: product.name,
                  variant_name: variant.name,
                  price: finalPrice,
                  original_price: originalPrice,
                  quantity: item.quantity,
                  image_url: imageMap.get(variant.product_id) || null,
                  stock_quantity: variant.stock_quantity,
                };
              });

            const formattedItems = await Promise.all(formattedItemsPromises);
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
        // Load from localStorage for guests with promotion prices
        const cartWithPromotions = await loadLocalCartWithPromotions();
        setItems(cartWithPromotions);
      }

      setIsLoading(false);
    };

    loadCart();
  }, [loadDatabaseCart, loadLocalCartWithPromotions, supabase.auth]);

  // Refresh cart
  const refreshCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await loadDatabaseCart(user.id);
    } else {
      const cartWithPromotions = await loadLocalCartWithPromotions();
      setItems(cartWithPromotions);
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
  useEffect(() => {
    console.log("====================");
    console.log("[CARTCONTEXT] ITEMS:", items);
    console.log("[CARTCONTEXT] ITEMCOUNT:", itemCount);
    console.log("====================");
  }, [items, itemCount]);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const contextValue = useMemo(
    () => ({
      items,
      itemCount,
      totalPrice,
      isLoading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart,
    }),
    [items, itemCount, totalPrice, isLoading, addToCart, updateQuantity, removeItem, clearCart, refreshCart]
  );

  return (
    <CartContext.Provider value={contextValue}>
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
