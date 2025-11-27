import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export type SaleItem = { 
  id: string;
  productId: string; 
  quantity: number; 
  unitPrice: number;
  total: number;
  product: {
    name: string;
    description?: string;
  };
};

export type CreateSalePayload = {
  items: { productId: string; quantity: number }[];
  notes?: string;
};

export type Sale = { 
  id: string; 
  invoiceNumber: string;
  subtotal: number;
  tax: number;
  total: number; 
  status: string;
  notes?: string; 
  createdAt: string; 
  user?: {
    firstName: string;
    lastName: string;
  };
  customer?: {
    name: string;
    documentNumber: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items: SaleItem[];
};
export function useSales() {
  return useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Sale[]>>("/sales");
      return data.data;
    },
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSalePayload) => {
      const { data } = await api.post<ApiResponse<Sale>>("/sales", payload);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sales"] }),
  });
}


