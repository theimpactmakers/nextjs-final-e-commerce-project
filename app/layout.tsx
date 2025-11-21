import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({ subsets: ["latin"] });

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
        <CartProvider>
          <Header />
          <main className="grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
