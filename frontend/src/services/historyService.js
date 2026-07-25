import api from './api';

export const historyService = {
    // Get exam history with filters
    getHistory: async (params = {}) => {
        const { sortBy, sortOrder, ...rest } = params;
        const formattedParams = { ...rest };
        if (sortBy) {
            formattedParams.sort = `${sortBy},${sortOrder || 'desc'}`;
        }
        const response = await api.get('/history', { params: formattedParams });
        return response.data;
    },

    // Get history by ID
    getHistoryById: async (id) => {
        const response = await api.get(`/history/${id}`);
        return response.data;
    },

    // Get unique topics
    getTopics: async () => {
        const response = await api.get('/history/topics');
        return response.data;
    },

    // Get unique difficulties
    getDifficulties: async () => {
        const response = await api.get('/history/difficulties');
        return response.data;
    },

    // Get history stats
    getHistoryStats: async () => {
        const response = await api.get('/history/stats');
        return response.data;
    },

    // Search history
    searchHistory: async (query, params = {}) => {
        const { sortBy, sortOrder, ...rest } = params;
        const formattedParams = { ...rest };
        if (sortBy) {
            formattedParams.sort = `${sortBy},${sortOrder || 'desc'}`;
        }
        const response = await api.get('/history/search', {
            params: { query, ...formattedParams }
        });
        return response.data;
    },

    // Get filter options
    getFilterOptions: async () => {
        const response = await api.get('/history/filter-options');
        return response.data;
    },

    // Delete history record
    deleteHistory: async (id) => {
        const response = await api.delete(`/history/${id}`);
        return response.data;
    }
};