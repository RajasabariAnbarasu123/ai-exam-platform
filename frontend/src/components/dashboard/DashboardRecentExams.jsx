import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Calendar, 
    Clock, 
    ChevronRight, 
    Award, 
    TrendingUp, 
    TrendingDown,
    Eye
} from 'lucide-react';

const DashboardRecentExams = ({ exams }) => {
    const navigate = useNavigate();

    const getPerformanceColor = (percentage) => {
        if (percentage >= 75) return 'text-green-500';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getPerformanceIcon = (percentage) => {
        if (percentage >= 75) return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (percentage >= 50) return <TrendingUp className="w-4 h-4 text-yellow-500" />;
        return <TrendingDown className="w-4 h-4 text-red-500" />;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();

        // Compare at calendar-day level (strip time component)
        const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const nowDay  = new Date(now.getFullYear(),  now.getMonth(),  now.getDate());
        const diffDays = Math.round((nowDay - dateDay) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7)  return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };


    if (!exams || exams.length === 0) {
        return (
            <div className="glass-card text-center py-12">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        No Exams Taken Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Start your first exam to track your performance
                    </p>
                    <button
                        onClick={() => navigate('/exam/start')}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Start Exam
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Exams
                </h3>
                <button
                    onClick={() => navigate('/history')}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                >
                    <span>View All</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
 
            <div className="space-y-4">
                {exams.slice(0, 5).map((exam, index) => (
                    <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        onClick={() => navigate(`/report/${exam.id}`)}
                    >
                        <div className="flex items-start sm:items-center space-x-4">
                            <div className="flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    exam.percentage >= 75 ? 'bg-green-100 dark:bg-green-900/20' :
                                    exam.percentage >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                                    'bg-red-100 dark:bg-red-900/20'
                                }`}>
                                    {getPerformanceIcon(exam.percentage)}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                    {exam.topic}
                                </h4>
                                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center space-x-1">
                                        <Award className="w-4 h-4" />
                                        <span>{exam.score}%</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDate(exam.date)}</span>
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        exam.performanceRating === 'EXCELLENT' || exam.performanceRating === 'GOOD'
                                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                            : exam.performanceRating === 'AVERAGE'
                                            ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                                            : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                    }`}>
                                        {exam.performanceRating || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
                            <div className={`text-lg font-semibold ${getPerformanceColor(exam.percentage)}`}>
                                {exam.percentage.toFixed(1)}%
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/report/${exam.id}`);
                                }}
                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardRecentExams;