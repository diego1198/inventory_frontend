import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
};

export async function getProductById(id: string) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function updateProduct(id: string, data: any) {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
}


