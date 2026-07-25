import api from './api';

export const examService = {
    // Generate exam
    generateExam: async (examData) => {
        const response = await api.post('/exams/generate', examData);
        return response.data;
    },

    // Get exam by ID
    getExam: async (examId) => {
        const response = await api.get(`/exams/${examId}`);
        return response.data;
    },

    // Submit exam
    submitExam: async (examId, answers) => {
        const response = await api.post('/exams/submit', answers, {
            params: { examId }
        });
        return response.data;
    },

    // Submit single answer
    submitSingleAnswer: async (answer) => {
        const response = await api.post('/exams/submit-single', answer);
        return response.data;
    },

    // Auto-submit exam
    autoSubmitExam: async (examId) => {
        const response = await api.post(`/exams/auto-submit/${examId}`);
        return response.data;
    },

    // Get timer settings
    getTimerSettings: async (difficulty, questionType) => {
        const response = await api.get('/exams/timer-settings', {
            params: { difficulty, questionType }
        });
        return response.data;
    },

    // Get exam status
    getExamStatus: async (examId) => {
        const response = await api.get(`/exams/status/${examId}`);
        return response.data;
    },

    // Retry generation
    retryGeneration: async (examData) => {
        const response = await api.post('/exams/retry-generation', examData);
        return response.data;
    },

    // Get exam settings (admin-configured limits exposed to users)
    getExamSettings: async () => {
        const response = await api.get('/exams/settings');
        return response.data;
    }
};