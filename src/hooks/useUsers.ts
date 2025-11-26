import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'superadmin' | 'admin' | 'cashier';
    isActive: boolean;
    createdAt: string;
}

export interface CreateUserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'superadmin' | 'admin' | 'cashier';
}

export interface UpdateUserData {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: 'superadmin' | 'admin' | 'cashier';
}

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await api.get<{ data: User[] }>("/users");
            return data.data;
        },
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: CreateUserData) => {
            const { data } = await api.post<User>('/users', userData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Usuario creado exitosamente');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al crear usuario';
            toast.error(message);
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }) => {
            const response = await api.patch<User>(`/users/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Usuario actualizado exitosamente');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al actualizar usuario';
            toast.error(message);
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Usuario desactivado exitosamente');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al desactivar usuario';
            toast.error(message);
        },
    });
}
