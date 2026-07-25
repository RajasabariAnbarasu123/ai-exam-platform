import React from 'react';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    Award,
    TrendingUp,
    TrendingDown,
    Zap
} from 'lucide-react';

const ResultSummary = ({ result }) => {
    // Compute accuracy from actual data (backend may return 0)
    const computedAccuracy = (() => {
        const answered = (result.correctAnswers || 0) + (result.wrongAnswers || 0);
        if (answered === 0) return 0;
        return Math.round(((result.correctAnswers || 0) / answered) * 100);
    })();
    const stats = [
        {
            label: 'Correct Answers',
            value: result.correctAnswers,
            icon: CheckCircle,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            label: 'Wrong Answers',
            value: result.wrongAnswers,
            icon: XCircle,
            color: 'text-red-500',
            bg: 'bg-red-50 dark:bg-red-900/20'
        },
        {
            label: 'Skipped',
            value: result.skippedAnswers,
            icon: Clock,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50 dark:bg-yellow-900/20'
        },
        {
            label: 'Accuracy',
            value: `${computedAccuracy}%`,
            icon: Award,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20'
        }
    ];

    const getPerformanceMessage = () => {
        if (result.percentage >= 90) {
            return {
                icon: <Award className="w-8 h-8 text-yellow-500" />,
                title: 'Excellent Performance!',
                description: 'Outstanding work! You have demonstrated excellent understanding of the subject.',
                color: 'text-green-500'
            };
        } else if (result.percentage >= 75) {
            return {
                icon: <TrendingUp className="w-8 h-8 text-green-500" />,
                title: 'Good Performance!',
                description: 'Well done! You have a solid grasp of the concepts. Keep practicing to improve further.',
                color: 'text-green-500'
            };
        } else if (result.percentage >= 60) {
            return {
                icon: <Zap className="w-8 h-8 text-yellow-500" />,
                title: 'Average Performance',
                description: 'You have a basic understanding. Review the topics where you made mistakes.',
                color: 'text-yellow-500'
            };
        } else {
            return {
                icon: <TrendingDown className="w-8 h-8 text-red-500" />,
                title: 'Needs Improvement',
                description: 'Don\'t get discouraged! Review the material and practice more. You can do better!',
                color: 'text-red-500'
            };
        }
    };

    const performance = getPerformanceMessage();

    return (
        <div className="space-y-6">
            {/* Performance Message */}
            <div className={`glass-card p-6 border-l-4 ${
                result.percentage >= 75 ? 'border-green-500' :
                result.percentage >= 60 ? 'border-yellow-500' :
                'border-red-500'
            }`}>
                <div className="flex items-start space-x-4">
                    {performance.icon}
                    <div>
                        <h3 className={`text-xl font-bold ${performance.color}`}>
                            {performance.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {performance.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className={`glass-card text-center p-4 ${stat.bg}`}>
                            <div className={`flex items-center justify-center mb-2`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <p className={`text-2xl font-bold ${stat.color}`}>
                                {stat.value}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-4">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Exam Details
                    </h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Topic</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {result.topic}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Difficulty</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {result.difficulty}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Question Type</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {result.questionType}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Total Questions</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {result.totalQuestions}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Time Analysis
                    </h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Total Time</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Avg per Question</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {Math.round(result.timeTaken / result.totalQuestions)}s
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                            <span className={`text-sm font-medium ${
                                result.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'
                            }`}>
                                {result.status || 'COMPLETED'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultSummary;