import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import ProfileInfo from './ProfileInfo';
import ProfileStats from './ProfileStats';
import ChangePassword from './ChangePassword';
import ProfileEdit from './ProfileEdit';
import LoadingSpinner from '../common/LoadingSpinner';
import { showToast } from '../common/ToastNotifications';
import { 
    User, 
    Settings, 
    Lock, 
    BarChart3,
    LogOut,
    ChevronRight
} from 'lucide-react';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { getUserProfile, loading } = useUser();
    const [profile, setProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getUserProfile();
            setProfile(data);
        } catch (error) {
            showToast.error('Failed to load profile');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        showToast.success('Logged out successfully');
    };

    const tabs = [
        { id: 'info', label: 'Profile Info', icon: User },
        { id: 'edit', label: 'Edit Profile', icon: Settings },
        { id: 'stats', label: 'Statistics', icon: BarChart3 },
        { id: 'password', label: 'Change Password', icon: Lock },
    ];

    if (loading || !profile) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">
                        Profile Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your account settings and preferences
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-4">
                        {/* User Avatar */}
                        <div className="text-center mb-4">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                                {profile.fullName?.charAt(0) || profile.email?.charAt(0) || 'U'}
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {profile.fullName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {profile.email}
                            </p>
                            <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                                {profile.role}
                            </span>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Icon className="w-4 h-4" />
                                            <span>{tab.label}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                );
                            })}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="glass-card p-6 min-h-[400px]">
                        {activeTab === 'info' && <ProfileInfo profile={profile} />}
                        {activeTab === 'edit' && <ProfileEdit profile={profile} onUpdate={fetchProfile} />}
                        {activeTab === 'stats' && <ProfileStats profile={profile} />}
                        {activeTab === 'password' && <ChangePassword />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;