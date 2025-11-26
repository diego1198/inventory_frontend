import { LucideIcon, LayoutDashboard, Package, ShoppingCart, FileText, Users, Tag, ClipboardList } from "lucide-react";

export type UserRole = "superadmin" | "admin" | "cashier";

export interface NavigationItem {
    title: string;
    icon: LucideIcon;
    href: string;
    allowedRoles: UserRole[];
}

/**
 * Navigation configuration with role-based access control
 * 
 * To modify which roles can access a page, simply update the allowedRoles array
 * for the corresponding navigation item.
 * 
 * Role hierarchy:
 * - superadmin: Full access to all pages
 * - admin: All pages except category management
 * - cashier: Only dashboard, products, and sales
 */
export const navigationConfig: NavigationItem[] = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        allowedRoles: ["superadmin", "admin", "cashier"],
    },
    {
        title: "Productos",
        icon: Package,
        href: "/products",
        allowedRoles: ["superadmin", "admin", "cashier"],
    },
    {
        title: "Inventario",
        icon: ClipboardList,
        href: "/inventory",
        allowedRoles: ["superadmin", "admin"],
    },
    {
        title: "Ventas",
        icon: ShoppingCart,
        href: "/sales",
        allowedRoles: ["superadmin", "admin", "cashier"],
    },
    {
        title: "Reportes",
        icon: FileText,
        href: "/reports",
        allowedRoles: ["superadmin", "admin"],
    },
    {
        title: "Usuarios",
        icon: Users,
        href: "/users",
        allowedRoles: ["superadmin", "admin"],
    },
    {
        title: "Categorías",
        icon: Tag,
        href: "/categories",
        allowedRoles: ["superadmin"],
    },
];

/**
 * Filter navigation items based on user role
 */
export function getNavigationForRole(role: UserRole): NavigationItem[] {
    return navigationConfig.filter((item) => item.allowedRoles.includes(role));
}
