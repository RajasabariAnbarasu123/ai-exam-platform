import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';

const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'];

const DashboardStats = ({ data }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const chartTheme = {
        text: isDark ? '#9CA3AF' : '#6B7280',
        grid: isDark ? '#374151' : '#E5E7EB',
    };

    // Performance distribution data
    const performanceData = [
        { name: 'Excellent', value: data?.performanceDistribution?.EXCELLENT || 0 },
        { name: 'Good', value: data?.performanceDistribution?.GOOD || 0 },
        { name: 'Average', value: data?.performanceDistribution?.AVERAGE || 0 },
        { name: 'Needs Improvement', value: data?.performanceDistribution?.NEEDS_IMPROVEMENT || 0 },
    ];

    // Status distribution data
    const statusData = [
        { name: 'Completed', value: data?.statusDistribution?.COMPLETED || 0 },
        { name: 'Passed', value: data?.statusDistribution?.PASSED || 0 },
        { name: 'Failed', value: data?.statusDistribution?.FAILED || 0 },
    ];

    return (
        <div className="space-y-6">
            {/* Performance Distribution */}
            <div className="glass-card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Performance Distribution
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={performanceData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {performanceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                    borderColor: isDark ? '#374151' : '#E5E7EB',
                                    color: isDark ? '#F9FAFB' : '#111827',
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Status Distribution */}
            <div className="glass-card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Exam Status
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                            <XAxis 
                                dataKey="name" 
                                stroke={chartTheme.text}
                                tick={{ fill: chartTheme.text }}
                            />
                            <YAxis 
                                stroke={chartTheme.text}
                                tick={{ fill: chartTheme.text }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                    borderColor: isDark ? '#374151' : '#E5E7EB',
                                    color: isDark ? '#F9FAFB' : '#111827',
                                }}
                            />
                            <Bar dataKey="value" fill="#4F46E5" name="Number of Exams">
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Exams</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {data?.totalExamsTaken || 0}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Best Score</p>
                        <p className="text-2xl font-bold text-green-500">
                            {data?.bestScore || 0}%
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                        <p className="text-2xl font-bold text-blue-500">
                            {data?.averageScore?.toFixed(2) || '0.00'}%
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                        <p className="text-2xl font-bold text-purple-500">
                            {data?.accuracyPercentage?.toFixed(1) || 0}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;