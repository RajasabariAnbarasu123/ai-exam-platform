import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, Mail, Lock, Loader2, AlertTriangle, GraduationCap, ArrowRight } from 'lucide-react';
import { showToast } from '../common/ToastNotifications';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailNotVerified, setEmailNotVerified] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmailNotVerified(false);
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEmailNotVerified(false);

        try {
            const res = await login(formData.email, formData.password);
            showToast.success('Welcome back! Redirecting...');
            setTimeout(() => {
                if (res?.role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/dashboard');
                }
            }, 500);
        } catch (error) {
            const msg = error.response?.data?.message || '';
            if (msg === 'EMAIL_NOT_VERIFIED') {
                setEmailNotVerified(true);
            } else {
                showToast.error(msg || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12"
            style={{ background: 'var(--bg-primary)' }}
        >
            {/* Decorative blobs */}
            <div
                className="absolute top-[-100px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
            />
            <div
                className="absolute bottom-[-80px] right-[-60px] w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}
            />

            <div className="w-full max-w-[420px] relative z-10 animate-scale-in">
                {/* Card */}
                <div
                    className="rounded-3xl p-8"
                    style={{
                        background: 'var(--glass-bg)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: 'var(--shadow-xl)',
                    }}
                >
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{ background: 'var(--gradient-primary)', boxShadow: '0 8px 24px rgba(79,70,229,0.35)' }}
                            >
                                <GraduationCap className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                            Welcome back
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Sign in to your account to continue
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold mb-2"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail className="h-4.5 w-4.5" style={{ width: '1.125rem', height: '1.125rem', color: 'var(--text-tertiary)' }} />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input pl-10"
                                    placeholder="you@example.com"
                                    style={{ paddingLeft: '2.75rem' }}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold mb-2"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="h-4.5 w-4.5" style={{ width: '1.125rem', height: '1.125rem', color: 'var(--text-tertiary)' }} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input pr-11"
                                    placeholder="••••••••"
                                    style={{ paddingLeft: '2.75rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-opacity hover:opacity-70"
                                >
                                    {showPassword
                                        ? <EyeOff className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                                        : <Eye className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Email Not Verified Banner */}
                        {emailNotVerified && (
                            <div
                                id="email-not-verified-alert"
                                className="flex items-start gap-3 p-4 rounded-xl"
                                style={{
                                    background: 'rgba(245,158,11,0.1)',
                                    border: '1px solid rgba(245,158,11,0.3)',
                                }}
                            >
                                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#D97706' }} />
                                <div>
                                    <p className="text-sm font-bold" style={{ color: '#92400e' }}>
                                        Email not verified
                                    </p>
                                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#b45309' }}>
                                        A verification link was sent to <strong>{formData.email}</strong>. Check your inbox and spam folder.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Remember me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm font-semibold text-indigo-500 hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                            style={{
                                background: loading ? '#6366F1' : 'var(--gradient-primary)',
                                boxShadow: '0 6px 24px rgba(79, 70, 229, 0.35)',
                            }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 32px rgba(79, 70, 229, 0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(79, 70, 229, 0.35)'; }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {/* Signup Link */}
                        <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="font-bold text-indigo-500 hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                            >
                                Create one free
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs mt-5" style={{ color: 'var(--text-tertiary)' }}>
                    By signing in, you agree to our{' '}
                    <a href="#" className="underline hover:text-indigo-500 transition-colors">Terms</a>
                    {' '}and{' '}
                    <a href="#" className="underline hover:text-indigo-500 transition-colors">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default Login;