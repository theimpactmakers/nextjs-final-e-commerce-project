import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ReviewProvider } from "@/contexts/ReviewContext";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Prevent FOIT/FOUT, improve Core Web Vitals
  preload: true,
});

export const metadata: Metadata = {
  title: "Elite Dog TREATS",
  description: "Premium dog treats for your beloved pet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ReviewProvider>
                <Header />
                <main className="grow">{children}</main>
                <Footer />
                <CookieBanner />
                <Toaster
                  position="top-center"
                  expand={false}
                  richColors
                  closeButton
                  toastOptions={{
                    style: {
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--foreground))",
                    },
                  }}
                />
              </ReviewProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
