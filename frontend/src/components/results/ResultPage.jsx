import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResults } from '../../hooks/useResults';
import ResultSummary from './ResultSummary';
import ResultDetails from './ResultDetails';
import ResultChart from './ResultChart';
import ResultFeedback from './ResultFeedback';
import ResultRecommendations from './ResultRecommendations';
import ResultExport from './ResultExport';
import LoadingSpinner from '../common/LoadingSpinner';
import { showToast } from '../common/ToastNotifications';
import { ArrowLeft, Award, TrendingUp, CheckCircle, BarChart2, Brain, BookOpen } from 'lucide-react';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { resultId, resultData: initialResultData } = location.state || {};
    const { getResult, loading } = useResults();
    
    const [result, setResult] = useState(initialResultData || null);
    const [activeTab, setActiveTab] = useState('summary');

    useEffect(() => {
        if (!resultId) {
            showToast.error('No result found');
            navigate('/dashboard');
            return;
        }
        // Always fetch from server to get complete data (analytics, accuracy, etc.)
        fetchResult();
    }, [resultId]);

    const fetchResult = async () => {
        try {
            const data = await getResult(resultId);
            // Merge server data with initial data, preferring server data but keeping detailedResults from initial
            setResult(prev => ({
                ...data,
                // Keep detailedResults from the submit response if server doesn't return them
                detailedResults: data.detailedResults?.length > 0 
                    ? data.detailedResults 
                    : (prev?.detailedResults || []),
                // Keep aiFeedback from submit response if server returns it
                aiFeedback: data.aiFeedback || prev?.aiFeedback,
            }));
        } catch (error) {
            // If server fetch fails, use initial data if available
            if (!result) {
                showToast.error('Failed to load result');
                navigate('/dashboard');
            }
        }
    };

    if ((loading && !result) || !result) {
        return <LoadingSpinner fullScreen />;
    }

    const tabs = [
        { id: 'summary', label: 'Summary', icon: Award },
        { id: 'details', label: 'Details', icon: CheckCircle },
        { id: 'charts', label: 'Analytics', icon: BarChart2 },
        { id: 'feedback', label: 'AI Feedback', icon: Brain },
        { id: 'recommendations', label: 'Recommendations', icon: BookOpen },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'summary':
                return <ResultSummary result={result} />;
            case 'details':
                return <ResultDetails result={result} />;
            case 'charts':
                return <ResultChart result={result} />;
            case 'feedback':
                return <ResultFeedback result={result} />;
            case 'recommendations':
                return <ResultRecommendations result={result} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Dashboard</span>
                </button>
                <ResultExport resultId={resultId} result={result} />
            </div>

            {/* Score Card */}
            <div className="glass-card p-6 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                            {result.score}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Percentage</p>
                        <p className={`text-3xl font-bold ${
                            result.percentage >= 75 ? 'text-green-500' :
                            result.percentage >= 50 ? 'text-yellow-500' :
                            'text-red-500'
                        }`}>
                            {(result.percentage || 0).toFixed(1)}%
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Performance</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {result.performanceRating}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Time Taken</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {Math.floor((result.timeTaken || 0) / 60)}m {(result.timeTaken || 0) % 60}s
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="animate-fade-in">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ResultPage;
