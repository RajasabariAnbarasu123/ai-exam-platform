import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Setup interceptors for handling token refresh
export const setupInterceptors = (navigate) => {
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue = [];
    };

    // Request interceptor
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            // If error is not 401 or request already retried, reject
            if (error.response?.status !== 401 || originalRequest._retry) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Queue the request if refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axios(originalRequest);
                })
                .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                    refreshToken
                });

                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);

                processQueue(null, accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                
                // Clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                
                if (navigate) {
                    navigate('/login', { 
                        state: { 
                            message: 'Session expired. Please login again.' 
                        } 
                    });
                }
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
    );
};

// Utility to handle API errors
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error status
        return {
            status: error.response.status,
            message: error.response.data?.message || 'An error occurred',
            data: error.response.data
        };
    } else if (error.request) {
        // Request made but no response
        return {
            status: 0,
            message: 'No response from server. Please check your connection.',
            data: null
        };
    } else {
        // Error in request setup
        return {
            status: -1,
            message: error.message || 'An error occurred',
            data: null
        };
    }
};