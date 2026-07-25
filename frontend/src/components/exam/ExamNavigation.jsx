import React from 'react';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

const ExamNavigation = ({ 
    current, 
    total, 
    onPrevious, 
    onNext, 
    onSubmit,
    isLast 
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <button
                onClick={onPrevious}
                disabled={current === 0}
                className={`flex items-center space-x-2 px-6 py-2 rounded-xl transition-all duration-200 ${
                    current === 0
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {current + 1} / {total}
                </span>
            </div>

            {isLast ? (
                <button
                    onClick={onSubmit}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                >
                    <span>Submit Exam</span>
                    <Send className="w-5 h-5" />
                </button>
            ) : (
                <button
                    onClick={onNext}
                    className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200"
                >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default ExamNavigation;