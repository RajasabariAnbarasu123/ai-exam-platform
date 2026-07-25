import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardCards from './DashboardCards';
import DashboardCharts from './DashboardCharts';
import DashboardRecentExams from './DashboardRecentExams';
import DashboardStats from './DashboardStats';
import LoadingSpinner from '../common/LoadingSpinner';
import { showToast } from '../common/ToastNotifications';
import { PlusCircle, TrendingUp } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            navigate('/admin/dashboard', { replace: true });
        } else {
            fetchDashboardData();
        }
    }, [user, navigate]);

    const fetchDashboardData = async () => {
        try {
            const response = await dashboardService.getDashboardData();
            setDashboardData(response);
        } catch (error) {
            showToast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.fullName || 'User'}! 👋
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Here's your exam performance overview
                    </p>
                </div>
                <button
                    onClick={() => navigate('/exam/start')}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span>Start New Exam</span>
                </button>
            </div>

            {/* Stats Cards */}
            {dashboardData && <DashboardCards data={dashboardData} />}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardCharts data={dashboardData} />
                <DashboardStats data={dashboardData} />
            </div>

            {/* Recent Exams */}
            <DashboardRecentExams exams={dashboardData?.recentExamHistory || []} />
        </div>
    );
};

export default Dashboard;