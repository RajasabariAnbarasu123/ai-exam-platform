import React from 'react';
import { 
    Calendar, 
    Clock, 
    Award, 
    TrendingUp, 
    TrendingDown,
    ChevronRight,
    CheckCircle,
    XCircle,
    Eye,
    HelpCircle
} from 'lucide-react';

const HistoryCard = ({ exam, onViewReport }) => {
    const getPerformanceColor = (percentage) => {
        if (percentage >= 75) return 'text-green-500';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getPerformanceBadge = (percentage) => {
        if (percentage >= 75) {
            return { label: 'Excellent', color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' };
        }
        if (percentage >= 60) {
            return { label: 'Good', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' };
        }
        if (percentage >= 50) {
            return { label: 'Average', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' };
        }
        return { label: 'Needs Improvement', color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' };
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


    const badge = getPerformanceBadge(exam.percentage);

    return (
        <div className="glass-card hover:scale-[1.02] transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Left Section */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {exam.topic}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                            {badge.label}
                        </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(exam.createdAt)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{Math.floor(exam.timeTaken / 60)}m {exam.timeTaken % 60}s</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <Award className="w-4 h-4" />
                            <span>{exam.score} points</span>
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                            {exam.difficulty}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                            {exam.questionType}
                        </span>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <div className="flex items-center space-x-4">
                        <div className="text-center">
                            <p className={`text-2xl font-bold ${getPerformanceColor(exam.percentage)}`}>
                                {exam.percentage.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
                        </div>
                        <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {exam.correctAnswers}
                            </span>
                            <XCircle className="w-4 h-4 text-red-500 ml-2" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {exam.wrongAnswers}
                            </span>
                            <HelpCircle className="w-4 h-4 text-gray-400 ml-2" />
                            <span className="text-sm text-gray-600 dark:text-gray-400" title="Skipped">
                                {exam.skippedAnswers ?? 0}
                            </span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => onViewReport(exam.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">View Report</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HistoryCard;