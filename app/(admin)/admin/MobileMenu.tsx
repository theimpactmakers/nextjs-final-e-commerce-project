"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Settings,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  iconName: string;
}

interface MobileMenuProps {
  navItems: NavItem[];
  userEmail: string;
}

const iconMap = {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Settings,
};

export function MobileMenu({ navItems, userEmail }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer lg:hidden rounded-lg p-2 text-foreground hover:bg-muted"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-primary text-primary-foreground lg:hidden">
            <div className="flex h-16 items-center justify-between border-b border-primary/20 px-4">
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-lg p-2 hover:bg-primary/20"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1 p-4">
              {navItems.map((item) => {
                const Icon = iconMap[item.iconName as keyof typeof iconMap];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="cursor-pointer flex items-center gap-3 rounded-lg px-4 py-3 text-primary-foreground/70 transition hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 w-64 border-t border-primary/20 p-4">
              <div className="text-sm">
                <span className="text-black">Logged in as:</span> <br />
                <span className="text-black font-medium">{userEmail}</span>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
