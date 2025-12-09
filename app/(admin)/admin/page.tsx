import { createClient } from "@/lib/supabase/server";
import { Package, ShoppingCart, Users, Euro } from "lucide-react";

async function getAdminStats() {
  const supabase = await createClient();

  // Fetch all stats in parallel
  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: totalCustomers },
    { data: orders },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_amount, payment_status"),
  ]);

  // Calculate revenue from paid orders
  const totalRevenue =
    orders
      ?.filter((order) => order.payment_status === "paid")
      .reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

  // Recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(
      `
      id, 
      created_at, 
      total_amount, 
      status, 
      payment_status, 
      guest_email, 
      user_id,
      profiles!user_id(email)
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    totalCustomers: totalCustomers || 0,
    totalRevenue,
    recentOrders: recentOrders || [],
  };
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Revenue",
      value: `€${stats.totalRevenue.toFixed(2)}`,
      icon: Euro,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your admin dashboard. Here&apos;s what&apos;s happening
          today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="relative overflow-hidden rounded-lg bg-white p-6 shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-full ${stat.color} p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-gray-600">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="py-3">
                    {Array.isArray(order.profiles)
                      ? order.profiles[0]?.email || order.guest_email || "Guest"
                      : order.guest_email || "Guest"}
                  </td>
                  <td className="py-3 font-semibold">
                    €{order.total_amount.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        order.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
