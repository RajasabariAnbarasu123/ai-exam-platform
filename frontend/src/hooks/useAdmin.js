import { useState } from 'react';
import { adminService } from '../services/adminService';
import { showToast } from '../components/common/ToastNotifications';

export const useAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);

    const getAdminDashboard = async () => {
        setLoading(true);
        try {
            const response = await adminService.getDashboard();
            return response;
        } catch (error) {
            showToast.error('Failed to load admin dashboard');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getAdminStats = async () => {
        setLoading(true);
        try {
            const response = await adminService.getStats();
            setStats(response);
            return response;
        } catch (error) {
            showToast.error('Failed to load admin stats');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getUsers = async (params = {}) => {
        setLoading(true);
        try {
            const response = await adminService.getUsers(params);
            return response;
        } catch (error) {
            showToast.error('Failed to load users');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, role) => {
        setLoading(true);
        try {
            const response = await adminService.updateUserRole(userId, role);
            showToast.success('User role updated');
            return response;
        } catch (error) {
            showToast.error('Failed to update user role');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        setLoading(true);
        try {
            await adminService.deleteUser(userId);
            showToast.success('User deleted successfully');
            return true;
        } catch (error) {
            showToast.error('Failed to delete user');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getExams = async (params = {}) => {
        setLoading(true);
        try {
            const response = await adminService.getExams(params);
            return response;
        } catch (error) {
            showToast.error('Failed to load exams');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteExam = async (examId) => {
        setLoading(true);
        try {
            await adminService.deleteExam(examId);
            showToast.success('Exam deleted successfully');
            return true;
        } catch (error) {
            showToast.error('Failed to delete exam');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getAnalytics = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAnalytics();
            return response;
        } catch (error) {
            showToast.error('Failed to load analytics');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (settings) => {
        setLoading(true);
        try {
            const response = await adminService.updateSettings(settings);
            showToast.success('Settings updated');
            return response;
        } catch (error) {
            showToast.error('Failed to update settings');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getSettings = async () => {
        setLoading(true);
        try {
            const response = await adminService.getSettings();
            return response;
        } catch (error) {
            showToast.error('Failed to load settings');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        stats,
        getAdminDashboard,
        getAdminStats,
        getUsers,
        updateUserRole,
        deleteUser,
        getExams,
        deleteExam,
        getAnalytics,
        getSettings,
        updateSettings
    };
};