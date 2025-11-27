"use client";

import { useState } from "react";
import { useSales, Sale } from "@/hooks/useSales";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Eye, FileText, Calendar, DollarSign, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function SalesListPage() {
  const { data: sales, isLoading } = useSales();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredSales = sales?.filter((sale) =>
    sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sale.user?.firstName + " " + sale.user?.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Historial de Ventas
          </h1>
          <p className="text-slate-600">
            Consulta y gestiona el historial de facturación
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por factura, vendedor o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Factura #</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Cargando ventas...
                  </TableCell>
                </TableRow>
              ) : filteredSales?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No se encontraron ventas
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales?.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                    <TableCell>
                      {format(new Date(sale.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell>
                      {sale.customer ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{sale.customer.name}</span>
                          <span className="text-xs text-muted-foreground">{sale.customer.documentNumber}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Consumidor Final</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {sale.user ? `${sale.user.firstName} ${sale.user.lastName}` : "—"}
                    </TableCell>
                    <TableCell>{sale.items.length} productos</TableCell>
                    <TableCell className="text-right font-bold text-slate-700">
                      ${Number(sale.total).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedSale(sale)}
                            className="hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                              <FileText className="h-5 w-5 text-blue-600" />
                              Factura {sale.invoiceNumber}
                            </DialogTitle>
                          </DialogHeader>
                          
                          <div className="grid gap-6 py-4">
                            {/* Info Header */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" /> Fecha
                                </div>
                                <p className="font-medium">
                                  {format(new Date(sale.createdAt), "PPP p", { locale: es })}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <User className="h-4 w-4" /> Cliente
                                </div>
                                {sale.customer ? (
                                  <div>
                                    <p className="font-medium">{sale.customer.name}</p>
                                    <p className="text-xs text-muted-foreground">{sale.customer.documentNumber}</p>
                                    {sale.customer.email && <p className="text-xs text-muted-foreground">{sale.customer.email}</p>}
                                  </div>
                                ) : (
                                  <p className="font-medium italic text-muted-foreground">Consumidor Final</p>
                                )}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <User className="h-4 w-4" /> Vendedor
                                </div>
                                <p className="font-medium">
                                  {sale.user ? `${sale.user.firstName} ${sale.user.lastName}` : "—"}
                                </p>
                              </div>
                            </div>

                            {/* Items Table */}
                            <div>
                              <h4 className="font-semibold mb-3">Detalle de Productos</h4>
                              <div className="border rounded-lg overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-slate-50">
                                      <TableHead>Producto</TableHead>
                                      <TableHead className="text-right">Cant.</TableHead>
                                      <TableHead className="text-right">Precio Unit.</TableHead>
                                      <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {sale.items.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                          {item.product?.name || "Producto eliminado"}
                                        </TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">
                                          ${Number(item.unitPrice).toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                          ${Number(item.total).toFixed(2)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end">
                              <div className="w-48 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Subtotal:</span>
                                  <span>${Number(sale.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Impuestos:</span>
                                  <span>${Number(sale.tax).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                  <span>Total:</span>
                                  <span className="text-blue-600">${Number(sale.total).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Notes */}
                            {sale.notes && (
                              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 text-sm text-yellow-800">
                                <span className="font-semibold">Notas:</span> {sale.notes}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
