import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { OrderStatusSelect, PaymentStatusSelect } from "./OrderStatusSelects";

// Cache for 2 minutes - orders need more frequent updates than dashboard
export const revalidate = 120;

async function getOrders(page: number = 1, perPage: number = 25) {
  const supabase = await createClient();
  const adminClient = createServiceRoleClient();

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // Get total count and data in parallel
  const [{ count }, { data: orders }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select(
        `
        *,
        profiles!user_id(first_name, last_name)
      `
      )
      .order("created_at", { ascending: false })
      .range(from, to),
  ]);

  // ✅ OPTIMIZED: Batch fetch all user emails instead of N+1 queries
  const userIds = (orders || [])
    .filter((order) => order.user_id)
    .map((order) => order.user_id!);

  const userEmailMap = new Map<string, string>();
  if (userIds.length > 0) {
    const {
      data: { users },
    } = await adminClient.auth.admin.listUsers();
    users?.forEach((user) => {
      if (userIds.includes(user.id)) {
        userEmailMap.set(user.id, user.email || "");
      }
    });
  }

  const ordersWithEmails = (orders || []).map((order) => ({
    ...order,
    userEmail: order.user_id ? userEmailMap.get(order.user_id) : undefined,
  }));

  return {
    orders: ordersWithEmails || [],
    totalCount: count || 0,
    currentPage: page,
    perPage,
    totalPages: Math.ceil((count || 0) / perPage),
  };
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const {
    orders: ordersWithEmails,
    totalCount,
    currentPage,
    totalPages,
  } = await getOrders(page);

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
        <h1 className="text-3xl font-bold text-gray-900">Bestellungen</h1>
        <p className="mt-2 text-gray-600">
          Kundenbestellungen anzeigen und verwalten
        </p>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm font-medium text-gray-700">
                <th className="px-6 py-4">Bestell-ID</th>
                <th className="px-6 py-4">Kunde</th>
                <th className="px-6 py-4">Datum</th>
                <th className="px-6 py-4">Betrag</th>
                <th className="px-6 py-4">Zahlung</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Versand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ordersWithEmails.map((order) => {
                const customerEmail = order.userEmail || order.guest_email;
                const profile = Array.isArray(order.profiles)
                  ? order.profiles[0]
                  : order.profiles;
                const customerName = profile
                  ? `${profile.first_name || ""} ${
                      profile.last_name || ""
                    }`.trim()
                  : order.guest_first_name && order.guest_last_name
                  ? `${order.guest_first_name} ${order.guest_last_name}`
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
                          {customerEmail || "Gast"}
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
                      <PaymentStatusSelect
                        orderId={order.id}
                        currentStatus={order.payment_status}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                      />
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

        {ordersWithEmails.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">Keine Bestellungen gefunden</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg bg-white px-6 py-4 shadow">
          <div className="text-sm text-gray-600">
            Zeige {(currentPage - 1) * 25 + 1} bis{" "}
            {Math.min(currentPage * 25, totalCount)} von {totalCount}{" "}
            Bestellungen
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/orders?page=${currentPage - 1}`}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm ${
                currentPage === 1
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Zurück
            </Link>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  // Show first, last, current, and adjacent pages
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(pageNum - currentPage) <= 1
                  ) {
                    return (
                      <Link
                        key={pageNum}
                        href={`/admin/orders?page=${pageNum}`}
                        className={`rounded-lg px-3 py-2 text-sm ${
                          pageNum === currentPage
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}
            </div>
            <Link
              href={`/admin/orders?page=${currentPage + 1}`}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm ${
                currentPage === totalPages
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-disabled={currentPage === totalPages}
            >
              Weiter
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
