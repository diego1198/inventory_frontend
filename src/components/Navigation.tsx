"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  LogOut,
  Home
} from "lucide-react";

const navigationItems = [
  {
    value: "/",
    label: "Inicio",
    icon: Home,
    description: "Página principal"
  },
  {
    value: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Panel de control"
  },
  {
    value: "/products",
    label: "Productos",
    icon: Package,
    description: "Gestión de inventario"
  },
  {
    value: "/sales",
    label: "Ventas",
    icon: ShoppingCart,
    description: "Registro de ventas"
  },
  {
    value: "/reports",
    label: "Reportes",
    icon: BarChart3,
    description: "Análisis y reportes"
  }
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  // Ocultar barra en login y registro
  if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
    return null;
  }

  const handleTabChange = (value: string) => {
    router.push(value);
  };

  const handleLogout = () => {
    // Eliminar token de autenticación
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    router.push("/auth/login");
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">Inventory System</h1>
          </div>

          {/* Tabs de navegación */}
          <Tabs value={pathname} onValueChange={handleTabChange} className="flex-1 max-w-2xl mx-8">
            <TabsList className="grid w-full grid-cols-5">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="flex flex-col items-center space-y-1 px-2 py-1 h-auto"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{item.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          {/* Botón de logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
