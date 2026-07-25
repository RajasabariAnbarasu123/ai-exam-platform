import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const HistoryPagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 0; i < totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            const half = Math.floor(maxVisible / 2);
            let start = Math.max(0, currentPage - half);
            let end = Math.min(totalPages - 1, currentPage + half);
            
            if (start === 0) {
                end = Math.min(maxVisible - 1, totalPages - 1);
            }
            if (end === totalPages - 1) {
                start = Math.max(0, totalPages - maxVisible);
            }
            
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }
        }
        
        return pageNumbers;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center space-x-2">
            <button
                onClick={() => onPageChange(0)}
                disabled={currentPage === 0}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-1">
                {getPageNumbers().map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                            pageNum === currentPage
                                ? 'bg-indigo-600 text-white'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                    >
                        {pageNum + 1}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
            <button
                onClick={() => onPageChange(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronsRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default HistoryPagination;