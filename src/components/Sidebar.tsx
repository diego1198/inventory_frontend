"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getNavigationForRole } from "@/config/navigation-config";
import { useLogout, User } from "@/hooks/useAuth";
import { LogOut, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { mutate: logout } = useLogout();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
  }, []);

  const role = user?.role || "cashier";
  const navigation = getNavigationForRole(role);

  return (
    <div className={cn("flex flex-col h-full border-r bg-background", className)}>
      <div className="p-6">
        <h2 className="text-lg font-semibold tracking-tight">
          Inventory App
        </h2>
      </div>
      <div className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            let isActive = item.href === "/" 
                ? pathname === "/" 
                : (pathname === item.href || pathname.startsWith(`${item.href}/`));
            
            // Special handling for sales to avoid conflict with sales/new
            if (item.href === "/sales" && pathname === "/sales/new") {
                isActive = false;
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors mb-1",
                  isActive
                    ? item.variant === "highlight"
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                      : "bg-slate-200 text-slate-900 font-bold dark:bg-slate-800 dark:text-slate-50"
                    : item.variant === "highlight"
                    ? "border-2 border-primary text-primary hover:bg-primary/10"
                    : "text-muted-foreground hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                )}
              >
                <item.icon className={cn("mr-2 h-4 w-4", isActive ? "text-current" : "opacity-70")} />
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t mt-auto">
         <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <UserIcon className="h-4 w-4" />
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</span>
                <span className="text-xs text-muted-foreground capitalize truncate">{user?.role}</span>
            </div>
         </div>
         <Button variant="outline" className="w-full justify-start" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
         </Button>
      </div>
    </div>
  );
}
