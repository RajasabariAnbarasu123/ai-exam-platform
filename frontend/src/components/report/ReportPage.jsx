import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResults } from '../../hooks/useResults';
import ReportSummary from './ReportSummary';
import ReportAnalytics from './ReportAnalytics';
import ReportExport from './ReportExport';
import LoadingSpinner from '../common/LoadingSpinner';
import { showToast } from '../common/ToastNotifications';
import { ArrowLeft, FileText, Download, TrendingUp, Award } from 'lucide-react';

const ReportPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getResult, loading } = useResults();
    const [report, setReport] = useState(null);
    const [activeTab, setActiveTab] = useState('summary');

    useEffect(() => {
        if (!id) {
            showToast.error('No report found');
            navigate('/history');
            return;
        }
        fetchReport();
    }, [id]);

    const fetchReport = async () => {
        try {
            const data = await getResult(id);
            setReport(data);
        } catch (error) {
            showToast.error('Failed to load report');
            navigate('/history');
        }
    };

    const tabs = [
        { id: 'summary', label: 'Summary', icon: FileText },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'export', label: 'Export', icon: Download },
    ];

    if (loading || !report) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/history')}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">
                            Exam Report
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {report.topic} - {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Award className={`w-6 h-6 ${
                        report.percentage >= 75 ? 'text-green-500' :
                        report.percentage >= 50 ? 'text-yellow-500' :
                        'text-red-500'
                    }`} />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {report.percentage.toFixed(1)}%
                    </span>
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
                {activeTab === 'summary' && <ReportSummary report={report} />}
                {activeTab === 'analytics' && <ReportAnalytics report={report} />}
                {activeTab === 'export' && <ReportExport report={report} />}
            </div>
        </div>
    );
};

export default ReportPage;