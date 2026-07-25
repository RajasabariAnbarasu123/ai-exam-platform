// ============================================
// APP CONFIGURATION
// ============================================
export const APP_NAME = 'AI Exam Platform';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'AI-Powered Smart Exam Platform for dynamic assessment';
export const APP_KEYWORDS = 'AI exam, online exam, AI questions, smart exam, e-learning';

// ============================================
// API CONFIGURATION
// ============================================
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
export const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 300000;
export const API_RETRY_COUNT = 3;
export const API_RETRY_DELAY = 1000;

// ============================================
// AUTHENTICATION
// ============================================
export const TOKEN_EXPIRY = 86400000; // 24 hours
export const REFRESH_TOKEN_EXPIRY = 604800000; // 7 days
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
    THEME: 'theme',
};

// ============================================
// EXAM CONFIGURATION
// ============================================
export const DIFFICULTIES = {
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD'
};

export const DIFFICULTY_LABELS = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard'
};

export const QUESTION_TYPES = {
    MCQ: 'MCQ',
    TRUE_FALSE: 'TRUE_FALSE',
    FILL_IN_THE_BLANK: 'FILL_IN_THE_BLANK',
    SHORT_ANSWER: 'SHORT_ANSWER',
    CODING: 'CODING'
};

export const QUESTION_TYPE_LABELS = {
    MCQ: 'Multiple Choice',
    TRUE_FALSE: 'True / False',
    FILL_IN_THE_BLANK: 'Fill in the Blank',
    SHORT_ANSWER: 'Short Answer',
    CODING: 'Coding'
};

export const MIN_QUESTIONS = 5;
export const MAX_QUESTIONS = 30;
export const DEFAULT_QUESTIONS = 10;

// ============================================
// TIMER CONFIGURATION (in seconds)
// ============================================
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

// ============================================
// PERFORMANCE RATINGS
// ============================================
export const PERFORMANCE_RATINGS = {
    EXCELLENT: 'EXCELLENT',
    GOOD: 'GOOD',
    AVERAGE: 'AVERAGE',
    NEEDS_IMPROVEMENT: 'NEEDS_IMPROVEMENT'
};

export const PERFORMANCE_THRESHOLDS = {
    EXCELLENT: 90,
    GOOD: 75,
    AVERAGE: 60,
    NEEDS_IMPROVEMENT: 0
};

// ============================================
// PAGINATION
// ============================================
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// ============================================
// FILE UPLOAD
// ============================================
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
];

// ============================================
// TOAST MESSAGES
// ============================================
export const TOAST_MESSAGES = {
    SUCCESS: {
        LOGIN: 'Welcome back!',
        LOGOUT: 'Logged out successfully',
        SIGNUP: 'Account created successfully! Please verify your email.',
        EMAIL_VERIFIED: 'Email verified successfully!',
        PASSWORD_RESET: 'Password reset successfully!',
        PROFILE_UPDATE: 'Profile updated successfully!',
        EXAM_SUBMIT: 'Exam submitted successfully!',
        EXAM_GENERATED: 'Exam generated successfully!',
        HISTORY_DELETED: 'History record deleted successfully!',
        SETTINGS_UPDATED: 'Settings updated successfully!'
    },
    ERROR: {
        NETWORK: 'Network error. Please check your connection.',
        SERVER: 'Server error. Please try again later.',
        UNAUTHORIZED: 'Session expired. Please login again.',
        FORBIDDEN: 'You don\'t have permission to access this resource.',
        NOT_FOUND: 'Resource not found.',
        VALIDATION: 'Please check your input and try again.',
        GENERIC: 'An error occurred. Please try again.'
    }
};

// ============================================
// ERROR CODES
// ============================================
export const ERROR_CODES = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION: 'VALIDATION',
    SERVER_ERROR: 'SERVER_ERROR',
    UNKNOWN: 'UNKNOWN'
};

// ============================================
// THEME
// ============================================
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

export const DEFAULT_THEME = THEMES.LIGHT;

// ============================================
// DATE FORMATS
// ============================================
export const DATE_FORMATS = {
    SHORT: 'MMM DD, YYYY',
    LONG: 'MMMM DD, YYYY',
    DATE_TIME: 'MMM DD, YYYY HH:mm',
    TIME: 'HH:mm',
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
};

// ============================================
// CHART COLORS
// ============================================
export const CHART_COLORS = [
    '#4F46E5', // Indigo
    '#7C3AED', // Purple
    '#EC4899', // Pink
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#F472B6', // Pink light
    '#34D399'  // Emerald light
];

// ============================================
// SOCIAL LINKS
// ============================================
export const SOCIAL_LINKS = {
    GITHUB: 'https://github.com/aiexamplatform',
    TWITTER: 'https://twitter.com/aiexamplatform',
    LINKEDIN: 'https://linkedin.com/company/aiexamplatform',
    YOUTUBE: 'https://youtube.com/aiexamplatform'
};

// ============================================
// SUPPORT
// ============================================
export const SUPPORT_EMAIL = 'support@aiexam.com';
export const SUPPORT_PHONE = '+1 (555) 123-4567';
export const SUPPORT_HOURS = 'Mon-Fri: 9:00 AM - 6:00 PM (EST)';

// ============================================
// REGEX PATTERNS
// ============================================
export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/,
    PHONE: /^\+?[0-9]{10,15}$/,
    URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
};

// ============================================
// LOCAL STORAGE KEYS
// ============================================
export const LS_KEYS = {
    THEME: 'theme',
    LANGUAGE: 'language',
    SIDEBAR_STATE: 'sidebarState',
    NOTIFICATIONS: 'notifications',
    LAST_VISITED: 'lastVisited'
};

// ============================================
// EXAM STATUS
// ============================================
export const EXAM_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED'
};