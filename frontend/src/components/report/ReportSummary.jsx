import React from 'react';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    Award,
    TrendingUp,
    TrendingDown,
    Zap,
    Target
} from 'lucide-react';

const ReportSummary = ({ report }) => {
    const computedAccuracy = (() => {
        const answered = (report.correctAnswers || 0) + (report.wrongAnswers || 0);
        if (answered === 0) return 0;
        return Math.round(((report.correctAnswers || 0) / answered) * 100);
    })();

    const stats = [
        {
            label: 'Correct Answers',
            value: report.correctAnswers,
            icon: CheckCircle,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            label: 'Wrong Answers',
            value: report.wrongAnswers,
            icon: XCircle,
            color: 'text-red-500',
            bg: 'bg-red-50 dark:bg-red-900/20'
        },
        {
            label: 'Skipped',
            value: report.skippedAnswers,
            icon: Clock,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50 dark:bg-yellow-900/20'
        },
        {
            label: 'Accuracy',
            value: `${computedAccuracy}%`,
            icon: Target,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20'
        }
    ];

    const performance = {
        icon: report.percentage >= 75 ? <Award className="w-8 h-8 text-yellow-500" /> :
              report.percentage >= 50 ? <TrendingUp className="w-8 h-8 text-green-500" /> :
              report.percentage >= 30 ? <Zap className="w-8 h-8 text-orange-500" /> :
              <TrendingDown className="w-8 h-8 text-red-500" />,
        title: report.percentage >= 75 ? 'Excellent Performance!' :
               report.percentage >= 50 ? 'Good Performance!' :
               report.percentage >= 30 ? 'Average Performance' :
               'Needs Improvement',
        description: report.percentage >= 75 ? 'Outstanding work! You have excellent understanding of the subject.' :
                    report.percentage >= 50 ? 'Well done! Keep practicing to improve further.' :
                    report.percentage >= 30 ? 'Review the topics where you made mistakes.' :
                    'Don\'t get discouraged! Review the material and practice more.'
    };

    return (
        <div className="space-y-6">
            {/* Performance Message */}
            <div className={`glass-card p-6 border-l-4 ${
                report.percentage >= 75 ? 'border-green-500' :
                report.percentage >= 50 ? 'border-yellow-500' :
                'border-red-500'
            }`}>
                <div className="flex items-start space-x-4">
                    {performance.icon}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
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

            {/* Exam Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-4">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Exam Details
                    </h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Topic</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {report.topic}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Difficulty</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {report.difficulty}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Question Type</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {report.questionType}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Total Questions</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {report.totalQuestions}
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
                                {Math.floor(report.timeTaken / 60)}m {report.timeTaken % 60}s
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Avg per Question</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {Math.round(report.timeTaken / report.totalQuestions)}s
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Score</span>
                            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                {report.score} / 100
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                            <span className={`text-sm font-medium ${
                                report.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'
                            }`}>
                                {report.status || 'COMPLETED'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Feedback */}
            {report.aiFeedback && (
                <div className="glass-card p-6">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        AI Feedback
                    </h4>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {report.aiFeedback}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportSummary;