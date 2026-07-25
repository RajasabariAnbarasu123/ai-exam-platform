import api from './api';

export const authService = {
    // Register new user
    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    // Login user
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // Refresh token
    refreshToken: async (refreshToken) => {
        const response = await api.post('/auth/refresh-token', { refreshToken });
        return response.data;
    },

    // Verify email
    verifyEmail: async (token) => {
        const response = await api.post('/auth/verify-email', null, {
            params: { token }
        });
        return response.data;
    },

    // Forgot password
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        const response = await api.post('/auth/reset-password', {
            token,
            newPassword
        });
        return response.data;
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    // Get platform status (maintenanceMode and registrationEnabled flags)
    getPlatformStatus: async () => {
        const response = await api.get('/public/status');
        return response.data;
    }
};