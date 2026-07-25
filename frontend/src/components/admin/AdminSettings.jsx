import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../common/ToastNotifications';
import { 
    Save, 
    RefreshCw, 
    Shield, 
    Mail, 
    Database,
    Server,
    AlertCircle,
    Loader2
} from 'lucide-react';

const AdminSettings = () => {
    const { getSettings, updateSettings, loading } = useAdmin();
    const { checkPlatformStatus } = useAuth();
    const [settings, setSettings] = useState({
        siteName: '',
        siteDescription: '',
        maintenanceMode: false,
        registrationEnabled: true,
        emailNotifications: true,
        maxExamAttempts: 3,
        defaultDifficulty: 'MEDIUM',
        aiModel: 'gemini-3.5-flash',
        maxQuestions: 30,
        minQuestions: 5,
    });

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await getSettings();
                setSettings(data);
            } catch (error) {
                showToast.error('Failed to load settings');
            }
        };
        loadSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateSettings(settings);
            await checkPlatformStatus();
            showToast.success('Settings updated successfully');
        } catch (error) {
            showToast.error('Failed to update settings');
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                System Settings
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Settings */}
                <div className="glass-card p-6">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                        General Settings
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Site Name
                            </label>
                            <input
                                type="text"
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Site Description
                            </label>
                            <textarea
                                name="siteDescription"
                                value={settings.siteDescription}
                                onChange={handleChange}
                                rows={2}
                                className="form-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Exam Settings */}
                <div className="glass-card p-6">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                        Exam Settings
                    </h4>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Min Questions
                                </label>
                                <input
                                    type="number"
                                    name="minQuestions"
                                    value={settings.minQuestions}
                                    onChange={handleChange}
                                    className="form-input"
                                    min={1}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Max Questions
                                </label>
                                <input
                                    type="number"
                                    name="maxQuestions"
                                    value={settings.maxQuestions}
                                    onChange={handleChange}
                                    className="form-input"
                                    min={1}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Default Difficulty
                            </label>
                            <select
                                name="defaultDifficulty"
                                value={settings.defaultDifficulty}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Max Exam Attempts
                            </label>
                            <input
                                type="number"
                                name="maxExamAttempts"
                                value={settings.maxExamAttempts}
                                onChange={handleChange}
                                className="form-input"
                                min={1}
                            />
                        </div>
                    </div>
                </div>

                {/* AI Settings */}
                <div className="glass-card p-6">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                        AI Settings
                    </h4>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            AI Model
                        </label>
                        <select
                            name="aiModel"
                            value={settings.aiModel}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="gemini-3.5-flash">Gemini 3.5 Flash (Recommended)</option>
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                        </select>
                    </div>
                </div>

                {/* System Settings */}
                <div className="glass-card p-6">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                        System Settings
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    Maintenance Mode
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Disable all user access to the platform
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="maintenanceMode"
                                    checked={settings.maintenanceMode}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    User Registration
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Allow new users to register
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="registrationEnabled"
                                    checked={settings.registrationEnabled}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    Email Notifications
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Send system notifications via email
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="emailNotifications"
                                    checked={settings.emailNotifications}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 w-full"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    <span>Save Settings</span>
                </button>
            </form>
        </div>
    );
};

export default AdminSettings;