import React from 'react';
import { 
    BookOpen, 
    Trophy, 
    Target, 
    CheckCircle,
    TrendingUp,
    Clock,
    Award
} from 'lucide-react';

const DashboardCards = ({ data }) => {
    const cards = [
        {
            title: 'Total Exams',
            value: data?.totalExamsTaken || 0,
            icon: BookOpen,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            title: 'Average Score',
            value: `${data?.averageScore?.toFixed(2) || '0.00'}%`,
            icon: Trophy,
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        },
        {
            title: 'Best Score',
            value: `${data?.bestScore || 0}%`,
            icon: Award,
            color: 'bg-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            title: 'Questions Attempted',
            value: data?.totalQuestionsAttempted || 0,
            icon: Target,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        },
        {
            title: 'Accuracy',
            value: `${data?.accuracyPercentage?.toFixed(2) || '0.00'}%`,
            icon: CheckCircle,
            color: 'bg-indigo-500',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
        },
        {
            title: 'Exams This Week',
            value: data?.examsThisWeek || 0,
            icon: TrendingUp,
            color: 'bg-pink-500',
            bgColor: 'bg-pink-50 dark:bg-pink-900/20',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className="glass-card hover:scale-105 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {card.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {card.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl ${card.bgColor}`}>
                                <Icon className={`w-5 h-5 ${card.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DashboardCards;