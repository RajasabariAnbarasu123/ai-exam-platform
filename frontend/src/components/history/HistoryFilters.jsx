import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';

const HistoryFilters = ({ filters, onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const difficulties = ['EASY', 'MEDIUM', 'HARD'];
    const questionTypes = ['MCQ', 'TRUE_FALSE', 'FILL_IN_THE_BLANK', 'SHORT_ANSWER', 'CODING'];
    const statuses = ['PASSED', 'FAILED', 'COMPLETED', 'IN_PROGRESS', 'CANCELLED'];

    const handleFilterChange = (key, value) => {
        onFilterChange({ [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({
            topic: '',
            difficulty: '',
            questionType: '',
            status: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    const hasActiveFilters = filters.topic || filters.difficulty || filters.questionType || filters.status;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isOpen || hasActiveFilters
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-card p-4 z-50 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Filters</h4>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={clearFilters}
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                                aria-label="Close filters"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Difficulty Filter */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Difficulty
                        </label>
                        <select
                            value={filters.difficulty}
                            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                            className="form-input text-sm"
                        >
                            <option value="">All</option>
                            {difficulties.map(diff => (
                                <option key={diff} value={diff}>{diff}</option>
                            ))}
                        </select>
                    </div>

                    {/* Question Type Filter */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Question Type
                        </label>
                        <select
                            value={filters.questionType}
                            onChange={(e) => handleFilterChange('questionType', e.target.value)}
                            className="form-input text-sm"
                        >
                            <option value="">All</option>
                            {questionTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="form-input text-sm"
                        >
                            <option value="">All</option>
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Options */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sort By
                            </label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="form-input text-sm"
                            >
                                <option value="createdAt">Date</option>
                                <option value="percentage">Score</option>
                                <option value="topic">Topic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Order
                            </label>
                            <select
                                value={filters.sortOrder}
                                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                                className="form-input text-sm"
                            >
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryFilters;