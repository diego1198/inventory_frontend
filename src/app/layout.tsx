import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/query-provider";
import { Toaster } from "@/components/ui/sonner";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory System",
  description: "Sistema de inventario y facturación",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Detectar ruta actual
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const hideNav = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          {!hideNav && <Navigation />}
          <main className="min-h-screen bg-background">
            {children}
          </main>
        </QueryProvider>
        <Toaster/>
      </body>
    </html>
  );
}
