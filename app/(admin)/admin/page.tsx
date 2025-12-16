import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { Package, ShoppingCart, Users, Euro } from "lucide-react";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { OrderStatusChart } from "@/components/admin/OrderStatusChart";
import { CategorySalesChart } from "@/components/admin/CategorySalesChart";

// No cache - admin dashboard should show real-time data
export const revalidate = 0;

async function getAdminStats() {
  const supabase = await createClient();
  const adminClient = createServiceRoleClient();

  // Fetch all stats in parallel
  // ✅ Use adminClient for profiles to bypass RLS and get accurate count
  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: totalCustomers },
    { data: orders },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    adminClient.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("id, total_amount, payment_status"),
  ]);

  // ✅ Calculate revenue from paid orders - total_amount is already a number
  const paidOrders =
    orders?.filter((order) => order.payment_status === "paid") || [];

  const totalRevenue = paidOrders.reduce(
    (sum, order) => sum + (Number(order.total_amount) || 0),
    0
  );

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
      user_id
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  // ✅ OPTIMIZED: Batch fetch all user emails at once instead of N+1 queries
  const userIds = (recentOrders || [])
    .filter((order) => order.user_id)
    .map((order) => order.user_id!);

  // Fetch all users in a single batch request
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

  // Map emails to orders
  const ordersWithEmails: Array<{
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    payment_status: string;
    guest_email: string | null;
    user_id: string | null;
    userEmail?: string;
  }> = (recentOrders || []).map((order) => ({
    ...order,
    userEmail: order.user_id ? userEmailMap.get(order.user_id) : undefined,
  }));

  // Fetch all orders for charts
  const { data: allOrders } = await supabase
    .from("orders")
    .select("created_at, total_amount, payment_status, status")
    .order("created_at", { ascending: false });

  // Calculate revenue by last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const revenueByDay = last7Days.map((date) => {
    const dayOrders =
      allOrders?.filter((order) => order.created_at.split("T")[0] === date) ||
      [];
    const paidOrders = dayOrders.filter(
      (order) => order.payment_status === "paid"
    );
    return {
      date: new Date(date).toLocaleDateString("de-DE", {
        month: "short",
        day: "numeric",
      }),
      revenue: paidOrders.reduce(
        (sum, order) => sum + Number(order.total_amount),
        0
      ),
      orders: dayOrders.length,
    };
  });

  // Calculate order status distribution
  const statusCounts = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  allOrders?.forEach((order) => {
    if (order.status in statusCounts) {
      statusCounts[order.status as keyof typeof statusCounts]++;
    }
  });

  const orderStatusData = [
    { name: "Ausstehend", value: statusCounts.pending, color: "#C87C28" },
    { name: "Bestätigt", value: statusCounts.confirmed, color: "#000000" },
    {
      name: "In Bearbeitung",
      value: statusCounts.processing,
      color: "#a90329",
    },
    { name: "Versandt", value: statusCounts.shipped, color: "#6B4423" },
    { name: "Geliefert", value: statusCounts.delivered, color: "#8B7355" },
    { name: "Storniert", value: statusCounts.cancelled, color: "#4A4A4A" },
  ].filter((item) => item.value > 0);

  // Fetch category sales data - simplified approach
  // Get all paid order IDs first
  const paidOrderIds = paidOrders.map((order) => order.id);

  // Fetch order items for paid orders only
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("product_id, total_price, order_id")
    .in("order_id", paidOrderIds);

  // Get products data
  const productIds = [
    ...new Set(orderItems?.map((item) => item.product_id) || []),
  ];
  const { data: products } = await supabase
    .from("products")
    .select("id, age_group")
    .in("id", productIds);

  // Create product lookup map
  const productMap = new Map(products?.map((p) => [p.id, p.age_group]) || []);

  const categoryData = {
    JUNIOR: { revenue: 0, orders: new Set<string>() },
    ADULT: { revenue: 0, orders: new Set<string>() },
    SENIOR: { revenue: 0, orders: new Set<string>() },
  };

  orderItems?.forEach((item) => {
    const ageGroup = productMap.get(item.product_id);
    if (ageGroup && ageGroup in categoryData) {
      categoryData[ageGroup as keyof typeof categoryData].revenue += Number(
        item.total_price
      );
      categoryData[ageGroup as keyof typeof categoryData].orders.add(
        item.order_id
      );
    }
  });

  const categorySalesData = Object.entries(categoryData).map(
    ([key, value]) => ({
      category: key,
      revenue: value.revenue,
      orders: value.orders.size,
    })
  );

  return {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    totalCustomers: totalCustomers || 0,
    totalRevenue,
    recentOrders: ordersWithEmails || [],
    revenueByDay,
    orderStatusData,
    categorySalesData,
  };
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const statCards = [
    {
      title: "Produkte Gesamt",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-black",
    },
    {
      title: "Bestellungen Gesamt",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-primary",
    },
    {
      title: "Kunden",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-accent",
    },
    {
      title: "Umsatz",
      value: `€${stats.totalRevenue.toFixed(2)}`,
      icon: Euro,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Dashboard Übersicht
        </h1>
        <p className="mt-2 text-muted-foreground">
          Willkommen in Ihrem Admin Dashboard. Hier ist, was heute passiert.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="relative overflow-hidden rounded-lg bg-card border border-border p-6 shadow flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-bold text-black">{stat.title}</p>
                <div className={`rounded-full ${stat.color} p-3`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#a90329] mt-auto">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={stats.revenueByDay} />
        <OrderStatusChart data={stats.orderStatusData} />
      </div>

      <div className="grid gap-6">
        <CategorySalesChart data={stats.categorySalesData} />
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg bg-card border border-border p-6 shadow">
        <h2 className="mb-4 text-xl font-bold text-foreground">
          Letzte Bestellungen
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="pb-3">Bestell-ID</th>
                <th className="pb-3">Kunde</th>
                <th className="pb-3">Betrag</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Zahlung</th>
                <th className="pb-3">Datum</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-3 font-mono text-xs text-muted-foreground">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="py-3 text-foreground">
                    {order.userEmail || order.guest_email || "Guest"}
                  </td>
                  <td className="py-3 font-semibold text-foreground">
                    €{order.total_amount.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
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
                  <td className="py-3 text-muted-foreground">
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
