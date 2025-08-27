"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegister } from "@/hooks/useAuth";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "cashier" as "admin" | "cashier",
  });
  
  const register = useRegister();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register.mutateAsync(form);
      router.replace("/auth/login");
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <Label htmlFor="firstName">Nombre</Label>
          <Input 
            id="firstName" 
            value={form.firstName} 
            onChange={(e) => setForm({ ...form, firstName: e.target.value })} 
            required 
          />
        </div>
        <div>
          <Label htmlFor="lastName">Apellido</Label>
          <Input 
            id="lastName" 
            value={form.lastName} 
            onChange={(e) => setForm({ ...form, lastName: e.target.value })} 
            required 
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
            required 
          />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input 
            id="password" 
            type="password" 
            value={form.password} 
            onChange={(e) => setForm({ ...form, password: e.target.value })} 
            required 
          />
        </div>
        <div>
          <Label htmlFor="role">Rol</Label>
          <Select value={form.role} onValueChange={(value: "admin" | "cashier") => setForm({ ...form, role: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cashier">Cajero</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={register.isPending} className="w-full">
          {register.isPending ? "Registrando..." : "Registrar"}
        </Button>
        <div className="text-center">
          <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
