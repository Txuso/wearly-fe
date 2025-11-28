/**
 * API Service Layer
 * Centralized API client for all backend communication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ChatRequest {
    message: string;
    sessionId?: string;
}

export interface ChatResponse {
    reply: string;
    sessionId: string;
    products?: Array<{
        id?: string;
        name?: string;
        price?: number | string;
        originalPrice?: number | string;
        image?: string;
        source?: string;
        color?: string;
        size?: string;
        category?: string;
        inStock?: boolean;
        description?: string;
    }>;
}

export interface UploadImageResponse {
    imageId: string;
    url: string;
}

export interface TryOnRequest {
    userImageId: string;
    productId: string;
}

export interface TryOnResponse {
    tryOnImageUrl: string;
    processingTime: number;
}

export interface HealthResponse {
    status: string;
    timestamp: string;
}

class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(
                response.status,
                errorData.message || `Server responded with status ${response.status}`,
                errorData
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        // Network or other errors
        throw new ApiError(
            0,
            error instanceof Error ? error.message : 'Network error occurred',
            { originalError: error }
        );
    }
}

/**
 * Chat API
 */
export const chatApi = {
    /**
     * Send a chat message to the AI assistant
     */
    async sendMessage(request: ChatRequest): Promise<ChatResponse> {
        return fetchApi<ChatResponse>('/api/chat', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },
};

/**
 * Upload API
 */
export const uploadApi = {
    /**
     * Upload a user image for virtual try-on
     */
    async uploadUserImage(file: File): Promise<UploadImageResponse> {
        const formData = new FormData();
        formData.append('image', file);

        const url = `${API_BASE_URL}/api/upload-user-image`;

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header - browser will set it with boundary
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(
                response.status,
                errorData.message || `Upload failed with status ${response.status}`,
                errorData
            );
        }

        return await response.json();
    },
};

/**
 * Try-On API
 */
export const tryOnApi = {
    /**
     * Generate a virtual try-on image
     */
    async generateTryOn(request: TryOnRequest): Promise<TryOnResponse> {
        return fetchApi<TryOnResponse>('/api/try-on', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },
};

/**
 * Health Check API
 */
export const healthApi = {
    /**
     * Check if the backend service is healthy
     */
    async check(): Promise<HealthResponse> {
        return fetchApi<HealthResponse>('/health', {
            method: 'GET',
        });
    },
};

// Export the ApiError for error handling in components
export { ApiError };

// Default export with all APIs
export default {
    chat: chatApi,
    upload: uploadApi,
    tryOn: tryOnApi,
    health: healthApi,
};
