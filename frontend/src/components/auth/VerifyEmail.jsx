import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { showToast } from '../common/ToastNotifications';
import api from '../../services/api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link');
                return;
            }

            try {
                await api.post('/auth/verify-email', null, {
                    params: { token },
                });
                setStatus('success');
                setMessage('Email verified successfully! You can now login.');
                showToast.success('Email verified successfully!');
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Email verification failed');
                showToast.error('Email verification failed');
            }
        };

        verifyEmail();
    }, [token, navigate]);

    const renderContent = () => {
        if (status === 'loading') {
            return (
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                        Verifying Your Email
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Please wait while we verify your email address...
                    </p>
                </div>
            );
        }

        if (status === 'success') {
            return (
                <div className="text-center">
                    <div className="flex justify-center">
                        <CheckCircle className="w-20 h-20 text-green-500" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-green-600 dark:text-green-400">
                        Email Verified!
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {message}
                    </p>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Redirecting to login page...
                    </p>
                </div>
            );
        }

        if (status === 'error') {
            return (
                <div className="text-center">
                    <div className="flex justify-center">
                        <XCircle className="w-20 h-20 text-red-500" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-red-600 dark:text-red-400">
                        Verification Failed
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {message}
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full glass-morphism p-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default VerifyEmail;