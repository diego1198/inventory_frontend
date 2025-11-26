import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api";

export type Category = {
    id: string;
    name: string;
    description?: string;
};

type CreateCategoryDto = {
    name: string;
    description?: string;
};

type UpdateCategoryDto = {
    name?: string;
    description?: string;
};

export function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<Category[]>>("/categories");
            return data.data;
        },
    });
}

export function useCreateCategory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (categoryData: CreateCategoryDto) => {
            const { data } = await api.post<ApiResponse<Category>>("/categories", categoryData);
            return data.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Categoría creada exitosamente");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Error al crear la categoría");
        },
    });
}

export function useUpdateCategory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data: categoryData }: { id: string; data: UpdateCategoryDto }) => {
            const { data } = await api.patch<ApiResponse<Category>>(`/categories/${id}`, categoryData);
            return data.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Categoría actualizada exitosamente");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Error al actualizar la categoría");
        },
    });
}

export function useDeleteCategory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Categoría eliminada exitosamente");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Error al eliminar la categoría");
        },
    });
}
