"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/hooks/useProducts";
import { Trash2, Edit } from "lucide-react";

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

interface SaleItemsProps {
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
}

export default function SaleItems({ items, onRemoveItem, onUpdateQuantity }: SaleItemsProps) {
  const calculateSubtotal = (item: CartItem) => {
    return item.product.salePrice * item.quantity;
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateSubtotal(item), 0);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay productos en la venta</p>
        <p className="text-sm">Busca y agrega productos para comenzar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Productos en la venta</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            ${calculateTotal().toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            Total de la venta
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div className="flex-1">
              <div className="font-medium">{item.product.name}</div>
              {item.product.description && (
                <div className="text-sm text-muted-foreground">{item.product.description}</div>
              )}
              <div className="text-sm text-muted-foreground">
                Categoría: {typeof item.product.category === 'object' ? item.product.category?.name : item.product.category || 'Sin categoría'}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-medium">${item.product.salePrice}</div>
                <div className="text-sm text-muted-foreground">Precio unitario</div>
              </div>

              <div className="text-center">
                <div className="font-medium">{item.quantity}</div>
                <div className="text-sm text-muted-foreground">Cantidad</div>
              </div>

              <div className="text-right">
                <div className="font-medium text-primary">${calculateSubtotal(item).toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Subtotal</div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newQuantity = prompt(`Nueva cantidad para ${item.product.name}:`, item.quantity.toString());
                    if (newQuantity && !isNaN(Number(newQuantity)) && Number(newQuantity) > 0) {
                      onUpdateQuantity(index, Number(newQuantity));
                    }
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg">
          <span className="font-medium">Total de la venta:</span>
          <span className="font-bold text-primary">${calculateTotal().toFixed(2)}</span>
        </div>
        <div className="text-sm text-muted-foreground text-right">
          {items.length} producto{items.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
