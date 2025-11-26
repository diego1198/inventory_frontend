import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

import { Category } from "@/types";

export type Product = {
  id: string;
  name: string;
  description?: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  category?: Category;
  categoryId?: string;
  isActive?: boolean;
};

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ["products", { category }],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product[]>>("/products", { params: { category } });
      return data.data;
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Product>) => {
      const { data } = await api.post<ApiResponse<Product>>("/products", payload);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Product> & { id: string }) => {
      const { data } = await api.patch<ApiResponse<Product>>(`/products/${id}`, payload);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse<Product>>(`/products/${id}`);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}


