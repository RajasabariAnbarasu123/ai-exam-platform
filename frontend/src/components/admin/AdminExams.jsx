import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { showToast } from '../common/ToastNotifications';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
    Search, 
    BookOpen, 
    User,
    Calendar,
    Award,
    Trash2,
    CheckCircle,
    XCircle
} from 'lucide-react';

const AdminExams = () => {
    const { getExams, deleteExam, loading } = useAdmin();
    const [exams, setExams] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    // Debounced fetch whenever search or filter changes
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchExams();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, filter]);

    const fetchExams = useCallback(async () => {
        try {
            const data = await getExams({ search: search.trim() || undefined, filter: filter !== 'all' ? filter : undefined });
            setExams(Array.isArray(data) ? data : []);
        } catch (error) {
            showToast.error('Failed to load exams');
        }
    }, [search, filter]);

    const handleDeleteExam = async (examId) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await deleteExam(examId);
                showToast.success('Exam deleted successfully');
                fetchExams();
            } catch (error) {
                showToast.error('Failed to delete exam');
            }
        }
    };

    const getPerformanceColor = (percentage) => {
        if (percentage >= 75) return 'text-green-500';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getStatusBadge = (status) => {
        const s = (status || '').toString().toUpperCase();
        if (s === 'COMPLETED') return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
    };

    const getPassFailBadge = (passedFailed) => {
        const v = (passedFailed || '').toString().toUpperCase();
        if (v === 'PASSED') return {
            cls: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            icon: <CheckCircle className="w-3 h-3 mr-1" />,
            label: 'Passed'
        };
        return {
            cls: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
            icon: <XCircle className="w-3 h-3 mr-1" />,
            label: 'Failed'
        };
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Exam Management
            </h3>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-input pl-10"
                        placeholder="Search by topic or user..."
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="form-input sm:w-52"
                >
                    <option value="all">All Exams</option>
                    <option value="passed">Passed (≥ 50%)</option>
                    <option value="failed">Failed (&lt; 50%)</option>
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="last_7_days">Last 7 Days</option>
                    <option value="new_user_7_days">By New Users (7 Days)</option>
                </select>
            </div>

            {/* Exams List */}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="space-y-4">
                    {exams.map((exam) => {
                        const pf = getPassFailBadge(exam.passedFailed);
                        return (
                            <div key={exam.id} className="glass-card p-4">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center flex-wrap gap-2">
                                            <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {exam.topic}
                                            </h4>
                                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-full">
                                                {exam.difficulty}
                                            </span>
                                            <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full">
                                                {exam.questionType}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center space-x-1">
                                                <User className="w-3 h-3" />
                                                <span>{exam.userEmail || exam.userId || 'Unknown User'}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(exam.createdAt).toLocaleDateString()}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <Award className="w-3 h-3" />
                                                <span className={getPerformanceColor(exam.percentage)}>
                                                    {exam.percentage?.toFixed(1) || 0}% &nbsp;
                                                    <span className="text-gray-400 dark:text-gray-500 text-xs">
                                                        ({exam.score ?? 0}/100)
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {/* Pass/Fail badge */}
                                        <span className={`flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${pf.cls}`}>
                                            {pf.icon}
                                            {pf.label}
                                        </span>
                                        {/* Status badge */}
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(exam.status)}`}>
                                            {exam.status || 'COMPLETED'}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteExam(exam.id)}
                                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && exams.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No exams found</p>
                </div>
            )}
        </div>
    );
};

export default AdminExams;