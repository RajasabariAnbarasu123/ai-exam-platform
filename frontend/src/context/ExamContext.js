import React, { createContext, useState, useCallback } from 'react';
import { examService } from '../services/examService';
import { showToast } from '../components/common/ToastNotifications';

export const ExamContext = createContext(null);

export const ExamProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [currentExam, setCurrentExam] = useState(null);
    const [examHistory, setExamHistory] = useState([]);

    const generateExam = useCallback(async (examData) => {
        setLoading(true);
        try {
            const response = await examService.generateExam(examData);
            setCurrentExam(response);
            showToast.success('Exam generated successfully!');
            return response;
        } catch (error) {
            showToast.error('Failed to generate exam');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const getExam = useCallback(async (examId) => {
        setLoading(true);
        try {
            const response = await examService.getExam(examId);
            setCurrentExam(response);
            return response;
        } catch (error) {
            showToast.error('Failed to load exam');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const submitExam = useCallback(async (examId, answers) => {
        setLoading(true);
        try {
            const response = await examService.submitExam(examId, answers);
            showToast.success('Exam submitted successfully!');
            return response;
        } catch (error) {
            showToast.error('Failed to submit exam');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const autoSubmitExam = useCallback(async (examId) => {
        setLoading(true);
        try {
            const response = await examService.autoSubmitExam(examId);
            showToast.info('Exam auto-submitted');
            return response;
        } catch (error) {
            showToast.error('Failed to auto-submit exam');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const getTimerSettings = useCallback(async (difficulty, questionType) => {
        try {
            const response = await examService.getTimerSettings(difficulty, questionType);
            return response;
        } catch (error) {
            showToast.error('Failed to get timer settings');
            throw error;
        }
    }, []);

    const getExamStatus = useCallback(async (examId) => {
        try {
            const response = await examService.getExamStatus(examId);
            return response;
        } catch (error) {
            throw error;
        }
    }, []);

    const retryGeneration = useCallback(async (examData) => {
        setLoading(true);
        try {
            const response = await examService.retryGeneration(examData);
            setCurrentExam(response);
            showToast.success('Exam regenerated successfully!');
            return response;
        } catch (error) {
            showToast.error('Failed to regenerate exam');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearCurrentExam = useCallback(() => {
        setCurrentExam(null);
    }, []);

    const value = {
        loading,
        currentExam,
        examHistory,
        generateExam,
        getExam,
        submitExam,
        autoSubmitExam,
        getTimerSettings,
        getExamStatus,
        retryGeneration,
        clearCurrentExam
    };

    return (
        <ExamContext.Provider value={value}>
            {children}
        </ExamContext.Provider>
    );
};