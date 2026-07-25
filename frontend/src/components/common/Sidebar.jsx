import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FileText, 
    History, 
    User, 
    Settings, 
    GraduationCap,
    BarChart3,
    Users,
    BookOpen,
    Award,
    Clock,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const userLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/exam/start', label: 'Start Exam', icon: FileText },
        { path: '/history', label: 'History', icon: History },
        { path: '/profile', label: 'Profile', icon: User },
        { path: '/results', label: 'Results', icon: Award },
    ];

    const adminLinks = [
        { path: '/admin/dashboard', label: 'Admin Dashboard', icon: Users },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/exams', label: 'Exams', icon: BookOpen },
        { path: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
        { path: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    const links = isAdmin ? [...userLinks, ...adminLinks] : userLinks;

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 md:static md:z-auto`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                        <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xl font-bold gradient-text">AI Exam</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 overflow-y-auto">
                        <ul className="space-y-2">
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.path;
                                return (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                            onClick={onClose}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{link.label}</span>
                                            {isActive && (
                                                <span className="ml-auto w-1.5 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* User Info */}
                    {user && (
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                    {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {user.fullName || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;