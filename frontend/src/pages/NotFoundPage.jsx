import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, FileQuestion } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="glass-card p-12 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <FileQuestion className="w-24 h-24 text-indigo-600 dark:text-indigo-400" />
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            404
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Page Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="space-y-3">
                    <Link
                        to="/"
                        className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                        <Home className="w-5 h-5" />
                        <span>Go to Home</span>
                    </Link>

                    <Link
                        to="/dashboard"
                        className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Dashboard</span>
                    </Link>

                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center justify-center space-x-2 w-full px-6 py-3 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all duration-200"
                    >
                        <Search className="w-5 h-5" />
                        <span>Try Again</span>
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Need help? <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact Support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;