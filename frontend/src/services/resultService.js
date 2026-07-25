import api from './api';

export const resultService = {
    // Get result by ID
    getResult: async (resultId) => {
        const response = await api.get(`/results/${resultId}`);
        return response.data;
    },

    // Get AI feedback
    getAIFeedback: async (resultId) => {
        const response = await api.get(`/results/feedback/${resultId}`);
        return response.data;
    },

    // Get result analytics
    getResultAnalytics: async (resultId) => {
        const response = await api.get(`/results/analytics/${resultId}`);
        return response.data;
    },

    // Get performance rating
    getPerformanceRating: async (percentage) => {
        const response = await api.get('/results/performance-rating', {
            params: { percentage }
        });
        return response.data;
    },

    // Get result summary
    getResultSummary: async (resultId) => {
        const response = await api.get(`/results/summary/${resultId}`);
        return response.data;
    },

    // Export result as PDF
    exportResult: async (resultId, format = 'pdf') => {
        const response = await api.post(`/results/export-pdf/${resultId}`, null, {
            responseType: 'blob'
        });
        return response.data;
    }
};