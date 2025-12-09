import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { Mail, Calendar, ShoppingBag } from "lucide-react";

async function getCustomers() {
  // Verify admin access first with regular client
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return [];

  // Use service role to get all profiles (bypasses RLS)
  const adminClient = createServiceRoleClient();
  const { data: profiles } = await adminClient
    .from("profiles")
    .select(
      `
      *,
      orders(count)
    `
    )
    .order("created_at", { ascending: false });

  // Get emails from auth.users for each profile
  const profilesWithEmails = await Promise.all(
    (profiles || []).map(async (profile) => {
      const {
        data: { user },
      } = await adminClient.auth.admin.getUserById(profile.id);
      return { ...profile, email: user?.email };
    })
  );

  return profilesWithEmails || [];
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="mt-2 text-gray-600">View and manage customer accounts</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {customers.length}
              </p>
            </div>
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active This Month</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {
                  customers.filter((c) => {
                    const created = new Date(c.created_at);
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return created > monthAgo;
                  }).length
                }
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">With Orders</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {
                  customers.filter((c) => {
                    const orderCount = Array.isArray(c.orders)
                      ? c.orders[0]?.count || 0
                      : 0;
                    return orderCount > 0;
                  }).length
                }
              </p>
            </div>
            <ShoppingBag className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm font-medium text-gray-700">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => {
                const orderCount = Array.isArray(customer.orders)
                  ? customer.orders[0]?.count || 0
                  : 0;

                return (
                  <tr key={customer.id} className="text-sm hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {customer.full_name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {customer.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          customer.role === "admin"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-900">
                        <ShoppingBag className="h-4 w-4" />
                        {orderCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(customer.created_at).toLocaleDateString(
                        "de-DE",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {customers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
