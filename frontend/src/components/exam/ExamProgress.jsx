import React from 'react';
import { CheckCircle } from 'lucide-react';

const ExamProgress = ({ current, total, answered, answers = {}, questions = [], onQuestionClick }) => {
    const progress = (current / total) * 100;

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                    Question {current} of {total}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                    Answered: {answered}/{total}
                </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
                {Array.from({ length: total }, (_, i) => {
                    const questionId = questions[i]?.questionId;
                    const isAnswered = questionId && answers[questionId] !== undefined;
                    const isCurrent = i + 1 === current;

                    return (
                        <button
                            key={i}
                            onClick={() => onQuestionClick && onQuestionClick(i)}
                            title={`Go to Question ${i + 1}`}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                                isCurrent
                                    ? 'border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm scale-110'
                                    : isAnswered
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {isAnswered && !isCurrent ? (
                                <CheckCircle className="w-4 h-4" />
                            ) : (
                                i + 1
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ExamProgress;