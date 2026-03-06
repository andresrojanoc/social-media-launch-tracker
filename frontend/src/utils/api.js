const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api`;

/**
 * Custom error class for API failures.
 */
export class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

async function handleResponse(response) {
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { message: response.statusText };
        }

        // Use the standardized message from our backend handler if available
        const errorMessage = errorData.message || `API request failed with status ${response.status}`;
        throw new ApiError(errorMessage, response.status, errorData);
    }
    return response.json();
}

export const apiClient = {
    async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            // Handle network/offline errors
            throw new ApiError('Network error: Unable to connect to the server. Please check if the backend is running.', 0, null);
        }
    },

    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError('Network error: Unable to connect to the server.', 0, null);
        }
    },

    async delete(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
            });
            // DELETE requests normally return 204 No Content, which response.json() fails on
            if (response.status === 204) return null;
            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError('Network error: Unable to connect to the server.', 0, null);
        }
    }
};

export default apiClient;
