import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "superadmin" | "admin" | "cashier";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

type AuthResponse = {
  access_token: string;
  user: User;
};

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        // Try NestJS auth first
        const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", credentials);
        return { access_token: data.data.access_token, user: data.data.user, source: "nestjs" as const };
      } catch (error) {
        // Fallback to Supabase
        const { data, error: supabaseError } = await supabase.auth.signInWithPassword(credentials);
        if (supabaseError || !data.session) throw supabaseError || new Error("No session");
        return { access_token: data.session.access_token, user: data.user, source: "supabase" as const };
      }
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        document.cookie = `access_token=${data.access_token}; path=/; SameSite=Lax`;
      }

      qc.setQueryData(["user"], data.user);
      toast.success("Sesión iniciada");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al iniciar sesión");
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem("access_token");
      document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      await supabase.auth.signOut();
      qc.clear();
      toast.success("Sesión cerrada");
    },
  });
}
