import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export type SaleItem = { 
  productId: string; 
  quantity: number; 
};

export type CreateSalePayload = {
  items: SaleItem[];
  notes?: string;
};

export type Sale = { 
  id: string; 
  items: SaleItem[]; 
  total: number; 
  notes?: string;
  createdAt: string; 
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


