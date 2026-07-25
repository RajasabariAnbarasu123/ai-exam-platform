import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { useAdmin } from '../../hooks/useAdmin';
import LoadingSpinner from '../common/LoadingSpinner';
import { showToast } from '../common/ToastNotifications';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';

const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

const AdminAnalytics = () => {
    const { theme } = useTheme();
    const { getAnalytics, loading } = useAdmin();
    const isDark = theme === 'dark';
    
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const data = await getAnalytics();
            setAnalytics(data);
        } catch (error) {
            showToast.error('Failed to load analytics');
        }
    };

    const chartTheme = {
        text: isDark ? '#9CA3AF' : '#6B7280',
        grid: isDark ? '#374151' : '#E5E7EB',
    };

    const tooltipStyle = {
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        borderColor: isDark ? '#374151' : '#E5E7EB',
        color: isDark ? '#F9FAFB' : '#111827',
    };

    if (loading || !analytics) {
        return <LoadingSpinner />;
    }

    // Format date labels nicely
    const formatDate = (dateStr) => {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    // Prepare user growth chart data
    const userGrowthData = (analytics.userGrowth || []).map(item => ({
        date: formatDate(item.date),
        users: item.count || 0
    }));

    // Prepare exam trends chart data
    const examTrendData = (analytics.examTrends || []).map(item => ({
        date: formatDate(item.date),
        exams: item.count || 0
    }));

    // Topic distribution
    const topicDistribution = analytics.popularTopics
        ? Object.entries(analytics.popularTopics)
            .filter(([, v]) => v > 0)
            .map(([name, value]) => ({ name, value }))
        : [];

    // Difficulty distribution
    const difficultyDistribution = analytics.difficultyDistribution
        ? Object.entries(analytics.difficultyDistribution)
            .filter(([, v]) => v > 0)
            .map(([name, value]) => ({ name, value }))
        : [];

    const summaryCards = [
        {
            label: 'Total Users',
            value: analytics.totalUsers || 0,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            label: 'Active (7 Days)',
            value: analytics.activeUsersLast7Days || 0,
            icon: TrendingUp,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            label: 'Total Exams',
            value: analytics.totalExams || 0,
            icon: BookOpen,
            color: 'text-purple-500',
            bg: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            label: 'Avg Score',
            value: `${Number(analytics.averageScore || 0).toFixed(1)}%`,
            icon: Award,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50 dark:bg-yellow-900/20'
        }
    ];

    const EmptyChart = ({ message }) => (
        <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm">{message}</p>
        </div>
    );

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Analytics Dashboard
            </h3>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {summaryCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className={`glass-card p-4 ${card.bg}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                                </div>
                                <div className={`p-2 rounded-xl bg-white dark:bg-gray-700 ${card.color}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Score Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Highest Score</p>
                    <p className="text-3xl font-bold text-green-500 mt-1">{Number(analytics.highestScore || 0).toFixed(1)}%</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
                    <p className="text-3xl font-bold text-blue-500 mt-1">{Number(analytics.averageScore || 0).toFixed(1)}%</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Lowest Score</p>
                    <p className="text-3xl font-bold text-red-500 mt-1">{Number(analytics.lowestScore || 0).toFixed(1)}%</p>
                </div>
            </div>

            {/* User Growth */}
            <div className="glass-card p-6 mb-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                    New Users (Last 7 Days)
                </h4>
                {userGrowthData.length === 0 ? (
                    <EmptyChart message="No new user signups in the last 7 days" />
                ) : (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                                <XAxis dataKey="date" stroke={chartTheme.text} tick={{ fill: chartTheme.text }} />
                                <YAxis stroke={chartTheme.text} tick={{ fill: chartTheme.text }} allowDecimals={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#4F46E5"
                                    strokeWidth={2}
                                    dot={{ fill: '#4F46E5' }}
                                    name="New Users"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Exam Trends */}
            <div className="glass-card p-6 mb-6">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                    Exams Taken (Last 7 Days)
                </h4>
                {examTrendData.length === 0 ? (
                    <EmptyChart message="No exams taken in the last 7 days" />
                ) : (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={examTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                                <XAxis dataKey="date" stroke={chartTheme.text} tick={{ fill: chartTheme.text }} />
                                <YAxis stroke={chartTheme.text} tick={{ fill: chartTheme.text }} allowDecimals={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend />
                                <Bar dataKey="exams" fill="#7C3AED" name="Exams Taken" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Topic and Difficulty Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                        Popular Topics
                    </h4>
                    {topicDistribution.length === 0 ? (
                        <EmptyChart message="No topic data available" />
                    ) : (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={topicDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                                        outerRadius={80}
                                        dataKey="value"
                                    >
                                        {topicDistribution.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="glass-card p-6">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                        Difficulty Distribution
                    </h4>
                    {difficultyDistribution.length === 0 ? (
                        <EmptyChart message="No difficulty data available" />
                    ) : (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={difficultyDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                                    <XAxis dataKey="name" stroke={chartTheme.text} tick={{ fill: chartTheme.text }} />
                                    <YAxis stroke={chartTheme.text} tick={{ fill: chartTheme.text }} allowDecimals={false} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Bar dataKey="value" name="Exams">
                                        {difficultyDistribution.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;