"use client";

import { useState } from "react";
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from "@/hooks/useCustomers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Plus, Edit, Trash2, Search, Phone, Mail, MapPin, FileText } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function CustomersPage() {
  const { data: customers } = useCustomers();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    documentNumber: "",
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [editId, setEditId] = useState<string | null>(null);

  const resetForm = () => {
    setForm({
      documentNumber: "",
      name: "",
      phone: "",
      email: "",
      address: ""
    });
    setEditId(null);
  };

  const onSave = async () => {
    try {
      if (editId) {
        await updateCustomer.mutateAsync({ id: editId, ...form });
        toast.success("Cliente actualizado exitosamente");
      } else {
        await createCustomer.mutateAsync(form);
        toast.success("Cliente creado exitosamente");
      }
      setOpen(false);
      resetForm();
    } catch (error: any) {
      const apiError = error.response?.data;
      toast.error(apiError?.message || "Error al guardar el cliente");
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
              Clientes
            </h1>
            <p className="text-slate-600">
              Gestión de clientes y contactos
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
            <span className="hidden sm:inline">Nuevo Cliente</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-4 sm:mb-6 border-0 shadow-lg" style={{ backgroundColor: "var(--card-bg)" }}>
          <CardContent className="pt-4 sm:pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nombre, CI/RUC..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid gap-4">
          {(customers || [])
            .filter(c =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.documentNumber.toLowerCase().includes(search.toLowerCase())
            )
            .map((c) => (
              <Card
                key={c.id}
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
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base sm:text-lg text-slate-900">
                        {c.name}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 mt-1">
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span className="font-mono">{c.documentNumber}</span>
                        </div>
                        {c.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                        {c.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{c.email}</span>
                          </div>
                        )}
                      </div>
                      {c.address && (
                        <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{c.address}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setForm({
                            documentNumber: c.documentNumber,
                            name: c.name,
                            phone: c.phone || "",
                            email: c.email || "",
                            address: c.address || ""
                          });
                          setEditId(c.id);
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
                          if (confirm("¿Estás seguro de eliminar este cliente?")) {
                            try {
                              await deleteCustomer.mutateAsync(c.id);
                              toast.success("Cliente eliminado exitosamente");
                            } catch (error: any) {
                              toast.error("Error al eliminar el cliente");
                            }
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

        {/* Customer Dialog */}
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
                {editId ? "Editar cliente" : "Crear cliente"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentNumber">CI / RUC</Label>
                <Input
                  id="documentNumber"
                  placeholder="Número de identificación"
                  value={form.documentNumber}
                  onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
                  className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre y Apellido</Label>
                <Input
                  id="name"
                  placeholder="Nombre completo"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    placeholder="099..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  placeholder="Dirección domiciliaria"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
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
                {editId ? "Guardar cambios" : "Guardar cliente"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
