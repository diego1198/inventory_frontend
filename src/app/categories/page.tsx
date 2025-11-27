"use client";

import { useState, useEffect } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { Category } from "@/types";
import { Plus, Pencil, Trash2, Search, Tag } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CategoriesPage() {
    const router = useRouter();
    const { data: categories, isLoading } = useCategories();
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const deleteCategory = useDeleteCategory();

    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "" });

    useEffect(() => {
        // Check role on client side for route protection
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role !== "superadmin") {
                    toast.error("No tienes permisos para acceder a esta página");
                    router.push("/products");
                }
            } catch (e) {
                router.push("/auth/login");
            }
        } else {
            router.push("/auth/login");
        }
    }, [router]);

    const filteredCategories = categories?.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description || "" });
        } else {
            setEditingCategory(null);
            setFormData({ name: "", description: "" });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("El nombre de la categoría es requerido");
            return;
        }

        try {
            if (editingCategory) {
                await updateCategory.mutateAsync({ id: editingCategory.id, data: formData });
            } else {
                await createCategory.mutateAsync(formData);
            }
            handleCloseDialog();
        } catch (error) {
            // Error handling is done in the hooks
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`¿Estás seguro de eliminar la categoría "${name}"?`)) {
            try {
                await deleteCategory.mutateAsync(id);
            } catch (error) {
                // Error handling is done in the hook
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: "var(--bg-primary)" }}>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-4 sm:mb-6 lg:mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{
                                    background: "linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))",
                                }}
                            >
                                <Tag className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                                    Gestión de Categorías
                                </h1>
                                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                    Administra las categorías de productos
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search and Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-secondary)" }} />
                            <input
                                type="text"
                                placeholder="Buscar categorías..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all"
                                style={{
                                    backgroundColor: "var(--bg-secondary)",
                                    borderColor: "var(--border-color)",
                                    color: "var(--text-primary)",
                                }}
                            />
                        </div>
                        <button
                            onClick={() => handleOpenDialog()}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:scale-105"
                            style={{
                                background: "linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))",
                            }}
                        >
                            <Plus className="w-5 h-5" />
                            Nueva Categoría
                        </button>
                    </div>

                    {/* Categories Table */}
                    <div
                        className="rounded-xl border overflow-hidden"
                        style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-color)",
                        }}
                    >
                        {isLoading ? (
                            <div className="p-12 text-center">
                                <div className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--primary-gradient-start)" }}></div>
                                <p className="mt-4" style={{ color: "var(--text-secondary)" }}>Cargando categorías...</p>
                            </div>
                        ) : filteredCategories && filteredCategories.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead style={{ backgroundColor: "var(--bg-tertiary)" }}>
                                        <tr>
                                            <th className="text-left px-6 py-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                                                Nombre
                                            </th>
                                            <th className="text-left px-6 py-4 font-semibold hidden sm:table-cell" style={{ color: "var(--text-primary)" }}>
                                                Descripción
                                            </th>
                                            <th className="text-right px-6 py-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCategories.map((category, index) => (
                                            <tr
                                                key={category.id}
                                                className="border-t transition-colors hover:bg-opacity-50"
                                                style={{
                                                    borderColor: "var(--border-color)",
                                                }}
                                            >
                                                <td className="px-6 py-4 font-medium" style={{ color: "var(--text-primary)" }}>
                                                    {category.name}
                                                </td>
                                                <td className="px-6 py-4 hidden sm:table-cell" style={{ color: "var(--text-secondary)" }}>
                                                    {category.description || "—"}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenDialog(category)}
                                                            className="p-2 rounded-lg transition-all hover:scale-110"
                                                            style={{ color: "var(--primary-gradient-start)" }}
                                                            title="Editar"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(category.id, category.name)}
                                                            className="p-2 rounded-lg transition-all hover:scale-110"
                                                            style={{ color: "#ef4444" }}
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <Tag className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: "var(--text-secondary)" }} />
                                <p className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                                    No hay categorías
                                </p>
                                <p style={{ color: "var(--text-secondary)" }}>
                                    {searchTerm ? "No se encontraron categorías con ese nombre" : "Comienza creando una nueva categoría"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dialog Modal */}
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    if (!open) handleCloseDialog();
                }}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">
                                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre <span className="text-red-500">*</span></Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Electrónica"
                                    maxLength={100}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descripción opcional de la categoría"
                                    rows={3}
                                    maxLength={500}
                                />
                            </div>
                            <div className="flex gap-3 pt-4 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseDialog}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createCategory.isPending || updateCategory.isPending}
                                    style={{
                                        background: "linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))",
                                    }}
                                >
                                    {createCategory.isPending || updateCategory.isPending
                                        ? "Guardando..."
                                        : editingCategory
                                            ? "Actualizar"
                                            : "Crear"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
