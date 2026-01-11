// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // This is enough for all requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request to:', config.url); // For debugging
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => {
        console.log('Response from:', response.config.url);
        return response;
    },
    async (error) => {
        console.error('Response error:', error.response?.status, error.config.url);

        const originalRequest = error.config;

        // If error is 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log('Attempting token refresh...');

                // Use api instance for refresh token call
                const response = await api.post('/auth/refresh-token');

                const { accessToken, refreshToken } = response.data.data;

                // Store new tokens
                localStorage.setItem('accessToken', accessToken);
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }

                // Update the failed request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                console.log('Token refreshed successfully');

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);

                // Clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Only redirect if not already on login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        // For other errors
        return Promise.reject(error);
    }
);

// Auth endpoints - NO need for withCredentials in each call
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    refreshToken: () => api.post('/auth/refresh-token'),
    getProfile: () => api.get('/auth/profile'),
    getAllProducts: () => api.get('/products'),
    getSingleProduct: () => api.get(`/products/${styleNumber}`)

};

export default api;