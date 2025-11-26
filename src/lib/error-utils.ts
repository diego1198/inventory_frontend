import { AxiosError } from "axios";

export interface ApiError {
    statusCode: number;
    timestamp: string;
    path: string;
    message: string | string[];
}

/**
 * Formats API error messages into a user-friendly string
 */
export function formatApiError(error: unknown): string {
    if (!error) return "Ha ocurrido un error desconocido";

    // Handle Axios errors
    if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError | undefined;

        if (apiError?.message) {
            // If message is an array (validation errors), join them
            if (Array.isArray(apiError.message)) {
                return apiError.message.join("\n");
            }
            // If message is a string, return it
            return apiError.message;
        }

        // Fallback to status text
        if (error.response?.statusText) {
            return error.response.statusText;
        }

        // Network error
        if (error.message === "Network Error") {
            return "Error de conexión. Verifica tu conexión a internet.";
        }

        return error.message || "Error al procesar la solicitud";
    }

    // Handle generic errors
    if (error instanceof Error) {
        return error.message;
    }

    return "Ha ocurrido un error desconocido";
}

/**
 * Gets a list of validation errors from an API error
 */
export function getValidationErrors(error: unknown): string[] {
    if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError | undefined;
        if (apiError?.message && Array.isArray(apiError.message)) {
            return apiError.message;
        }
    }
    return [];
}
