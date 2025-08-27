"use client";

import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export default function ProductsPage() {
  const { data: products } = useProducts();
  const [search, setSearch] = useState("");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
      name: "Laptop HP Pavilion",
      description: "Laptop de alta calidad con procesador Intel i7",
      price: 1299.99,
      stock: 50,
      category: "electronics"
    });
    const [editId, setEditId] = useState<string | null>(null);

  const resetForm = () => {
    setForm({
      name: "Laptop HP Pavilion",
      description: "Laptop de alta calidad con procesador Intel i7",
      price: 1299.99,
      stock: 50,
      category: "electronics"
    });
    setEditId(null);
  };

  const onSave = async () => {
    if (editId) {
      await updateProduct.mutateAsync({ id: editId, ...form });
    } else {
      await createProduct.mutateAsync(form);
    }
    setOpen(false);
    resetForm();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
        <h1 className="text-xl font-semibold">Productos</h1>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => { resetForm(); setOpen(true); }}>Nuevo producto</Button>
        </div>
      </div>
      <div className="grid gap-2">
        {(products || [])
          .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
          .map((p) => (
            <div key={p.id} className="flex items-center gap-2 p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                {p.description && <div className="text-sm text-gray-600">{p.description}</div>}
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>${p.price}</span>
                  <span>Stock: {p.stock}</span>
                  {p.category && <span>Categoría: {p.category}</span>}
                </div>
              </div>
              <Button variant="secondary" onClick={() => updateProduct.mutate({ id: p.id, stock: p.stock + 1 })}>+1 stock</Button>
              <Button variant="outline" onClick={() => {
                setForm({
                  name: p.name,
                  description: p.description || "",
                  price: p.price,
                  stock: p.stock,
                  category: p.category || "electronics"
                });
                setEditId(p.id);
                setOpen(true);
              }}>Editar</Button>
              <Button variant="destructive" onClick={() => deleteProduct.mutate(p.id)}>Eliminar</Button>
            </div>
          ))}
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editId ? "Editar producto" : "Crear producto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del producto</Label>
              <Input 
                id="name"
                placeholder="Nombre del producto" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input 
                id="description"
                placeholder="Descripción del producto" 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input 
                id="price"
                type="number" 
                step="0.01"
                placeholder="Precio" 
                value={form.price} 
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input 
                id="stock"
                type="number" 
                placeholder="Stock disponible" 
                value={form.stock} 
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electrónicos</SelectItem>
                  <SelectItem value="clothing">Ropa</SelectItem>
                  <SelectItem value="books">Libros</SelectItem>
                  <SelectItem value="home">Hogar</SelectItem>
                  <SelectItem value="sports">Deportes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={onSave} className="w-full">{editId ? "Guardar cambios" : "Guardar producto"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


