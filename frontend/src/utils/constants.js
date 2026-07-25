// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
export const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 300000;

// App Configuration
export const APP_NAME = 'AI Exam Platform';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'AI-Powered Smart Exam Platform';

// Routes
export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    DASHBOARD: '/dashboard',
    START_EXAM: '/exam/start',
    EXAM_TAKING: '/exam/taking',
    RESULTS: '/results',
    HISTORY: '/history',
    PROFILE: '/profile',
    REPORT: '/report',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/users',
    ADMIN_EXAMS: '/admin/exams',
    ADMIN_ANALYTICS: '/admin/analytics',
    ADMIN_SETTINGS: '/admin/settings'
};

// Exam Configuration
export const DIFFICULTIES = {
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD'
};

export const QUESTION_TYPES = {
    MCQ: 'MCQ',
    TRUE_FALSE: 'TRUE_FALSE',
    FILL_IN_THE_BLANK: 'FILL_IN_THE_BLANK',
    SHORT_ANSWER: 'SHORT_ANSWER',
    CODING: 'CODING'
};

export const PERFORMANCE_RATINGS = {
    EXCELLENT: 'EXCELLENT',
    GOOD: 'GOOD',
    AVERAGE: 'AVERAGE',
    NEEDS_IMPROVEMENT: 'NEEDS_IMPROVEMENT'
};

// Timer Configuration (in seconds)
export const TIMER_CONFIG = {
    EASY: {
        MCQ: 30,
        TRUE_FALSE: 20,
        FILL_IN_THE_BLANK: 30,
        SHORT_ANSWER: 60,
        CODING: 300
    },
    MEDIUM: {
        MCQ: 45,
        TRUE_FALSE: 30,
        FILL_IN_THE_BLANK: 45,
        SHORT_ANSWER: 90,
        CODING: 600
    },
    HARD: {
        MCQ: 60,
        TRUE_FALSE: 45,
        FILL_IN_THE_BLANK: 60,
        SHORT_ANSWER: 120,
        CODING: 900
    }
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Local Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    THEME: 'theme',
    USER: 'user'
};

// Toast Messages
export const TOAST_MESSAGES = {
    LOGIN_SUCCESS: 'Welcome back!',
    LOGOUT_SUCCESS: 'Logged out successfully',
    SIGNUP_SUCCESS: 'Account created successfully! Please verify your email.',
    EMAIL_VERIFIED: 'Email verified successfully!',
    PASSWORD_RESET_SUCCESS: 'Password reset successfully!',
    PROFILE_UPDATE_SUCCESS: 'Profile updated successfully!',
    EXAM_SUBMIT_SUCCESS: 'Exam submitted successfully!',
    GENERATE_EXAM_SUCCESS: 'Exam generated successfully!'
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'Session expired. Please login again.',
    FORBIDDEN: 'You don\'t have permission to access this resource.',
    NOT_FOUND: 'Resource not found.',
    VALIDATION_ERROR: 'Please check your input and try again.'
};