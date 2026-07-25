import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const HistorySearch = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isTyping) {
                onSearch(query);
                setIsTyping(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, isTyping, onSearch]);

    const handleChange = (e) => {
        setQuery(e.target.value);
        setIsTyping(true);
    };

    const clearSearch = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                className="form-input pl-10 pr-10"
                placeholder="Search by topic, difficulty, or question type..."
            />
            {query && (
                <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
            )}
        </div>
    );
};

export default HistorySearch;