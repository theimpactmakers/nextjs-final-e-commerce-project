import { createClient } from "@/lib/supabase/server";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

async function getOrders() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles!user_id(email, full_name),
      shipping_methods(name),
      payment_methods(name)
    `
    )
    .order("created_at", { ascending: false });

  return orders || [];
}

export default async function OrdersPage() {
  const orders = await getOrders();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Package className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="mt-2 text-gray-600">View and manage customer orders</p>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm font-medium text-gray-700">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Shipping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => {
                const customerEmail = Array.isArray(order.profiles)
                  ? order.profiles[0]?.email
                  : order.guest_email;
                const customerName = Array.isArray(order.profiles)
                  ? order.profiles[0]?.full_name
                  : null;

                return (
                  <tr key={order.id} className="text-sm hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs">
                        {order.id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {customerName && (
                          <div className="font-medium text-gray-900">
                            {customerName}
                          </div>
                        )}
                        <div className="text-xs text-gray-600">
                          {customerEmail || "Guest"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      €{order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          order.payment_status === "paid"
                            ? "bg-green-100 text-green-800"
                            : order.payment_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {Array.isArray(order.shipping_methods)
                        ? order.shipping_methods[0]?.name || "N/A"
                        : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
