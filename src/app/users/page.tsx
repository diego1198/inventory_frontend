"use client";

import { useState, useEffect } from "react";
import { useUsers, useCreateUser, useDeleteUser, type CreateUserData, type User } from "@/hooks/useUsers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Trash2, Shield, User as UserIcon, Crown } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function UsersPage() {
    const { data, isLoading } = useUsers();
    const createUser = useCreateUser();
    const deleteUser = useDeleteUser();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState<'superadmin' | 'admin' | 'cashier'>('cashier');
    const [formData, setFormData] = useState<CreateUserData>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "cashier",
    });

    // Get current user from localStorage on client-side only
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setCurrentUserRole(user?.role || 'cashier');
            }
        }
    }, []);

    // Determine available roles based on current user's role
    const getAvailableRoles = () => {
        if (currentUserRole === 'superadmin') {
            return [
                { value: 'admin', label: 'Administrador', icon: Shield },
                { value: 'cashier', label: 'Cajero', icon: UserIcon },
            ];
        } else if (currentUserRole === 'admin') {
            return [
                { value: 'cashier', label: 'Cajero', icon: UserIcon },
            ];
        }
        return [];
    };

    const availableRoles = getAvailableRoles();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUser.mutateAsync(formData);
            setIsDialogOpen(false);
            setFormData({
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                role: "cashier",
            });
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que deseas desactivar este usuario?')) {
            await deleteUser.mutateAsync(id);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'superadmin':
                return <Crown className="w-4 h-4 text-yellow-500" />;
            case 'admin':
                return <Shield className="w-4 h-4 text-blue-500" />;
            case 'cashier':
                return <UserIcon className="w-4 h-4 text-gray-500" />;
            default:
                return null;
        }
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'superadmin':
                return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
            case 'admin':
                return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
            case 'cashier':
                return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'superadmin':
                return 'Superadmin';
            case 'admin':
                return 'Administrador';
            case 'cashier':
                return 'Cajero';
            default:
                return role;
        }
    };

    // Check if user has permission to manage users
    if (currentUserRole === 'cashier') {
        return (
            <DashboardLayout>
                <div className="p-8 flex items-center justify-center min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
                    <Card className="max-w-md border-0 shadow-lg" style={{ backgroundColor: "var(--card-bg)" }}>
                        <CardContent className="pt-6 text-center">
                            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
                            <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-6 lg:p-8 min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6 lg:mb-8">
                    <div>
                        <h1
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
                            style={{
                                background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text"
                            }}
                        >
                            Gestión de Usuarios
                        </h1>
                        <p className="text-slate-600">
                            Administra los usuarios del sistema
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                                style={{
                                    background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
                                    color: "white"
                                }}
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Nuevo Usuario
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle
                                    className="text-2xl font-bold"
                                    style={{
                                        background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text"
                                    }}
                                >
                                    Crear Nuevo Usuario
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Nombre</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        required
                                        className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Apellido</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        required
                                        className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={6}
                                        className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Rol</Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                                    >
                                        <SelectTrigger className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableRoles.map((role) => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    <div className="flex items-center gap-2">
                                                        <role.icon className="w-4 h-4" />
                                                        {role.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={createUser.isPending}
                                    className="w-full border-0"
                                    style={{
                                        background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
                                        color: "white"
                                    }}
                                >
                                    {createUser.isPending ? "Creando..." : "Crear Usuario"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Users Table */}
                <Card className="border-0 shadow-lg" style={{ backgroundColor: "var(--card-bg)" }}>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-slate-900">Usuarios Registrados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div
                                    className="w-12 h-12 border-4 border-t-4 rounded-full animate-spin"
                                    style={{
                                        borderColor: "rgba(139, 92, 246, 0.2)",
                                        borderTopColor: "var(--primary-gradient-start)"
                                    }}
                                ></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2" style={{ borderColor: "var(--card-border)" }}>
                                            <th className="text-left py-4 px-4 font-semibold text-slate-700">
                                                Usuario
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-slate-700">
                                                Email
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-slate-700">
                                                Rol
                                            </th>
                                            <th className="text-left py-4 px-4 font-semibold text-slate-700 hidden sm:table-cell">
                                                Estado
                                            </th>
                                            <th className="text-right py-4 px-4 font-semibold text-slate-700">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.map((user: User) => (
                                            <tr
                                                key={user.id}
                                                className="border-b hover:bg-slate-50 transition-colors"
                                                style={{ borderColor: "var(--card-border)" }}
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="font-medium text-slate-900">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-slate-600">
                                                    {user.email}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeClass(user.role)}`}>
                                                        {getRoleIcon(user.role)}
                                                        {getRoleLabel(user.role)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 hidden sm:table-cell">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${user.isActive
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {user.isActive ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    {user.role !== 'superadmin' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(user.id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout >
    );
}
