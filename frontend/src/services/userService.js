import api from './api';

export const userService = {
    // Get user profile
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (data) => {
        const response = await api.put('/users/profile', data);
        return response.data;
    },

    // Change password
    changePassword: async (data) => {
        const response = await api.post('/users/change-password', data);
        return response.data;
    },

    // Upload profile picture
    uploadProfilePicture: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/users/upload-profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Get user stats
    getUserStats: async () => {
        const response = await api.get('/users/stats');
        return response.data;
    },

    // Get best topic
    getBestTopic: async () => {
        const response = await api.get('/users/best-topic');
        return response.data;
    },

    // Get weak topic
    getWeakTopic: async () => {
        const response = await api.get('/users/weak-topic');
        return response.data;
    },

    // Delete account
    deleteAccount: async () => {
        const response = await api.delete('/users/account');
        return response.data;
    }
};