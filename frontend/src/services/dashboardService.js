import api from './api';

export const dashboardService = {
    // Get dashboard data
    getDashboardData: async () => {
        const response = await api.get('/dashboard');
        return response.data;
    },

    // Get weekly performance
    getWeeklyPerformance: async () => {
        const response = await api.get('/dashboard/weekly-performance');
        return response.data;
    },

    // Get difficulty analysis
    getDifficultyAnalysis: async () => {
        const response = await api.get('/dashboard/difficulty-analysis');
        return response.data;
    },

    // Get question type analysis
    getQuestionTypeAnalysis: async () => {
        const response = await api.get('/dashboard/question-type-analysis');
        return response.data;
    },

    // Get recent exams
    getRecentExams: async () => {
        const response = await api.get('/dashboard/recent-exams');
        return response.data;
    },

    // Get overall stats
    getOverallStats: async () => {
        const response = await api.get('/dashboard/overall-stats');
        return response.data;
    },

    // Get strength and weakness analysis
    getStrengthWeakness: async () => {
        const response = await api.get('/dashboard/strength-weakness');
        return response.data;
    },

    // Get subject wise performance
    getSubjectWisePerformance: async () => {
        const response = await api.get('/dashboard/subject-wise-performance');
        return response.data;
    }
};