import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Settings,
} from "lucide-react";
import { MobileMenu } from "./MobileMenu";

// Force dynamic rendering for admin pages (always fresh auth checks)
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/admin");
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/?error=unauthorized");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Produkte", icon: Package },
    { href: "/admin/orders", label: "Bestellungen", icon: ShoppingCart },
    { href: "/admin/customers", label: "Kunden", icon: Users },
    { href: "/admin/reviews", label: "Bewertungen", icon: Star },
    { href: "/admin/settings", label: "Einstellungen", icon: Settings },
  ];

  // Simple nav items for client component (without icon components)
  const mobileNavItems = [
    { href: "/admin", label: "Dashboard", iconName: "LayoutDashboard" },
    { href: "/admin/products", label: "Produkte", iconName: "Package" },
    { href: "/admin/orders", label: "Bestellungen", iconName: "ShoppingCart" },
    { href: "/admin/customers", label: "Kunden", iconName: "Users" },
    { href: "/admin/reviews", label: "Bewertungen", iconName: "Star" },
    { href: "/admin/settings", label: "Einstellungen", iconName: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-muted">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 bg-primary text-primary-foreground lg:block">
        <div className="flex h-16 items-center justify-center border-b border-primary/20">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="cursor-pointer flex items-center gap-3 rounded-lg px-4 py-3 text-primary-foreground/70 transition hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 border-t border-primary/20 p-4">
          <div className="text-sm text-primary-foreground/70">
            Logged in as: <br />
            <span className="text-primary-foreground">{user.email}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm lg:px-6">
          <div className="flex items-center gap-4">
            <MobileMenu
              navItems={mobileNavItems}
              userEmail={user.email || ""}
            />
            <h2 className="text-lg font-semibold text-foreground lg:text-xl">
              Admin Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Shop ansehen
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
