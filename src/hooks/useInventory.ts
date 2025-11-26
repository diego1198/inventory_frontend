import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export enum MovementType {
    IN = 'IN',
    OUT = 'OUT',
}

export type InventoryMovement = {
    id: string;
    productId: string;
    product?: {
        name: string;
    };
    type: MovementType;
    quantity: number;
    unitPrice?: number;
    reason?: string;
    createdAt: string;
    userId: string;
    user?: {
        name: string;
        email: string;
    };
};

export type CreateMovementPayload = {
    productId: string;
    type: MovementType;
    quantity: number;
    unitPrice?: number;
    reason?: string;
};

export function useInventoryMovements(productId?: string) {
    return useQuery({
        queryKey: ["inventory-movements", { productId }],
        queryFn: async () => {
            const { data } = await api.get<InventoryMovement[]>("/inventory/movements", {
                params: { productId },
            });
            // The backend returns the array directly or wrapped? 
            // Based on other hooks, it seems to be wrapped in ApiResponse usually, but let's check controller.
            // Controller returns `this.inventoryService.findAll(productId)`.
            // NestJS interceptor `TransformInterceptor` (seen in main.ts) wraps response in `data`.
            // So it should be `data.data` if interceptor is global.
            // Wait, api.get<T> usually returns AxiosResponse<T>.
            // If backend returns { data: [...] }, then T should be { data: [...] }.
            // Let's assume ApiResponse pattern is used.
            return (data as any).data || data;
        },
        enabled: !!productId,
    });
}

export function useCreateInventoryMovement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateMovementPayload) => {
            const { data } = await api.post<ApiResponse<InventoryMovement>>("/inventory/movements", payload);
            return data.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] });
            qc.invalidateQueries({ queryKey: ["inventory-movements"] });
        },
    });
}
