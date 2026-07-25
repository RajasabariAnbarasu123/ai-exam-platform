import api from './api';

export const adminService = {
    // Get admin dashboard
    getDashboard: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    // Get admin stats
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    // Get all users
    getUsers: async (params = {}) => {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    // Get all exams
    getExams: async (params = {}) => {
        const response = await api.get('/admin/exams', { params });
        return response.data;
    },

    // Get analytics
    getAnalytics: async () => {
        const response = await api.get('/admin/analytics');
        return response.data;
    },

    // Get popular topics
    getPopularTopics: async () => {
        const response = await api.get('/admin/popular-topics');
        return response.data;
    },

    // Get popular difficulties
    getPopularDifficulties: async () => {
        const response = await api.get('/admin/popular-difficulties');
        return response.data;
    },

    // Get popular question types
    getPopularQuestionTypes: async () => {
        const response = await api.get('/admin/popular-question-types');
        return response.data;
    },

    // Get AI usage stats
    getAIUsageStats: async () => {
        const response = await api.get('/admin/ai-usage-stats');
        return response.data;
    },

    // Get daily active users
    getDailyActiveUsers: async () => {
        const response = await api.get('/admin/daily-active-users');
        return response.data;
    },

    // Update user role
    updateUserRole: async (userId, role) => {
        const response = await api.put(`/admin/users/${userId}/role`, null, {
            params: { role }
        });
        return response.data;
    },

    // Delete user
    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },

    // Delete exam
    deleteExam: async (examId) => {
        const response = await api.delete(`/admin/exams/${examId}`);
        return response.data;
    },

    // Get system health
    getSystemHealth: async () => {
        const response = await api.get('/admin/system-health');
        return response.data;
    },

    // Get performance metrics
    getPerformanceMetrics: async () => {
        const response = await api.get('/admin/performance-metrics');
        return response.data;
    },

    // Get settings
    getSettings: async () => {
        const response = await api.get('/admin/settings');
        return response.data;
    },

    // Update settings
    updateSettings: async (settings) => {
        const response = await api.put('/admin/settings', settings);
        return response.data;
    }
};