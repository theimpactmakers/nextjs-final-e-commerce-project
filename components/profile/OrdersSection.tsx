"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/types/supabase";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export function OrdersSection() {
  const { user } = useAuth();
  const supabase = createClient();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "active" | "past">("all");

  useEffect(() => {
    if (user) {
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (*)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data as OrderWithItems[]) || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusInfo = (status: string) => {
    const isActive = ["pending", "confirmed", "shipped"].includes(status);

    switch (status) {
      case "pending":
        return {
          label: "In Bearbeitung",
          icon: Clock,
          color: isActive ? "text-primary" : "text-gray-400",
          bgColor: isActive ? "bg-muted" : "bg-gray-50",
          borderColor: isActive ? "border-muted" : "border-gray-200",
        };
      case "confirmed":
        return {
          label: "Bestätigt",
          icon: CheckCircle,
          color: isActive ? "text-primary" : "text-gray-400",
          bgColor: isActive ? "bg-secondary" : "bg-gray-50",
          borderColor: isActive ? "border-secondary" : "border-gray-200",
        };
      case "shipped":
        return {
          label: "Versandt",
          icon: Truck,
          color: isActive ? "text-accent" : "text-gray-400",
          bgColor: isActive ? "bg-accent/10" : "bg-gray-50",
          borderColor: isActive ? "border-accent/30" : "border-gray-200",
        };
      case "delivered":
        return {
          label: "Zugestellt",
          icon: Package,
          color: "text-gray-400",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
      case "cancelled":
        return {
          label: "Storniert",
          icon: XCircle,
          color: "text-gray-400",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
      default:
        return {
          label: status,
          icon: Clock,
          color: "text-gray-400",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const isActiveOrder = (status: string) => {
    return ["pending", "confirmed", "shipped"].includes(status);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "active") return isActiveOrder(order.status);
    if (filter === "past") return !isActiveOrder(order.status);
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
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Alle ({orders.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === "active"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Aktiv ({orders.filter((o) => isActiveOrder(o.status)).length})
        </button>
        <button
          onClick={() => setFilter("past")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === "past"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Abgeschlossen ({orders.filter((o) => !isActiveOrder(o.status)).length}
          )
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Keine Bestellungen gefunden
          </h3>
          <p className="text-muted-foreground">
            {filter === "active"
              ? "Sie haben derzeit keine aktiven Bestellungen."
              : filter === "past"
              ? "Sie haben noch keine abgeschlossenen Bestellungen."
              : "Sie haben noch keine Bestellungen aufgegeben."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            const isExpanded = expandedOrders.has(order.id);
            const isActive = isActiveOrder(order.status);

            return (
              <div
                key={order.id}
                className={`border-2 rounded-lg overflow-hidden transition-all ${
                  statusInfo.borderColor
                } ${isActive ? "shadow-md" : "shadow-sm"}`}
              >
                {/* Order Header */}
                <div
                  className={`p-4 ${statusInfo.bgColor} cursor-pointer hover:opacity-90 transition-opacity`}
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                        <span
                          className={`font-semibold ${
                            isActive ? "text-foreground" : "text-gray-500"
                          }`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <div
                        className={`text-sm ${
                          isActive ? "text-muted-foreground" : "text-gray-400"
                        }`}
                      >
                        Bestellnummer:{" "}
                        <span className="font-mono">{order.order_number}</span>
                      </div>
                      <div
                        className={`text-sm ${
                          isActive ? "text-muted-foreground" : "text-gray-400"
                        }`}
                      >
                        Bestellt am{" "}
                        {new Date(order.created_at!).toLocaleDateString(
                          "de-DE",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${
                          isActive ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {Number(order.total_amount).toFixed(2)} €
                      </div>
                      <div
                        className={`text-sm ${
                          isActive ? "text-muted-foreground" : "text-gray-400"
                        }`}
                      >
                        {order.order_items.length} Artikel
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    {isExpanded ? (
                      <ChevronUp
                        className={`w-5 h-5 ${
                          isActive ? "text-muted-foreground" : "text-gray-400"
                        }`}
                      />
                    ) : (
                      <ChevronDown
                        className={`w-5 h-5 ${
                          isActive ? "text-muted-foreground" : "text-gray-400"
                        }`}
                      />
                    )}
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                {isExpanded && (
                  <div className="p-4 bg-card border-t">
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold mb-3">
                          Bestellte Artikel:
                        </h4>
                        <div className="space-y-2">
                          {order.order_items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-start p-3 bg-muted/50 rounded-md"
                            >
                              <div>
                                <p className="font-medium">
                                  {item.product_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {item.variant_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Menge: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {Number(item.total_price).toFixed(2)} €
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {Number(item.unit_price).toFixed(2)} € / Stk.
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="border-t pt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Zwischensumme:
                            </span>
                            <span>{Number(order.subtotal).toFixed(2)} €</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Versandkosten:
                            </span>
                            <span>
                              {Number(order.shipping_cost) === 0
                                ? "Kostenlos"
                                : `${Number(order.shipping_cost).toFixed(2)} €`}
                            </span>
                          </div>
                          {order.discount_amount &&
                          Number(order.discount_amount) > 0 ? (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Rabatt:</span>
                              <span>
                                -{Number(order.discount_amount).toFixed(2)} €
                              </span>
                            </div>
                          ) : null}
                          <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Gesamt:</span>
                            <span className="text-green-600">
                              {Number(order.total_amount).toFixed(2)} €
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tracking Info */}
                      {order.tracking_number && (
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-2">
                            Sendungsverfolgung:
                          </h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <p className="text-sm">
                              <span className="font-medium">
                                Tracking-Nummer:
                              </span>{" "}
                              <span className="font-mono">
                                {order.tracking_number}
                              </span>
                            </p>
                            {order.carrier && (
                              <p className="text-sm mt-1">
                                <span className="font-medium">
                                  Versanddienstleister:
                                </span>{" "}
                                {order.carrier}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
