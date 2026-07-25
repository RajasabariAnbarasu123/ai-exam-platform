import { useState } from 'react';
import { userService } from '../services/userService';
import { showToast } from '../components/common/ToastNotifications';

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    const getUserProfile = async () => {
        setLoading(true);
        try {
            const response = await userService.getProfile();
            setUser(response);
            return response;
        } catch (error) {
            showToast.error('Failed to load profile');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (data) => {
        setLoading(true);
        try {
            const response = await userService.updateProfile(data);
            setUser(response);
            showToast.success('Profile updated successfully');
            return response;
        } catch (error) {
            showToast.error('Failed to update profile');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (data) => {
        setLoading(true);
        try {
            await userService.changePassword(data);
            showToast.success('Password changed successfully');
            return true;
        } catch (error) {
            showToast.error('Failed to change password');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const uploadProfilePicture = async (file) => {
        setLoading(true);
        try {
            const response = await userService.uploadProfilePicture(file);
            setUser(response);
            showToast.success('Profile picture updated');
            return response;
        } catch (error) {
            showToast.error('Failed to upload profile picture');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteAccount = async () => {
        setLoading(true);
        try {
            await userService.deleteAccount();
            showToast.success('Account deleted successfully');
            return true;
        } catch (error) {
            showToast.error('Failed to delete account');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        user,
        getUserProfile,
        updateProfile,
        changePassword,
        uploadProfilePicture,
        deleteAccount
    };
};