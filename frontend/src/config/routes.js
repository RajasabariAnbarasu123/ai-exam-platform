export const ROUTES = {
    // Public Routes
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    PRIVACY_POLICY: '/privacy-policy',
    TERMS_OF_SERVICE: '/terms-of-service',
    
    // Protected Routes
    DASHBOARD: '/dashboard',
    START_EXAM: '/exam/start',
    EXAM_TAKING: '/exam/taking',
    RESULTS: '/results',
    HISTORY: '/history',
    PROFILE: '/profile',
    REPORT: '/report',
    
    // Admin Routes
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/users',
    ADMIN_EXAMS: '/admin/exams',
    ADMIN_ANALYTICS: '/admin/analytics',
    ADMIN_SETTINGS: '/admin/settings',
};

// Route groups for navigation
export const NAV_ROUTES = {
    public: [
        { path: ROUTES.HOME, label: 'Home' },
        { path: ROUTES.ABOUT, label: 'About' },
        { path: ROUTES.CONTACT, label: 'Contact' },
        { path: ROUTES.LOGIN, label: 'Login' },
        { path: ROUTES.SIGNUP, label: 'Sign Up' },
    ],
    user: [
        { path: ROUTES.DASHBOARD, label: 'Dashboard' },
        { path: ROUTES.START_EXAM, label: 'Start Exam' },
        { path: ROUTES.HISTORY, label: 'History' },
        { path: ROUTES.PROFILE, label: 'Profile' },
    ],
    admin: [
        { path: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard' },
        { path: ROUTES.ADMIN_USERS, label: 'Users' },
        { path: ROUTES.ADMIN_EXAMS, label: 'Exams' },
        { path: ROUTES.ADMIN_ANALYTICS, label: 'Analytics' },
        { path: ROUTES.ADMIN_SETTINGS, label: 'Settings' },
    ],
};

// Route protection configuration
export const PROTECTED_ROUTES = [
    ROUTES.DASHBOARD,
    ROUTES.START_EXAM,
    ROUTES.EXAM_TAKING,
    ROUTES.RESULTS,
    ROUTES.HISTORY,
    ROUTES.PROFILE,
    ROUTES.REPORT,
    ROUTES.ADMIN_DASHBOARD,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_EXAMS,
    ROUTES.ADMIN_ANALYTICS,
    ROUTES.ADMIN_SETTINGS,
];

export const ADMIN_ROUTES = [
    ROUTES.ADMIN_DASHBOARD,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_EXAMS,
    ROUTES.ADMIN_ANALYTICS,
    ROUTES.ADMIN_SETTINGS,
];

// Public routes (no authentication required)
export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.ABOUT,
    ROUTES.CONTACT,
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
    ROUTES.VERIFY_EMAIL,
    ROUTES.PRIVACY_POLICY,
    ROUTES.TERMS_OF_SERVICE,
];

// Auth routes (redirect to dashboard if authenticated)
export const AUTH_ROUTES = [
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
    ROUTES.VERIFY_EMAIL,
];