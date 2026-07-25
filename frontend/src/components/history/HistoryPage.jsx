import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../../hooks/useHistory';
import HistoryCard from './HistoryCard';
import HistoryFilters from './HistoryFilters';
import HistorySearch from './HistorySearch';
import HistoryPagination from './HistoryPagination';
import LoadingSpinner from '../common/LoadingSpinner';
import { showToast } from '../common/ToastNotifications';
import { Calendar, Filter, Search } from 'lucide-react';

const HistoryPage = () => {
    const navigate = useNavigate();
    const { getHistory, loading } = useHistory();
    
    const [history, setHistory] = useState([]);
    const [filters, setFilters] = useState({
        topic: '',
        difficulty: '',
        questionType: '',
        status: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
    });

    useEffect(() => {
        fetchHistory();
    }, [filters, pagination.page]);

    const fetchHistory = async () => {
        try {
            const response = await getHistory({
                topic: filters.topic || undefined,
                difficulty: filters.difficulty || undefined,
                questionType: filters.questionType || undefined,
                status: filters.status || undefined,
                search: filters.search.trim() || undefined,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
                page: pagination.page,
                size: pagination.size
            });
            setHistory(response.content);
            setPagination(prev => ({
                ...prev,
                totalPages: response.totalPages,
                totalElements: response.totalElements
            }));
        } catch (error) {
            showToast.error('Failed to load exam history');
        }
    };

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page: 0 }));
    }, []);

    const handleSearch = useCallback((searchTerm) => {
        handleFilterChange({ search: searchTerm });
    }, [handleFilterChange]);

    const handlePageChange = useCallback((newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    }, []);

    const handleViewReport = (historyId) => {
        navigate(`/report/${historyId}`);
    };

    if (loading && history.length === 0) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">
                        Exam History
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and manage all your exam attempts
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {pagination.totalElements} exams
                    </span>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="glass-card p-4 mb-6 relative z-10">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <HistorySearch onSearch={handleSearch} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <HistoryFilters 
                            filters={filters} 
                            onFilterChange={handleFilterChange} 
                        />
                    </div>
                </div>
            </div>

            {/* History List */}
            {history.length === 0 ? (
                <div className="glass-card text-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                        <Calendar className="w-16 h-16 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            No Exam History
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            You haven't taken any exams yet. Start your first exam now!
                        </p>
                        <button
                            onClick={() => navigate('/exam/start')}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Start Exam
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((exam) => (
                        <HistoryCard
                            key={exam.id}
                            exam={exam}
                            onViewReport={handleViewReport}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {history.length > 0 && (
                <div className="mt-6">
                    <HistoryPagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default HistoryPage;