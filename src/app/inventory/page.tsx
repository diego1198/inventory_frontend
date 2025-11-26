"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventoryMovements, useCreateInventoryMovement, MovementType, InventoryMovement } from "@/hooks/useInventory";
import { useProducts } from "@/hooks/useProducts";

import { Search, Plus, ArrowUpRight, ArrowDownLeft, Package } from "lucide-react";
import { toast } from "sonner";
import { ProductSelector } from "@/components/ProductSelector";
import { DashboardLayout } from "@/components/DashboardLayout";


export default function InventoryPage() {
    const { data: movements, isLoading } = useInventoryMovements();
    const { data: products } = useProducts();
    const createMovement = useCreateInventoryMovement();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [selectedProductId, setSelectedProductId] = useState("");
    const [type, setType] = useState<MovementType>(MovementType.IN);
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);
    const [reason, setReason] = useState("");

    const handleCreate = async () => {
        if (!selectedProductId) {
            toast.error("Selecciona un producto");
            return;
        }
        try {
            await createMovement.mutateAsync({
                productId: selectedProductId,
                type,
                quantity,
                unitPrice: type === MovementType.IN ? unitPrice : undefined,
                reason
            });
            toast.success("Movimiento registrado");
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            toast.error("Error al registrar movimiento");
        }
    };

    const resetForm = () => {
        setSelectedProductId("");
        setType(MovementType.IN);
        setQuantity(1);
        setUnitPrice(0);
        setReason("");
    };

    const filteredMovements = movements?.filter((m: InventoryMovement) =>
        m.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6 lg:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Gestión de Inventario
                        </h1>
                        <p className="text-slate-600">Registro de compras y ajustes de stock</p>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Registrar Movimiento</span>
                        <span className="sm:hidden">Nuevo</span>
                    </Button>
                </div>

                <Card className="mb-4 sm:mb-6 border-0 shadow-lg">
                    <CardContent className="pt-4 sm:pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <Input
                                placeholder="Buscar por producto o razón..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {isLoading ? (
                        <p>Cargando movimientos...</p>
                    ) : (
                        filteredMovements?.map((movement: InventoryMovement) => (
                            <Card key={movement.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${movement.type === MovementType.IN ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {movement.type === MovementType.IN ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{movement.product?.name}</h3>
                                            <p className="text-sm text-slate-500">
                                                {new Date(movement.createdAt).toLocaleDateString()} - {movement.user?.name || 'Usuario'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-bold text-lg ${movement.type === MovementType.IN ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {movement.type === MovementType.IN ? '+' : '-'}{movement.quantity}
                                        </div>
                                        {movement.unitPrice && (
                                            <div className="text-xs text-slate-500">
                                                @ ${Number(movement.unitPrice).toFixed(2)} / u
                                            </div>
                                        )}
                                        <div className="text-xs text-slate-400">{movement.reason}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Registrar Movimiento de Inventario</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Producto</Label>
                                <ProductSelector
                                    products={products || []}
                                    value={selectedProductId}
                                    onChange={setSelectedProductId}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select value={type} onValueChange={(v) => setType(v as MovementType)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={MovementType.IN}>Entrada (Compra)</SelectItem>
                                        <SelectItem value={MovementType.OUT}>Salida (Ajuste)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Cantidad</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                            </div>

                            {type === MovementType.IN && (
                                <div className="space-y-2">
                                    <Label>Precio de Compra Unitario (Nuevo)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={unitPrice}
                                        onChange={(e) => setUnitPrice(Number(e.target.value))}
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
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Ej: Compra a proveedor X"
                                />
                            </div>

                            <Button onClick={handleCreate} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                Registrar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
