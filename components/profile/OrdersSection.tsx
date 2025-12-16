"use client";

import { useEffect, useState, memo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/types/supabase";
import Link from "next/link";
import Image from "next/image";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

interface ProductSlug {
  [productId: string]: string;
}

interface ProductImage {
  [productId: string]: string;
}

// ✅ Memoize to prevent unnecessary re-renders
export const OrdersSection = memo(function OrdersSection() {
  const { user } = useAuth();
  const supabase = createClient();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "months3" | "months6" | "year">(
    "months3"
  );
  const [productSlugs, setProductSlugs] = useState<ProductSlug>({});
  const [productImages, setProductImages] = useState<ProductImage>({});

  useEffect(() => {
    let mounted = true;

    const loadOrders = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`*, order_items (*)`)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (!mounted) return;

        setOrders((data as OrderWithItems[]) || []);

        // Load product slugs and images
        if (data && data.length > 0) {
          const productIds = Array.from(
            new Set(
              data.flatMap((order) =>
                order.order_items.map((item: OrderItem) => item.product_id)
              )
            )
          );

          const [productsResult, imagesResult] = await Promise.all([
            supabase.from("products").select("id, slug").in("id", productIds),
            supabase
              .from("product_images")
              .select("product_id, image_url")
              .in("product_id", productIds)
              .eq("is_primary", true),
          ]);

          if (productsResult.data && mounted) {
            const slugMap: ProductSlug = {};
            productsResult.data.forEach((product) => {
              slugMap[product.id] = product.slug;
            });
            setProductSlugs(slugMap);
          }

          if (imagesResult.data && mounted) {
            const imageMap: ProductImage = {};
            imagesResult.data.forEach((image) => {
              imageMap[image.product_id] = image.image_url;
            });
            setProductImages(imageMap);
          }
        }
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [user, supabase]);

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "In Bearbeitung";
      case "confirmed":
        return "Bestätigt";
      case "shipped":
        return "Versandt";
      case "delivered":
        return "Zugestellt";
      case "cancelled":
        return "Storniert";
      default:
        return status;
    }
  };

  const getDeliveryDate = (order: Order) => {
    if (order.delivered_at) {
      return new Date(order.delivered_at).toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
      });
    }
    if (order.shipped_at) {
      const shippedDate = new Date(order.shipped_at);
      shippedDate.setDate(shippedDate.getDate() + 3); // Add 3 days
      return shippedDate.toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
      });
    }
    return null;
  };

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at!);
    const now = new Date();
    const monthsAgo = new Date();

    if (filter === "months3") {
      monthsAgo.setMonth(now.getMonth() - 3);
      return orderDate >= monthsAgo;
    } else if (filter === "months6") {
      monthsAgo.setMonth(now.getMonth() - 6);
      return orderDate >= monthsAgo;
    } else if (filter === "year") {
      monthsAgo.setFullYear(now.getFullYear() - 1);
      return orderDate >= monthsAgo;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">
            Bestellungen werden geladen...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {filteredOrders.length} Bestellung
          {filteredOrders.length !== 1 ? "en" : ""} aufgegeben in
        </span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary hover:cursor-pointer"
        >
          <option value="months3">den letzten 3 Monaten</option>
          <option value="months6">den letzten 6 Monaten</option>
          <option value="year">dem letzten Jahr</option>
          <option value="all">allen Jahren</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-semibold mb-2">
            Keine Bestellungen gefunden
          </h3>
          <p className="text-muted-foreground">
            Sie haben in diesem Zeitraum keine Bestellungen aufgegeben.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const deliveryDate = getDeliveryDate(order);
            const orderDate = new Date(order.created_at!);

            return (
              <div
                key={order.id}
                className="border rounded-lg bg-white overflow-hidden"
              >
                {/* Order Header - Amazon Style */}
                <div className="bg-muted/30 px-6 py-3 border-b grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase">
                      Bestellung aufgegeben
                    </div>
                    <div className="text-sm font-medium">
                      {orderDate.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase">
                      Summe
                    </div>
                    <div className="text-sm font-medium">
                      {Number(order.total_amount).toFixed(2)} €
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase">
                      Versandadresse
                    </div>
                    <div className="text-sm font-medium">
                      {typeof order.shipping_address === "object" &&
                      order.shipping_address !== null
                        ? (
                            order.shipping_address as {
                              first_name?: string;
                              last_name?: string;
                            }
                          )?.first_name || "N/A"
                        : "N/A"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground uppercase">
                      Bestellnr.
                    </div>
                    <div className="text-sm font-mono">
                      {order.order_number}
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  {/* Delivery Status */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-primary mb-1">
                      {order.status === "delivered"
                        ? `Zugestellt ${deliveryDate || ""}`
                        : order.status === "shipped"
                        ? `Versandt - Ankunft ${deliveryDate || ""}`
                        : getStatusText(order.status)}
                    </h3>
                    {order.tracking_number && (
                      <p className="text-sm text-muted-foreground">
                        Sendungsnummer:{" "}
                        <span className="font-mono text-foreground">
                          {order.tracking_number}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-muted/50 rounded flex items-center justify-center shrink-0 overflow-hidden">
                          {item.product_id && productImages[item.product_id] ? (
                            <Image
                              src={productImages[item.product_id]}
                              alt={item.product_name || "Produkt"}
                              width={96}
                              height={96}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <svg
                              className="w-12 h-12 text-muted-foreground/50"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">
                            {item.product_name}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.variant_name}
                          </p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Menge:{" "}
                              <span className="text-foreground">
                                {item.quantity}
                              </span>
                            </span>
                            <span className="text-muted-foreground">
                              Preis:{" "}
                              <span className="text-foreground">
                                {Number(item.unit_price).toFixed(2)} €
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          {item.product_id && productSlugs[item.product_id] ? (
                            <Link
                              href={`/products/${
                                productSlugs[item.product_id]
                              }`}
                              className="px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-md text-sm font-medium transition-colors text-center hover:cursor-pointer"
                            >
                              Artikel anzeigen
                            </Link>
                          ) : (
                            <button
                              disabled
                              className="px-4 py-2 bg-muted text-muted-foreground rounded-md text-sm font-medium cursor-not-allowed"
                            >
                              Artikel anzeigen
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
