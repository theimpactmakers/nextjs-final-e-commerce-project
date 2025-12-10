import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { Package, ShoppingCart, Users, Euro } from "lucide-react";

async function getAdminStats() {
  const supabase = await createClient();
  const adminClient = createServiceRoleClient();

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
      user_id
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  // Get emails from auth.users for orders with user_id
  const ordersWithEmails: Array<{
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    payment_status: string;
    guest_email: string | null;
    user_id: string | null;
    userEmail?: string;
  }> = await Promise.all(
    (recentOrders || []).map(async (order) => {
      if (order.user_id) {
        const {
          data: { user },
        } = await adminClient.auth.admin.getUserById(order.user_id);
        return { ...order, userEmail: user?.email };
      }
      return order;
    })
  );

  return {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    totalCustomers: totalCustomers || 0,
    totalRevenue,
    recentOrders: ordersWithEmails || [],
  };
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const statCards = [
    {
      title: "Produkte Gesamt",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Bestellungen Gesamt",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Kunden",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-purple-500",
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
              className="relative overflow-hidden rounded-lg bg-card border border-border p-6 shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
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
