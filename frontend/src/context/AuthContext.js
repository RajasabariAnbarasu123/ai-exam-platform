import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { showToast } from '../components/common/ToastNotifications';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [registrationEnabled, setRegistrationEnabled] = useState(true);

    const checkPlatformStatus = useCallback(async () => {
        try {
            const status = await authService.getPlatformStatus();
            setMaintenanceMode(status.maintenanceMode);
            setRegistrationEnabled(status.registrationEnabled);
            return status;
        } catch (error) {
            console.error('Failed to fetch platform status:', error);
            return null;
        }
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            await checkPlatformStatus();
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const response = await authService.login(email, password);
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            setUser(response);
            setIsAuthenticated(true);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const signup = useCallback(async (userData) => {
        setLoading(true);
        try {
            const response = await authService.signup(userData);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
        }
    }, []);

    const refreshToken = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token');
            
            const response = await authService.refreshToken(refreshToken);
            localStorage.setItem('accessToken', response.accessToken);
            return response;
        } catch (error) {
            throw error;
        }
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated,
        maintenanceMode,
        registrationEnabled,
        login,
        signup,
        logout,
        refreshToken,
        checkPlatformStatus,
        setUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};