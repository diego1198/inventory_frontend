"use client";

import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCreateInventoryMovement, useInventoryMovements, MovementType } from "@/hooks/useInventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, Plus, Edit, Trash2, Search, ArrowRightLeft, History } from "lucide-react";
import { useState } from "react";
import { CategorySearch } from "@/components/CategorySearch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function ProductsPage() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const [search, setSearch] = useState("");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createMovement = useCreateInventoryMovement();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    code: "",
    brand: "",
    purchasePrice: 0,
    salePrice: 0,
    stock: 0,
    categoryId: ""
  });
  const [editId, setEditId] = useState<string | null>(null);

  // Inventory Movement State
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [movementForm, setMovementForm] = useState({
    type: MovementType.IN,
    quantity: 1,
    unitPrice: 0,
    reason: ""
  });

  const { data: movements } = useInventoryMovements(selectedProduct?.id);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      code: "",
      brand: "",
      purchasePrice: 0,
      salePrice: 0,
      stock: 0,
      categoryId: ""
    });
    setEditId(null);
  };

  const onSave = async () => {
    try {
      if (editId) {
        await updateProduct.mutateAsync({ id: editId, ...form });
        toast.success("Producto actualizado exitosamente");
      } else {
        await createProduct.mutateAsync(form);
        toast.success("Producto creado exitosamente");
      }
      setOpen(false);
      resetForm();
    } catch (error: any) {
      // Handle validation errors
      const apiError = error.response?.data;
      if (apiError?.message && Array.isArray(apiError.message)) {
        // Show each validation error
        apiError.message.forEach((msg: string) => {
          toast.error(msg);
        });
      } else if (apiError?.message) {
        toast.error(apiError.message);
      } else {
        toast.error("Error al guardar el producto");
      }
    }
  };

  const handleMovementSubmit = async () => {
    if (!selectedProduct) return;
    try {
      await createMovement.mutateAsync({
        productId: selectedProduct.id,
        type: movementForm.type,
        quantity: movementForm.quantity,
        reason: movementForm.reason,
        unitPrice: movementForm.type === MovementType.IN ? movementForm.unitPrice : undefined,
      });
      toast.success("Movimiento registrado exitosamente");
      setMovementModalOpen(false);
      setMovementForm({ type: MovementType.IN, quantity: 1, unitPrice: 0, reason: "" });
    } catch (error) {
      toast.error("Error al registrar movimiento");
    }
  };

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
              Productos
            </h1>
            <p className="text-slate-600">
              Gestiona el inventario de productos
            </p>
          </div>
          <Button
            onClick={() => { resetForm(); setOpen(true); }}
            className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-200 border-0"
            style={{
              background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
              color: "white"
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Nuevo Producto</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-4 sm:mb-6 border-0 shadow-lg" style={{ backgroundColor: "var(--card-bg)" }}>
          <CardContent className="pt-4 sm:pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Buscar producto..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid gap-4">
          {(products || [])
            .filter(p => 
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.description?.toLowerCase().includes(search.toLowerCase()) ||
              p.code?.toLowerCase().includes(search.toLowerCase()) ||
              p.brand?.toLowerCase().includes(search.toLowerCase())
            )
            .map((p) => (
              <Card
                key={p.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                style={{ backgroundColor: "var(--card-bg)" }}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
                        boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.39)"
                      }}
                    >
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base sm:text-lg text-slate-900">
                        {p.name}
                        {p.brand && <span className="ml-2 text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{p.brand}</span>}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {p.code && <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded mr-2">{p.code}</span>}
                        {p.description}
                      </div>
                      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500 mt-2">
                        <span className="font-medium" title="Precio de Venta">${p.salePrice}</span>
                        <span className="text-slate-400 text-xs" title="Precio de Compra Promedio">(${p.purchasePrice})</span>
                        <span>Stock: {p.stock}</span>
                        {p.category && <span className="hidden sm:inline">Categoría: {p.category.name}</span>}
                      </div>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                          setSelectedProduct(p);
                          setMovementModalOpen(true);
                        }}
                        className="shadow-md hover:shadow-lg transition-shadow"
                        title="Ajustar Stock (Entrada/Salida)"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                          setSelectedProduct(p);
                          setHistoryOpen(true);
                        }}
                        className="shadow-md hover:shadow-lg transition-shadow"
                        title="Historial de Movimientos"
                      >
                        <History className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setForm({
                            name: p.name,
                            description: p.description || "",
                            code: p.code || "",
                            brand: p.brand || "",
                            purchasePrice: p.purchasePrice,
                            salePrice: p.salePrice,
                            stock: p.stock,
                            categoryId: p.category?.id || ""
                          });
                          setEditId(p.id);
                          setOpen(true);
                        }}
                        className="shadow-md hover:shadow-lg transition-shadow flex-1 sm:flex-none"
                      >
                        <Edit className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Editar</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={async () => {
                          try {
                            await deleteProduct.mutateAsync(p.id);
                            toast.success("Producto eliminado exitosamente");
                          } catch (error: any) {
                            const apiError = error.response?.data;
                            toast.error(apiError?.message || "Error al eliminar el producto");
                          }
                        }}
                        className="shadow-md hover:shadow-lg transition-shadow"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Product Dialog */}
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
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
                {editId ? "Editar producto" : "Crear producto"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del producto</Label>
                <Input
                  id="name"
                  placeholder="Nombre del producto"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  placeholder="Descripción del producto"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código / Nomenclatura</Label>
                  <Input
                    id="code"
                    placeholder="Ej: SKU-123"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    placeholder="Ej: Sony, Nike, Bosch"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Precio Compra</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.purchasePrice}
                    onChange={(e) => setForm({ ...form, purchasePrice: Number(e.target.value) })}
                    className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Precio Venta</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.salePrice}
                    onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })}
                    className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Inicial</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="Stock disponible"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                  disabled={!!editId} // Disable stock editing in edit mode, force use of movements
                />
                {editId && <p className="text-xs text-slate-500">Para ajustar el stock, usa el botón de movimientos en la lista.</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <CategorySearch
                  categories={categories || []}
                  value={form.categoryId}
                  onChange={(value) => setForm({ ...form, categoryId: value })}
                />
              </div>
              <Button
                onClick={onSave}
                className="w-full border-0"
                style={{
                  background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
                  color: "white"
                }}
              >
                {editId ? "Guardar cambios" : "Guardar producto"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Movement Modal */}
        <Dialog open={movementModalOpen} onOpenChange={setMovementModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Movimiento - {selectedProduct?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Movimiento</Label>
                <Select
                  value={movementForm.type}
                  onValueChange={(v) => setMovementForm({ ...movementForm, type: v as MovementType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MovementType.IN}>Entrada (Compra)</SelectItem>
                    <SelectItem value={MovementType.OUT}>Salida (Ajuste/Pérdida)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  min="1"
                  value={movementForm.quantity}
                  onChange={(e) => setMovementForm({ ...movementForm, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>

              {movementForm.type === MovementType.IN && (
                <div className="space-y-2">
                  <Label>Precio de Compra Unitario (Nuevo)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={movementForm.unitPrice}
                    onChange={(e) => setMovementForm({ ...movementForm, unitPrice: Number(e.target.value) })}
                    placeholder="Ej: 0.65"
                  />
                  <p className="text-xs text-slate-500">
                    El precio de compra del producto se actualizará usando promedio ponderado.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Razón / Notas</Label>
                <Input
                  value={movementForm.reason}
                  onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
                  placeholder="Ej: Compra mensual, Ajuste de inventario..."
                />
              </div>
              <Button onClick={handleMovementSubmit} disabled={createMovement.isPending} className="w-full">
                {createMovement.isPending ? "Guardando..." : "Registrar Movimiento"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* History Sheet */}
        <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
          <SheetContent className="w-full sm:w-[400px] lg:w-[540px]">
            <SheetHeader>
              <SheetTitle>Historial de Movimientos</SheetTitle>
              <SheetDescription>
                {selectedProduct?.name}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {movements?.map((movement: any) => (
                <div key={movement.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 p-4 border rounded-lg bg-slate-50">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <span className={movement.type === 'IN' ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                        {movement.type === 'IN' ? "Entrada" : "Salida"}
                      </span>
                      <span className="text-slate-500 text-sm">
                        {new Date(movement.createdAt).toLocaleDateString()} {new Date(movement.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">{movement.reason || "Sin notas"}</div>
                    <div className="text-xs text-slate-400 mt-1">Por: {movement.user?.name || "Usuario"}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${movement.type === 'IN' ? "text-green-600" : "text-red-600"}`}>
                      {movement.type === 'IN' ? "+" : "-"}{movement.quantity}
                    </div>
                    {movement.unitPrice && (
                      <div className="text-xs text-slate-500">
                        @ ${Number(movement.unitPrice).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {!movements?.length && (
                <div className="text-center text-slate-500 py-8">No hay movimientos registrados</div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
}
