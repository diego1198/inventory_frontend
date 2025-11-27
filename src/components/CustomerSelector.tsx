"use client";

import { useState, useEffect } from "react";
import { useCustomers, useCreateCustomer, Customer } from "@/hooks/useCustomers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, User, X, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CustomerSelectorProps {
  selectedCustomerId: string | null;
  onSelect: (customer: Customer | null) => void;
}

export function CustomerSelector({ selectedCustomerId, onSelect }: CustomerSelectorProps) {
  const { data: customers } = useCustomers();
  const createCustomer = useCreateCustomer();
  
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false); // For the dropdown/search area visibility if we were doing a custom dropdown, but here we might just show the list inline or in a popover. 
  // Let's use a simple inline search for now or a dialog for selection if the list is long. 
  // Actually, a "Search Customer" input that shows results below is good.

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    documentNumber: "",
    name: "",
    phone: "",
    email: "",
    address: ""
  });

  const selectedCustomer = customers?.find(c => c.id === selectedCustomerId);

  const filteredCustomers = customers?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.documentNumber.includes(search)
  ).slice(0, 5); // Limit to 5 results

  const handleCreate = async () => {
    try {
      const newCustomer = await createCustomer.mutateAsync(newCustomerForm);
      toast.success("Cliente creado exitosamente");
      onSelect(newCustomer);
      setIsCreateOpen(false);
      setNewCustomerForm({ documentNumber: "", name: "", phone: "", email: "", address: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al crear cliente");
    }
  };

  if (selectedCustomer) {
    return (
      <div className="p-4 border rounded-lg bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium">{selectedCustomer.name}</div>
            <div className="text-sm text-slate-500">{selectedCustomer.documentNumber}</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onSelect(null)}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Buscar cliente por nombre o CI/RUC..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>CI / RUC</Label>
                <Input 
                  value={newCustomerForm.documentNumber}
                  onChange={(e) => setNewCustomerForm({...newCustomerForm, documentNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Nombre Completo</Label>
                <Input 
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({...newCustomerForm, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input 
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({...newCustomerForm, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm({...newCustomerForm, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input 
                  value={newCustomerForm.address}
                  onChange={(e) => setNewCustomerForm({...newCustomerForm, address: e.target.value})}
                />
              </div>
              <Button onClick={handleCreate} className="w-full">Guardar Cliente</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {search && (
        <div className="border rounded-lg divide-y bg-white shadow-sm">
          {filteredCustomers?.map(customer => (
            <div 
              key={customer.id} 
              className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center"
              onClick={() => {
                onSelect(customer);
                setSearch("");
              }}
            >
              <div>
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-slate-500">{customer.documentNumber}</div>
              </div>
              <Button size="sm" variant="ghost">Seleccionar</Button>
            </div>
          ))}
          {filteredCustomers?.length === 0 && (
            <div className="p-4 text-center text-slate-500 text-sm">
              No se encontraron clientes
            </div>
          )}
        </div>
      )}
    </div>
  );
}
