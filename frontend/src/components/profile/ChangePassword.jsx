import React, { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { showToast } from '../common/ToastNotifications';
import { 
    Eye, 
    EyeOff, 
    Lock, 
    Loader2,
    Check,
    X
} from 'lucide-react';

const ChangePassword = () => {
    const { changePassword, loading } = useUser();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (name === 'newPassword') {
            calculatePasswordStrength(value);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords({
            ...showPasswords,
            [field]: !showPasswords[field],
        });
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@#$%^&+=]/.test(password)) strength++;
        setPasswordStrength(strength);
    };

    const getPasswordStrengthColor = () => {
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
        return colors[Math.min(passwordStrength, 3)] || 'bg-gray-300';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            showToast.error('New passwords do not match');
            return;
        }

        if (passwordStrength < 2) {
            showToast.error('Password is too weak');
            return;
        }

        try {
            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });
            showToast.success('Password changed successfully!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            showToast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Change Password
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showPasswords.current ? 'text' : 'password'}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="form-input pl-10 pr-10"
                            placeholder="Enter current password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPasswords.current ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showPasswords.new ? 'text' : 'password'}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="form-input pl-10 pr-10"
                            placeholder="Enter new password"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPasswords.new ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                    {formData.newPassword && (
                        <div className="mt-2">
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    {['Weak', 'Fair', 'Good', 'Strong'][Math.min(passwordStrength, 3)]}
                                </span>
                            </div>
                            <div className="mt-1 grid grid-cols-2 gap-1 text-xs">
                                <span className={`flex items-center ${formData.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>
                                    {formData.newPassword.length >= 8 ? (
                                        <Check className="w-3 h-3 mr-1" />
                                    ) : (
                                        <X className="w-3 h-3 mr-1" />
                                    )}
                                    Min 8 characters
                                </span>
                                <span className={`flex items-center ${/[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                                    {/[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? (
                                        <Check className="w-3 h-3 mr-1" />
                                    ) : (
                                        <X className="w-3 h-3 mr-1" />
                                    )}
                                    Uppercase & lowercase
                                </span>
                                <span className={`flex items-center ${/\d/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                                    {/\d/.test(formData.newPassword) ? (
                                        <Check className="w-3 h-3 mr-1" />
                                    ) : (
                                        <X className="w-3 h-3 mr-1" />
                                    )}
                                    Contains number
                                </span>
                                <span className={`flex items-center ${/[@#$%^&+=]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                                    {/[@#$%^&+=]/.test(formData.newPassword) ? (
                                        <Check className="w-3 h-3 mr-1" />
                                    ) : (
                                        <X className="w-3 h-3 mr-1" />
                                    )}
                                    Special character
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="form-input pl-10 pr-10"
                            placeholder="Confirm new password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPasswords.confirm ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                    {formData.confirmPassword && (
                        <p className={`mt-1 text-sm ${formData.newPassword === formData.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                            {formData.newPassword === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || formData.newPassword !== formData.confirmPassword}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Lock className="w-5 h-5" />
                    )}
                    <span>Change Password</span>
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;