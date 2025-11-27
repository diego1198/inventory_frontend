import { LucideIcon, Package, ShoppingCart, FileText, Users, Tag, ClipboardList, PlusCircle, Contact } from "lucide-react";

export type UserRole = "superadmin" | "admin" | "cashier";

export interface NavigationItem {
    title: string;
    icon: LucideIcon;
    href: string;
    allowedRoles: UserRole[];
    variant?: "default" | "highlight";
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
        title: "Nueva factura",
        icon: PlusCircle,
        href: "/sales/new",
        allowedRoles: ["superadmin", "admin", "cashier"],
        variant: "highlight",
    },
    {
        title: "Categorías",
        icon: Tag,
        href: "/categories",
        allowedRoles: ["superadmin"],
    },
    {
        title: "Productos",
        icon: Package,
        href: "/products",
        allowedRoles: ["superadmin", "admin", "cashier"],
    },
    {
        title: "Clientes",
        icon: Contact,
        href: "/customers",
        allowedRoles: ["superadmin", "admin", "cashier"],
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
        title: "Inventario",
        icon: ClipboardList,
        href: "/inventory",
        allowedRoles: ["superadmin", "admin"],
    },
    {
        title: "Usuarios",
        icon: Users,
        href: "/users",
        allowedRoles: ["superadmin", "admin"],
    },
];

/**
 * Filter navigation items based on user role
 */
export function getNavigationForRole(role: UserRole): NavigationItem[] {
    return navigationConfig.filter((item) => item.allowedRoles.includes(role));
}
