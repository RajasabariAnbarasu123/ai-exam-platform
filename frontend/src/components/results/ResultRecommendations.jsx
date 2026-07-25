import React from 'react';
import { 
    BookOpen, 
    Clock, 
    Target, 
    Award,
    Calendar,
    TrendingUp,
    Lightbulb,
    Sparkles
} from 'lucide-react';

const ResultRecommendations = ({ result }) => {
    const recommendations = {
        studyPlan: {
            hoursPerWeek: result.percentage >= 75 ? 2 : result.percentage >= 50 ? 3 : 4,
            dailyHours: result.percentage >= 75 ? 0.5 : result.percentage >= 50 ? 1 : 1.5,
            focusAreas: result.percentage >= 75 ? ['Advanced topics', 'Practice problems'] :
                         result.percentage >= 50 ? ['Core concepts', 'Practice questions'] :
                         ['Fundamentals', 'Basic concepts']
        },
        resources: [
            'Official documentation',
            'Practice exercises',
            'Video tutorials',
            'Sample questions',
            'Discussion forums'
        ],
        schedule: [
            { day: 'Monday', activity: 'Review concepts', duration: '1 hour' },
            { day: 'Tuesday', activity: 'Practice questions', duration: '1 hour' },
            { day: 'Wednesday', activity: 'Video tutorials', duration: '45 min' },
            { day: 'Thursday', activity: 'Practice test', duration: '1.5 hours' },
            { day: 'Friday', activity: 'Review mistakes', duration: '1 hour' },
            { day: 'Saturday', activity: 'Mock exam', duration: '2 hours' },
            { day: 'Sunday', activity: 'Rest and revision', duration: '30 min' },
        ]
    };

    return (
        <div className="space-y-6">
            {/* Study Plan */}
            <div className="glass-card p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Personalized Study Plan
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-center">
                        <Clock className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {recommendations.studyPlan.hoursPerWeek}h
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Per Week</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                        <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {recommendations.studyPlan.dailyHours}h
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Per Day</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                        <BookOpen className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Focus Areas
                        </p>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {recommendations.studyPlan.focusAreas.map((area, index) => (
                                <li key={index}>{area}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Weekly Schedule */}
            <div className="glass-card p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Weekly Schedule
                    </h3>
                </div>
                
                <div className="space-y-2">
                    {recommendations.schedule.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[100px]">
                                    {item.day}
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                    {item.activity}
                                </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {item.duration}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Resources */}
            <div className="glass-card p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Mentioned Resources
                    </h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {recommendations.resources.map((resource, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                            <p className="text-sm text-gray-900 dark:text-white">{resource}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className="glass-card p-6 border-l-4 border-yellow-500">
                <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            Study Tips
                        </h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <li>• Focus on understanding concepts before memorizing</li>
                            <li>• Practice regularly with time constraints</li>
                            <li>• Review mistakes and understand why they happened</li>
                            <li>• Take breaks during study sessions for better retention</li>
                            <li>• Use active recall techniques for better learning</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultRecommendations;