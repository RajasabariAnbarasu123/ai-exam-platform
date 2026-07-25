import React, { useState, useEffect } from 'react';
import { 
    Lightbulb, 
    TrendingUp, 
    TrendingDown, 
    Award,
    Sparkles,
    ThumbsUp,
    ThumbsDown,
    RefreshCw
} from 'lucide-react';
import { useResults } from '../../hooks/useResults';
import { showToast } from '../common/ToastNotifications';

const ResultFeedback = ({ result }) => {
    const { getAIFeedback, loading } = useResults();
    const [feedbackData, setFeedbackData] = useState(null);
    const [fetchAttempted, setFetchAttempted] = useState(false);

    // Parse aiFeedback from result - it may be a string or object
    const parseInlineFeedback = (raw) => {
        if (!raw) return null;
        if (typeof raw === 'object') return raw;
        try {
            const parsed = JSON.parse(raw);
            return parsed;
        } catch {
            // It's a plain text feedback string
            return { overallFeedback: raw };
        }
    };

    const inlineFeedback = parseInlineFeedback(result?.aiFeedback);

    useEffect(() => {
        // If we have inline feedback, no need to fetch
        if (inlineFeedback?.overallFeedback && inlineFeedback.overallFeedback.length > 10) {
            setFeedbackData(inlineFeedback);
        } else if (result?.resultId && !fetchAttempted) {
            fetchFeedback();
        }
    }, [result?.resultId]);

    const fetchFeedback = async () => {
        setFetchAttempted(true);
        try {
            const data = await getAIFeedback(result.resultId);
            setFeedbackData(data);
        } catch (error) {
            // Use inline feedback as fallback
            if (inlineFeedback) {
                setFeedbackData(inlineFeedback);
            } else {
                showToast.error('Could not load AI feedback');
            }
        }
    };

    const displayFeedback = feedbackData || inlineFeedback;

    if (loading && !displayFeedback) {
        return (
            <div className="glass-card p-8 text-center">
                <Sparkles className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600 dark:text-gray-400">
                    Loading AI feedback...
                </p>
            </div>
        );
    }

    if (!displayFeedback) {
        return (
            <div className="glass-card p-8 text-center">
                <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    AI feedback is not available yet.
                </p>
                <button
                    onClick={fetchFeedback}
                    disabled={loading}
                    className="flex items-center space-x-2 mx-auto px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Generate Feedback</span>
                </button>
            </div>
        );
    }

    const strengths = displayFeedback.strengths || [];
    const weaknesses = displayFeedback.weaknesses || [];
    const topicAnalysis = displayFeedback.topicAnalysis;
    const improvementTip = displayFeedback.improvementTip;
    const wrongAnswerExplanations = displayFeedback.wrongAnswerExplanations || [];
    const overallFeedback = displayFeedback.overallFeedback || '';

    return (
        <div className="space-y-6">
            {/* Overall Feedback */}
            <div className="glass-card p-6">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            AI Feedback
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed whitespace-pre-line">
                            {overallFeedback || 'Your exam has been analyzed. See the breakdown below.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Strengths and Weaknesses */}
            {(strengths.length > 0 || weaknesses.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {strengths.length > 0 && (
                        <div className="glass-card p-6 border-l-4 border-green-500">
                            <div className="flex items-center space-x-2 mb-3">
                                <ThumbsUp className="w-5 h-5 text-green-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-white">Strengths</h4>
                            </div>
                            <ul className="space-y-2">
                                {strengths.map((strength, index) => (
                                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span>{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {weaknesses.length > 0 && (
                        <div className="glass-card p-6 border-l-4 border-red-500">
                            <div className="flex items-center space-x-2 mb-3">
                                <ThumbsDown className="w-5 h-5 text-red-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-white">Areas for Improvement</h4>
                            </div>
                            <ul className="space-y-2">
                                {weaknesses.map((weakness, index) => (
                                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="text-red-500 mt-0.5">•</span>
                                        <span>{weakness}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Topic Analysis */}
            {topicAnalysis && typeof topicAnalysis === 'object' && Object.keys(topicAnalysis).length > 0 && (
                <div className="glass-card p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">Topic Analysis</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(topicAnalysis).map(([key, value]) => (
                            <div key={key} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {key.replace(/_/g, ' ')}
                                </p>
                                <p className="text-sm text-gray-900 dark:text-white mt-1">{String(value)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Improvement Tip */}
            {improvementTip && (
                <div className="glass-card p-6 border-l-4 border-blue-500">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Improvement Tip</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {improvementTip}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Wrong Answer Explanations */}
            {wrongAnswerExplanations.length > 0 && (
                <div className="glass-card p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Review Incorrect Answers
                    </h4>
                    <div className="space-y-3">
                        {wrongAnswerExplanations.map((item, index) => (
                            <div key={index} className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.question}
                                </p>
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                    <strong>Your Answer:</strong> {item.userAnswer || 'Not answered'}
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    <strong>Correct Answer:</strong> {item.correctAnswer}
                                </p>
                                {item.explanation && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {item.explanation}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Refresh button */}
            <div className="text-center">
                <button
                    onClick={fetchFeedback}
                    disabled={loading}
                    className="flex items-center space-x-2 mx-auto px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh Feedback</span>
                </button>
            </div>
        </div>
    );
};

export default ResultFeedback;

