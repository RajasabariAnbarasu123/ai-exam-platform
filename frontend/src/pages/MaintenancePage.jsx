import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Hammer, RefreshCw } from 'lucide-react';

const MaintenancePage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="glass-card max-w-lg w-full p-8 text-center relative z-10 border border-white/20 shadow-2xl backdrop-blur-md">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <Hammer className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
                    Under Maintenance
                </h1>
                
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-semibold mb-6">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Temporary Downtime</span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    We are currently performing scheduled maintenance to upgrade our systems and improve your experience. 
                    We should be back online shortly. Thank you for your patience!
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                    >
                        <RefreshCw className="w-5 h-5" />
                        <span>Refresh Page</span>
                    </button>
                    
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                        >
                            Are you an Admin? Sign In
                        </Link>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-6 text-xs text-gray-400 dark:text-gray-600">
                AI Exam Platform &copy; {new Date().getFullYear()}
            </div>
        </div>
    );
};

export default MaintenancePage;
