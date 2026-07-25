import React from 'react';
import { X, Send, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const ExamSubmit = ({ 
    onClose, 
    onSubmit, 
    answeredCount, 
    totalQuestions,
    isSubmitting 
}) => {
    const unanswered = totalQuestions - answeredCount;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass-card max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        {unanswered > 0 ? (
                            <AlertTriangle className="w-16 h-16 text-yellow-500" />
                        ) : (
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Submit Exam?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        You've answered {answeredCount} out of {totalQuestions} questions
                    </p>
                </div>

                {unanswered > 0 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl mb-6">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            ⚠️ You have {unanswered} unanswered question{unanswered > 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                            Unanswered questions will be marked as skipped
                        </p>
                    </div>
                )}

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span>Submit</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamSubmit;