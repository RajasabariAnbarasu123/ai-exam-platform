import React from 'react';
import { 
    Users, 
    BookOpen, 
    TrendingUp, 
    Award,
    Activity,
    UserCheck,
    Shield,
    BarChart2
} from 'lucide-react';

const AdminStats = ({ stats }) => {
    // Support both field name variants from different endpoints
    const globalAvgScore = stats?.globalAvgScore ?? stats?.avgScore ?? 0;
    const activeUsersToday = stats?.activeUsersToday ?? 0;

    const statCards = [
        {
            label: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            label: 'Total Exams',
            value: stats?.totalExams || 0,
            icon: BookOpen,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            label: 'Active Users Today',
            value: activeUsersToday,
            icon: UserCheck,
            color: 'text-purple-500',
            bg: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            label: 'Global Avg Score',
            value: `${Number(globalAvgScore).toFixed(1)}%`,
            icon: Award,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50 dark:bg-yellow-900/20'
        },
        {
            label: 'Exams This Week',
            value: stats?.examsThisWeek || 0,
            icon: TrendingUp,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20'
        },
        {
            label: 'New Users This Week',
            value: stats?.usersThisWeek || 0,
            icon: Activity,
            color: 'text-pink-500',
            bg: 'bg-pink-50 dark:bg-pink-900/20'
        },
        {
            label: 'Admin Users',
            value: stats?.admins || 0,
            icon: Shield,
            color: 'text-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-900/20'
        },
        {
            label: 'Max Score',
            value: `${Number(stats?.maxScore || 0).toFixed(1)}%`,
            icon: BarChart2,
            color: 'text-red-500',
            bg: 'bg-red-50 dark:bg-red-900/20'
        }
    ];

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Overview
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className={`glass-card p-4 ${stat.bg}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-xl bg-white dark:bg-gray-700 ${stat.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Popular Topics */}
            {stats?.popularTopics && Object.keys(stats.popularTopics).length > 0 && (
                <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                        Popular Topics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(stats.popularTopics).slice(0, 8).map(([topic, count]) => (
                            <div key={topic} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={topic}>
                                    {topic}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {count} exam{count !== 1 ? 's' : ''}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Score Range */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 bg-green-50 dark:bg-green-900/10">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Best Score (Global)</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                        {Number(stats?.maxScore || 0).toFixed(1)}%
                    </p>
                </div>
                <div className="glass-card p-4 bg-blue-50 dark:bg-blue-900/10">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Average Score (Global)</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                        {Number(globalAvgScore).toFixed(1)}%
                    </p>
                </div>
                <div className="glass-card p-4 bg-red-50 dark:bg-red-900/10">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Lowest Score (Global)</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                        {Number(stats?.minScore || 0).toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;