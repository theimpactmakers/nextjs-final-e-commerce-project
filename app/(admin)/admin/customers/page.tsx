import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { Mail, Calendar, ShoppingBag, Search, Eye } from "lucide-react";
import Link from "next/link";

// Cache for 3 minutes
export const revalidate = 180;

async function getCustomers(
  page: number = 1,
  perPage: number = 25,
  search: string = ""
) {
  // Verify admin access first with regular client
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { customers: [], totalCount: 0 };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { customers: [], totalCount: 0 };

  // Use service role to get all profiles (bypasses RLS)
  const adminClient = createServiceRoleClient();

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // ✅ OPTIMIZED: Server-side search using database query (much faster)
  let countQuery = adminClient
    .from("profiles")
    .select("*", { count: "exact", head: true });
  let dataQuery = adminClient
    .from("profiles")
    .select(
      `
      *,
      orders(count)
    `
    )
    .order("created_at", { ascending: false });

  // Apply server-side search filter if provided
  if (search) {
    const searchPattern = `%${search}%`;
    countQuery = countQuery.or(
      `first_name.ilike.${searchPattern},last_name.ilike.${searchPattern}`
    );
    dataQuery = dataQuery.or(
      `first_name.ilike.${searchPattern},last_name.ilike.${searchPattern}`
    );
  }

  const [{ count }, { data: profiles }] = await Promise.all([
    countQuery,
    dataQuery.range(from, to),
  ]);

  // ✅ OPTIMIZED: Batch fetch all user emails instead of N+1 queries
  const userIds = (profiles || []).map((profile) => profile.id);
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

  const profilesWithEmails = (profiles || []).map((profile) => ({
    ...profile,
    email: userEmailMap.get(profile.id) || "",
  }));

  // ✅ OPTIMIZED: If searching by email, filter after email mapping
  let filteredProfiles = profilesWithEmails;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProfiles = profilesWithEmails.filter(
      (profile) =>
        profile.email?.toLowerCase().includes(searchLower) ||
        profile.first_name?.toLowerCase().includes(searchLower) ||
        profile.last_name?.toLowerCase().includes(searchLower)
    );
  }

  return { customers: filteredProfiles, totalCount: count || 0 };
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const { customers, totalCount } = await getCustomers(page, 25, search);

  const totalPages = Math.ceil(totalCount / 25);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kunden</h1>
          <p className="mt-2 text-gray-600">
            Kundenkonten anzeigen und verwalten
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-lg bg-card p-4 shadow">
        <form method="get" className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Nach E-Mail, Vor- oder Nachname suchen..."
              className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-accent px-6 py-2 font-medium text-accent-foreground hover:bg-accent/90"
          >
            Suchen
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-card p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gesamtkunden</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {totalCount}
              </p>
            </div>
            <Mail className="h-8 w-8 text-accent" />
          </div>
        </div>
        <div className="rounded-lg bg-card p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Neu diesen Monat</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
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
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="rounded-lg bg-card p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Mit Bestellungen</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
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
      <div className="overflow-hidden rounded-lg bg-card shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr className="text-left text-sm font-medium text-foreground">
                <th className="px-6 py-4">Kunde</th>
                <th className="px-6 py-4">E-Mail</th>
                <th className="px-6 py-4">Rolle</th>
                <th className="px-6 py-4">Bestellungen</th>
                <th className="px-6 py-4">Registriert</th>
                <th className="px-6 py-4">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((customer) => {
                const orderCount = Array.isArray(customer.orders)
                  ? customer.orders[0]?.count || 0
                  : 0;

                const fullName =
                  [customer.first_name, customer.last_name]
                    .filter(Boolean)
                    .join(" ") || "N/A";

                return (
                  <tr key={customer.id} className="text-sm hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-foreground">
                          {fullName}
                        </div>
                        {customer.gender && (
                          <div className="text-xs text-muted-foreground">
                            {customer.gender === "M"
                              ? "Männlich"
                              : customer.gender === "F"
                              ? "Weiblich"
                              : "Divers"}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          customer.role === "admin"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {customer.role === "admin" ? "Admin" : "Kunde"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-foreground">
                        <ShoppingBag className="h-4 w-4" />
                        {orderCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(customer.created_at).toLocaleDateString(
                        "de-DE",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="cursor-pointer inline-flex items-center gap-1 text-accent hover:text-accent/80"
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {customers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Keine Kunden gefunden</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Link
            href={`?page=${Math.max(1, page - 1)}${
              search ? `&search=${search}` : ""
            }`}
            className={`rounded-lg border px-4 py-2 ${
              page === 1
                ? "pointer-events-none border-border text-muted-foreground opacity-50"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            Zurück
          </Link>
          <span className="text-sm text-muted-foreground">
            Seite {page} von {totalPages}
          </span>
          <Link
            href={`?page=${Math.min(totalPages, page + 1)}${
              search ? `&search=${search}` : ""
            }`}
            className={`rounded-lg border px-4 py-2 ${
              page === totalPages
                ? "pointer-events-none border-border text-muted-foreground opacity-50"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            Weiter
          </Link>
        </div>
      )}
    </div>
  );
}
