import { useState } from 'react';
import { resultService } from '../services/resultService';
import { showToast } from '../components/common/ToastNotifications';

export const useResults = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const getResult = async (id) => {
        setLoading(true);
        try {
            const response = await resultService.getResult(id);
            setResult(response);
            return response;
        } catch (error) {
            showToast.error('Failed to load result');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getAIFeedback = async (resultId) => {
        setLoading(true);
        try {
            const response = await resultService.getAIFeedback(resultId);
            return response;
        } catch (error) {
            showToast.error('Failed to load AI feedback');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getResultAnalytics = async (resultId) => {
        setLoading(true);
        try {
            const response = await resultService.getResultAnalytics(resultId);
            return response;
        } catch (error) {
            showToast.error('Failed to load analytics');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const exportResult = async (resultId, format = 'pdf') => {
        setLoading(true);
        try {
            const response = await resultService.exportResult(resultId, format);
            return response;
        } catch (error) {
            showToast.error(`Failed to export as ${format.toUpperCase()}`);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        result,
        getResult,
        getAIFeedback,
        getResultAnalytics,
        exportResult
    };
};