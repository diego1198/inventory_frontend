"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCreateSale } from "@/hooks/useSales";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/hooks/useProducts";
import ProductSearch from "@/components/ProductSearch";
import SaleItems, { CartItem } from "@/components/SaleItems";
import { ShoppingCart, Save, Receipt, AlertCircle, Search, User } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CustomerSelector } from "@/components/CustomerSelector";
import { Customer } from "@/hooks/useCustomers";

export default function SalesPage() {
  const { data: products } = useProducts();
  const createSale = useCreateSale();

  const [saleItems, setSaleItems] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleAddProduct = (product: Product, quantity: number) => {
    const existingIndex = saleItems.findIndex(item => item.productId === product.id);

    if (existingIndex >= 0) {
      const updatedItems = [...saleItems];
      updatedItems[existingIndex].quantity += quantity;
      setSaleItems(updatedItems);
      toast.success(`Cantidad actualizada para ${product.name}`);
    } else {
      setSaleItems([...saleItems, { productId: product.id, quantity, product }]);
      toast.success(`${product.name} agregado a la venta`);
    }
  };

  const handleRemoveItem = (index: number) => {
    const item = saleItems[index];
    setSaleItems(saleItems.filter((_, i) => i !== index));
    toast.success(`${item.product.name} removido de la venta`);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(index);
      return;
    }

    const updatedItems = [...saleItems];
    updatedItems[index].quantity = quantity;
    setSaleItems(updatedItems);
    toast.success(`Cantidad actualizada para ${updatedItems[index].product.name}`);
  };

  const handleCreateSale = async () => {
    if (saleItems.length === 0) {
      toast.error("Debes agregar al menos un producto a la venta");
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        items: saleItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        notes: notes.trim() || undefined,
        customerId: selectedCustomer?.id
      };

      await createSale.mutateAsync(payload);

      setSaleItems([]);
      setNotes("");
      setSelectedCustomer(null);

      toast.success("Venta creada exitosamente");
    } catch (error) {
      console.error("Error al crear la venta:", error);
      toast.error("Error al crear la venta. Intenta nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    return saleItems.reduce((total, item) => total + (item.product.salePrice * item.quantity), 0);
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
            style={{
              background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Nueva Venta
          </h1>
          <p className="text-slate-600">
            Crea una nueva venta agregando productos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Panel izquierdo - Búsqueda de productos */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-lg" style={{ backgroundColor: "var(--card-bg)" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                  <User className="h-5 w-5" />
                  Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerSelector 
                  selectedCustomerId={selectedCustomer?.id || null}
                  onSelect={setSelectedCustomer}
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg" style={{ backgroundColor: "var(--card-bg)" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                  <Search className="h-5 w-5" />
                  Buscar Productos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductSearch
                  products={products || []}
                  onAddProduct={handleAddProduct}
                />
              </CardContent>
            </Card>
          </div>

          {/* Panel derecho - Resumen de la venta */}
          <Card className="border-0 shadow-lg" style={{ backgroundColor: "var(--card-bg)" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                <Receipt className="h-5 w-5" />
                Resumen de la Venta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SaleItems
                items={saleItems}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
            </CardContent>
          </Card>
        </div>

        {/* Notas de la venta */}
        <Card className="mb-4 sm:mb-6 border-0 shadow-lg" style={{ backgroundColor: "var(--card-bg)" }}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Notas de la Venta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas adicionales (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Agrega notas sobre la venta, cliente, método de pago, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {saleItems.length > 0 && (
              <div className="text-lg font-semibold text-slate-900">
                Total de la venta: <span
                  className="text-2xl"
                  style={{
                    background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => {
                setSaleItems([]);
                setNotes("");
                toast.success("Venta cancelada");
              }}
              disabled={saleItems.length === 0}
              className="shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto"
            >
              Cancelar Venta
            </Button>

            <Button
              onClick={handleCreateSale}
              disabled={saleItems.length === 0 || isProcessing}
              className="min-w-[140px] shadow-lg hover:shadow-xl transition-all duration-200 border-0 w-full sm:w-auto"
              style={{
                background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
                color: "white"
              }}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Venta
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
