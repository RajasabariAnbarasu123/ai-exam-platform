import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import AdminStats from './AdminStats';
import AdminUsers from './AdminUsers';
import AdminExams from './AdminExams';
import AdminAnalytics from './AdminAnalytics';
import AdminSettings from './AdminSettings';
import LoadingSpinner from '../common/LoadingSpinner';
import { showToast } from '../common/ToastNotifications';
import { 
    LayoutDashboard, 
    Users, 
    BookOpen, 
    BarChart3,
    Settings,
    ChevronRight
} from 'lucide-react';

const AdminDashboard = () => {
    const { getAdminDashboard, getAdminStats, loading } = useAdmin();
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Load both endpoints and merge: /admin/dashboard has globalAvgScore, activeUsersToday, popularTopics
            // /admin/stats has usersThisWeek, examsThisWeek, admins, maxScore, minScore, avgScore
            const [dashData, statsData] = await Promise.all([
                getAdminDashboard(),
                getAdminStats()
            ]);
            // Merge with statsData taking priority for fields in common
            setStats({ ...dashData, ...statsData });
        } catch (error) {
            showToast.error('Failed to load admin stats');
        }
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'exams', label: 'Exams', icon: BookOpen },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    if (loading || !stats) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your platform and monitor activity
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-4">
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
                </div>

                {/* Content */}
                <div className="lg:col-span-4">
                    {activeTab === 'dashboard' && <AdminStats stats={stats} />}
                    {activeTab === 'users' && <AdminUsers />}
                    {activeTab === 'exams' && <AdminExams />}
                    {activeTab === 'analytics' && <AdminAnalytics />}
                    {activeTab === 'settings' && <AdminSettings />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;