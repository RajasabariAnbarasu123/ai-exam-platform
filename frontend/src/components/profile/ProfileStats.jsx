import React from 'react';
import { 
    TrendingUp, 
    Award, 
    Target, 
    Clock,
    BookOpen,
    CheckCircle,
    XCircle
} from 'lucide-react';

const ProfileStats = ({ profile }) => {
    const stats_data = profile.stats || {};
    
    const stats = [
        {
            label: 'Total Exams',
            value: profile.totalExams || stats_data.totalExams || 0,
            icon: BookOpen,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            label: 'Average Score',
            value: `${(profile.averageScore || stats_data.avgPercentage || 0).toFixed(1)}%`,
            icon: TrendingUp,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            label: 'Best Topic',
            value: profile.bestTopic || stats_data.bestTopic || 'N/A',
            icon: Award,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50 dark:bg-yellow-900/20'
        },
        {
            label: 'Weak Topic',
            value: profile.weakTopic || stats_data.weakTopic || 'N/A',
            icon: Target,
            color: 'text-red-500',
            bg: 'bg-red-50 dark:bg-red-900/20'
        }
    ];

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Performance Statistics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className={`p-4 rounded-xl ${stat.bg}`}>
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg bg-white dark:bg-gray-700 ${stat.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {stat.label}
                                    </p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Additional Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Total Questions
                        </span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {stats_data.totalQuestionsAttempted || 0}
                        </span>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Accuracy
                        </span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {(stats_data.accuracy || 0).toFixed(1)}%
                        </span>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Best Score
                        </span>
                        <span className="text-lg font-bold text-green-500">
                            {stats_data.bestScore || 0}
                        </span>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Exams This Month
                        </span>
                        <span className="text-lg font-bold text-blue-500">
                            {stats_data.examsThisMonth || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Performance Rating */}
            {profile.performanceRating && (
                <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Overall Performance
                        </span>
                        <span className={`text-sm font-bold ${
                            profile.performanceRating === 'EXCELLENT' || 
                            profile.performanceRating === 'GOOD' 
                                ? 'text-green-500' 
                                : profile.performanceRating === 'AVERAGE' 
                                ? 'text-yellow-500' 
                                : 'text-red-500'
                        }`}>
                            {profile.performanceRating}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileStats;