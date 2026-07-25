import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import ThemeToggle from './ThemeToggle';
import { 
    Menu, 
    X, 
    User, 
    LogOut, 
    LayoutDashboard, 
    History, 
    FileText, 
    GraduationCap,
    ChevronDown,
    Settings,
    Sparkles
} from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    }, [location]);

    // Detect scroll for elevated navbar effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 12);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!isDropdownOpen) return;
        const handle = (e) => {
            if (!e.target.closest('[data-dropdown]')) setIsDropdownOpen(false);
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [isDropdownOpen]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isAdmin = user?.role === 'ADMIN';
    const navigationLinks = isAdmin
        ? [
            { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          ]
        : [
            { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/exam/start', label: 'Start Exam', icon: FileText },
            { path: '/history', label: 'History', icon: History },
          ];

    return (
        <nav
            className="sticky top-0 z-50 transition-all duration-300"
            style={{
                background: scrolled
                    ? 'var(--glass-bg)'
                    : (theme === 'dark' ? 'rgba(11, 15, 25, 0.92)' : 'rgba(255, 255, 255, 0.92)'),
                backdropFilter: 'blur(20px) saturate(200%)',
                WebkitBackdropFilter: 'blur(20px) saturate(200%)',
                borderBottom: `1px solid var(--glass-border)`,
                boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2.5 group">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-indigo-500/40 transition-shadow duration-300">
                            <GraduationCap className="w-4.5 h-4.5 text-white" style={{ width: '1.125rem', height: '1.125rem' }} />
                        </div>
                        <span className="text-lg font-bold gradient-text tracking-tight">
                            AI Exam
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {isAuthenticated ? (
                            <>
                                {navigationLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = location.pathname === link.path ||
                                        (link.path !== '/' && location.pathname.startsWith(link.path));
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-indigo-100/80 dark:bg-indigo-900/25 text-indigo-600 dark:text-indigo-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{link.label}</span>
                                        </Link>
                                    );
                                })}
                                
                                {/* User Dropdown */}
                                <div className="relative" data-dropdown="user">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-gray-100/80 dark:hover:bg-white/5 transition-all duration-200 ml-2"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/25">
                                            {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <div
                                            data-dropdown="user"
                                            className="absolute right-0 mt-2 w-52 py-1.5 rounded-2xl shadow-xl border animate-scale-in"
                                            style={{
                                                background: 'var(--glass-bg)',
                                                backdropFilter: 'blur(16px) saturate(180%)',
                                                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                                                borderColor: 'var(--glass-border)',
                                                boxShadow: 'var(--shadow-xl)',
                                            }}
                                        >
                                            <div className="px-4 py-2.5 border-b mb-1" style={{ borderColor: 'var(--border-primary)' }}>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                    {user?.fullName || 'User'}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                                    {user?.email}
                                                </p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg mx-1"
                                            >
                                                <User className="w-4 h-4" />
                                                <span>My Profile</span>
                                            </Link>
                                            <Link
                                                to="/profile"
                                                className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg mx-1"
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span>Settings</span>
                                            </Link>
                                            <div className="my-1.5 border-t" style={{ borderColor: 'var(--border-primary)' }} />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 w-full transition-colors rounded-lg mx-1 mb-1"
                                                style={{ width: 'calc(100% - 0.5rem)' }}
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="ml-1">
                                    <ThemeToggle />
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                {/* Public links */}
                                {[
                                    { path: '/', label: 'Home' },
                                    { path: '/about', label: 'About' },
                                    { path: '/contact', label: 'Contact' },
                                ].map(link => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                            location.pathname === link.path
                                                ? 'text-indigo-600 dark:text-indigo-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1" />
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-all duration-200"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                                    style={{ background: 'var(--gradient-primary)' }}
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Get Started</span>
                                </Link>
                                <ThemeToggle />
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center space-x-2 md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen
                                ? <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                : <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div
                    className="md:hidden animate-fade-in-down"
                    style={{ borderTop: '1px solid var(--border-primary)' }}
                >
                    <div
                        className="px-4 py-3 space-y-1"
                        style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)' }}
                    >
                        {isAuthenticated ? (
                            <>
                                {/* User info */}
                                <div className="flex items-center space-x-3 px-4 py-3 mb-2 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                        {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.fullName || 'User'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                                    </div>
                                </div>
                                {navigationLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                                isActive
                                                    ? 'bg-indigo-100/80 dark:bg-indigo-900/25 text-indigo-600 dark:text-indigo-400'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                                            }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Icon className="w-4.5 h-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
                                            <span>{link.label}</span>
                                        </Link>
                                    );
                                })}
                                <div className="my-2 border-t" style={{ borderColor: 'var(--border-primary)' }} />
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User className="w-4 h-4" />
                                    <span>My Profile</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-3 px-4 py-3 w-full text-sm text-red-500 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <div className="space-y-1 pb-2">
                                {[
                                    { path: '/', label: 'Home' },
                                    { path: '/about', label: 'About' },
                                    { path: '/contact', label: 'Contact' },
                                ].map(link => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="my-2 border-t" style={{ borderColor: 'var(--border-primary)' }} />
                                <Link
                                    to="/login"
                                    className="block px-4 py-3 text-sm text-center font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block px-4 py-3 text-sm text-center font-semibold text-white rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/30"
                                    style={{ background: 'var(--gradient-primary)' }}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get Started Free
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;