import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';


import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ExamProvider } from './context/ExamContext';

import './index.css';
import './styles/globals.css';
import './styles/animations.css';

// Polyfill for older browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Error tracking
if (process.env.NODE_ENV === 'production') {
    console.log('🚀 AI Exam Platform - Production Mode');
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <HelmetProvider>
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <NotificationProvider>
                        <ExamProvider>
                            <App />
                        </ExamProvider>
                    </NotificationProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    </HelmetProvider>
);