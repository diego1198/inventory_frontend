"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Product } from "@/hooks/useProducts";
import { Search, Plus, X } from "lucide-react";

interface ProductSearchProps {
  products: Product[];
  onAddProduct: (product: Product, quantity: number) => void;
}

export default function ProductSearch({ products, onAddProduct }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0) {
      onAddProduct(selectedProduct, quantity);
      setSelectedProduct(null);
      setQuantity(1);
      setSearchTerm("");
      setFilteredProducts([]);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setFilteredProducts([]);
  };

  const clearSelection = () => {
    setSelectedProduct(null);
    setSearchTerm("");
    setQuantity(1);
    setFilteredProducts([]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product-search">Buscar producto</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="product-search"
            placeholder="Escribe el nombre o descripción del producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {selectedProduct && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Resultados de búsqueda */}
      {filteredProducts.length > 0 && !selectedProduct && (
        <div className="border rounded-lg max-h-48 overflow-y-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
              onClick={() => handleProductSelect(product)}
            >
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-muted-foreground">
                {product.description}
              </div>
              <div className="text-sm font-medium text-primary">
                ${product.salePrice} - Stock: {product.stock}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Producto seleccionado */}
      {selectedProduct && (
        <div className="p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Producto seleccionado</h4>
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div>
              <span className="font-medium">{selectedProduct.name}</span>
              {selectedProduct.description && (
                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-primary">${selectedProduct.salePrice}</span>
              <span>Stock disponible: {selectedProduct.stock}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="space-y-1">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedProduct.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(selectedProduct.stock, Number(e.target.value))))}
                  className="w-20"
                />
              </div>

              <div className="text-sm">
                <div>Subtotal: ${(selectedProduct.salePrice * quantity).toFixed(2)}</div>
                <div className="text-muted-foreground">
                  {quantity > selectedProduct.stock && (
                    <span className="text-destructive">Cantidad excede el stock disponible</span>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={handleAddProduct}
              disabled={quantity <= 0 || quantity > selectedProduct.stock}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar a la venta
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
