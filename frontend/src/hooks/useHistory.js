import { useState } from 'react';
import { historyService } from '../services/historyService';
import { showToast } from '../components/common/ToastNotifications';

export const useHistory = () => {
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const getHistory = async (params = {}) => {
        setLoading(true);
        try {
            const response = await historyService.getHistory(params);
            setHistory(response);
            return response;
        } catch (error) {
            showToast.error('Failed to load history');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getHistoryById = async (id) => {
        setLoading(true);
        try {
            const response = await historyService.getHistoryById(id);
            return response;
        } catch (error) {
            showToast.error('Failed to load history details');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteHistory = async (id) => {
        setLoading(true);
        try {
            await historyService.deleteHistory(id);
            showToast.success('History deleted successfully');
            return true;
        } catch (error) {
            showToast.error('Failed to delete history');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const searchHistory = async (query, params = {}) => {
        setLoading(true);
        try {
            const response = await historyService.searchHistory(query, params);
            return response;
        } catch (error) {
            showToast.error('Search failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        history,
        getHistory,
        getHistoryById,
        deleteHistory,
        searchHistory
    };
};