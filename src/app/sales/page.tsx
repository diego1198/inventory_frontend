"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCreateSale, SaleItem } from "@/hooks/useSales";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/hooks/useProducts";
import ProductSearch from "@/components/ProductSearch";
import SaleItems from "@/components/SaleItems";
import { ShoppingCart, Save, Receipt, AlertCircle, Search } from "lucide-react";
import { toast } from "sonner";

export default function SalesPage() {
  const { data: products } = useProducts();
  const createSale = useCreateSale();
  
  const [saleItems, setSaleItems] = useState<Array<SaleItem & { product: Product }>>([]);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddProduct = (product: Product, quantity: number) => {
    // Verificar si el producto ya está en la venta
    const existingIndex = saleItems.findIndex(item => item.productId === product.id);
    
    if (existingIndex >= 0) {
      // Si ya existe, actualizar la cantidad
      const updatedItems = [...saleItems];
      updatedItems[existingIndex].quantity += quantity;
      setSaleItems(updatedItems);
      toast.success(`Cantidad actualizada para ${product.name}`);
    } else {
      // Si no existe, agregarlo
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
        notes: notes.trim() || undefined
      };

      await createSale.mutateAsync(payload);
      
      // Limpiar el formulario después de crear la venta
      setSaleItems([]);
      setNotes("");
      
      toast.success("Venta creada exitosamente");
    } catch (error) {
      console.error("Error al crear la venta:", error);
      toast.error("Error al crear la venta. Intenta nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    return saleItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Nueva Venta</h1>
          <p className="text-muted-foreground">Crea una nueva venta agregando productos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel izquierdo - Búsqueda de productos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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

        {/* Panel derecho - Resumen de la venta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
      <Card>
        <CardHeader>
          <CardTitle>Notas de la Venta</CardTitle>
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
            />
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {saleItems.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Total de la venta: <span className="font-semibold text-primary">${calculateTotal().toFixed(2)}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setSaleItems([]);
              setNotes("");
              toast.success("Venta cancelada");
            }}
            disabled={saleItems.length === 0}
          >
            Cancelar Venta
          </Button>
          
          <Button
            onClick={handleCreateSale}
            disabled={saleItems.length === 0 || isProcessing}
            className="min-w-[140px]"
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
  );
}


