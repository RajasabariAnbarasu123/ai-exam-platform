import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ToastNotifications from './components/common/ToastNotifications';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const Login = lazy(() => import('./components/auth/Login'));
const Signup = lazy(() => import('./components/auth/Signup'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./components/auth/VerifyEmail'));

const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const StartExam = lazy(() => import('./components/exam/StartExam'));
const ExamTaking = lazy(() => import('./components/exam/ExamTaking'));
const ResultPage = lazy(() => import('./components/results/ResultPage'));
const HistoryPage = lazy(() => import('./components/history/HistoryPage'));
const ProfilePage = lazy(() => import('./components/profile/ProfilePage'));
const ReportPage = lazy(() => import('./components/report/ReportPage'));

const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./components/admin/AdminUsers'));
const AdminExams = lazy(() => import('./components/admin/AdminExams'));
const AdminAnalytics = lazy(() => import('./components/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('./components/admin/AdminSettings'));
const MaintenancePage = lazy(() => import('./pages/MaintenancePage'));

// Hooks
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';

// Utils
import { ROUTES } from './config/routes';
import { APP_NAME, APP_VERSION } from './config/constants';

import './App.css';

function App() {
    const { theme } = useTheme();
    const { isAuthenticated, user, maintenanceMode } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const location = useLocation();
    
    // Hide navbar and footer while user is taking an exam
    const isExamTaking = location.pathname === '/exam/taking';

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        // Tailwind dark mode class
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Update meta theme color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#0B0F19' : '#4F46E5');
        }
    }, [theme]);

    useEffect(() => {
        // Log app startup
        console.log(`🚀 ${APP_NAME} v${APP_VERSION} loaded successfully`);
        if (user) {
            console.log(`👤 Logged in as: ${user.fullName || user.email}`);
        }
    }, [user]);

    if (maintenanceMode && !isAdmin) {
        return (
            <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner fullScreen />}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<MaintenancePage />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        );
    }

    return (
        <>
            <Helmet>
                <title>AI Exam Platform - Smart AI-Powered Exams</title>
                <meta 
                    name="description" 
                    content="AI-Powered Smart Exam Platform. Generate, take, and evaluate exams with artificial intelligence." 
                />
                <meta 
                    name="keywords" 
                    content="AI exam, online exam, AI questions, smart exam, e-learning, assessment" 
                />
                <meta property="og:title" content="AI Exam Platform" />
                <meta 
                    property="og:description" 
                    content="AI-Powered Smart Exam Platform - Generate and take exams with AI" 
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="AI Exam Platform" />
                <meta name="twitter:description" content="AI-Powered Smart Exam Platform" />
                <link rel="canonical" href={window.location.origin} />
            </Helmet>

            <div className="app-container min-h-screen flex flex-col">
                {!isExamTaking && <Navbar />}
                
                <main className="flex-grow">
                    <ErrorBoundary>
                        <Suspense fallback={<LoadingSpinner fullScreen />}>
                            <Routes>
                                {/* Public Routes */}
                                <Route path={ROUTES.HOME} element={<HomePage />} />
                                <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                                <Route path={ROUTES.CONTACT} element={<ContactPage />} />
                                <Route path={ROUTES.LOGIN} element={<Login />} />
                                <Route path={ROUTES.SIGNUP} element={<Signup />} />
                                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                                <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
                                <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />

                                {/* Protected Routes */}
                                <Route element={<PrivateRoute />}>
                                    <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                                    <Route path={ROUTES.START_EXAM} element={<StartExam />} />
                                    <Route path={ROUTES.EXAM_TAKING} element={<ExamTaking />} />
                                    <Route path={ROUTES.RESULTS} element={<ResultPage />} />
                                    <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
                                    <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                                    <Route path={`${ROUTES.REPORT}/:id`} element={<ReportPage />} />
                                </Route>

                                {/* Admin Routes */}
                                <Route element={<AdminRoute />}>
                                    <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
                                    <Route path={ROUTES.ADMIN_USERS} element={<AdminUsers />} />
                                    <Route path={ROUTES.ADMIN_EXAMS} element={<AdminExams />} />
                                    <Route path={ROUTES.ADMIN_ANALYTICS} element={<AdminAnalytics />} />
                                    <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettings />} />
                                </Route>

                                <Route 
                                    path="/" 
                                    element={
                                        isAuthenticated ? 
                                        (user?.role === 'ADMIN' ? <Navigate to={ROUTES.ADMIN_DASHBOARD} replace /> : <Navigate to={ROUTES.DASHBOARD} replace />) : 
                                        <Navigate to={ROUTES.HOME} replace />
                                    } 
                                />

                                {/* 404 */}
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </Suspense>
                    </ErrorBoundary>
                </main>

                {!isExamTaking && <Footer />}
            </div>

            <ToastNotifications />
        </>
    );
}

export default App;