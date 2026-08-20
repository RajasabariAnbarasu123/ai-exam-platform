import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, Mail, Lock, User, Check, X, Loader2, GraduationCap, ArrowRight } from 'lucide-react';
import { showToast } from '../common/ToastNotifications';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { signup, registrationEnabled } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'password') {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@#$%^&+=]/.test(password)) strength++;
        setPasswordStrength(strength);
    };

    const strengthConfig = [
        { label: 'Very Weak', color: '#EF4444' },
        { label: 'Weak', color: '#F97316' },
        { label: 'Fair', color: '#F59E0B' },
        { label: 'Good', color: '#10B981' },
        { label: 'Strong', color: '#059669' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!registrationEnabled) {
            showToast.error('Registration is currently disabled.');
            return;
        }
        setLoading(true);
        if (formData.password !== formData.confirmPassword) {
            showToast.error('Passwords do not match');
            setLoading(false);
            return;
        }
        try {
            await signup(formData);
            showToast.success('Account created! Please verify your email.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            showToast.error(error.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!registrationEnabled) {
        return (
            <div
                className="min-h-screen flex items-center justify-center px-4 py-12"
                style={{ background: 'var(--bg-primary)' }}
            >
                <div
                    className="w-full max-w-[400px] rounded-3xl p-8 text-center animate-scale-in"
                    style={{
                        background: 'var(--glass-bg)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: 'var(--shadow-xl)',
                    }}
                >
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                        <X className="w-7 h-7" style={{ color: '#EF4444' }} />
                    </div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Registration Disabled
                    </h2>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                        New user registration is currently disabled by the administrator. Please contact support or try again later.
                    </p>
                    <div className="pt-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
                        <Link
                            to="/login"
                            className="text-sm font-bold text-indigo-500 hover:text-indigo-400 transition-colors"
                        >
                            ← Go to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const passwordRules = [
        { label: 'At least 8 characters', met: formData.password.length >= 8 },
        { label: 'Uppercase & lowercase', met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) },
        { label: 'Contains a number', met: /\d/.test(formData.password) },
        { label: 'Special character (@#$%^&+=)', met: /[@#$%^&+=]/.test(formData.password) },
    ];

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12"
            style={{ background: 'var(--bg-primary)' }}
        >
            {/* Decorative blobs */}
            <div
                className="absolute top-[-80px] left-[-60px] w-[450px] h-[450px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
            />
            <div
                className="absolute bottom-[-60px] right-[-40px] w-[350px] h-[350px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}
            />

            <div className="w-full max-w-[440px] relative z-10 animate-scale-in">
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
                    <div className="text-center mb-7">
                        <div className="flex justify-center mb-4">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{ background: 'var(--gradient-primary)', boxShadow: '0 8px 24px rgba(79,70,229,0.35)' }}
                            >
                                <GraduationCap className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                            Create your account
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Join the AI Exam Platform today — it's free
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <User className="w-4.5 h-4.5" style={{ width: '1.125rem', height: '1.125rem', color: 'var(--text-tertiary)' }} />
                                </div>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="John Doe"
                                    style={{ paddingLeft: '2.75rem' }}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail className="w-4.5 h-4.5" style={{ width: '1.125rem', height: '1.125rem', color: 'var(--text-tertiary)' }} />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="you@example.com"
                                    style={{ paddingLeft: '2.75rem' }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="w-4.5 h-4.5" style={{ width: '1.125rem', height: '1.125rem', color: 'var(--text-tertiary)' }} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
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
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center hover:opacity-70 transition-opacity"
                                >
                                    {showPassword
                                        ? <EyeOff className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                                        : <Eye className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                                    }
                                </button>
                            </div>

                            {/* Password Strength */}
                            {formData.password && (
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${(passwordStrength / 4) * 100}%`,
                                                    background: strengthConfig[passwordStrength]?.color || '#EF4444',
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold" style={{ color: strengthConfig[passwordStrength]?.color || '#EF4444' }}>
                                            {strengthConfig[passwordStrength]?.label || 'Very Weak'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1">
                                        {passwordRules.map((rule, i) => (
                                            <div key={i} className="flex items-center gap-1.5 text-xs">
                                                {rule.met
                                                    ? <Check className="w-3 h-3 shrink-0" style={{ color: '#10B981' }} />
                                                    : <X className="w-3 h-3 shrink-0" style={{ color: '#94A3B8' }} />
                                                }
                                                <span style={{ color: rule.met ? '#10B981' : 'var(--text-tertiary)' }}>
                                                    {rule.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="w-4.5 h-4.5" style={{ width: '1.125rem', height: '1.125rem', color: 'var(--text-tertiary)' }} />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-input pr-11"
                                    placeholder="••••••••"
                                    style={{ paddingLeft: '2.75rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center hover:opacity-70 transition-opacity"
                                >
                                    {showConfirmPassword
                                        ? <EyeOff className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                                        : <Eye className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                                    }
                                </button>
                            </div>
                            {formData.confirmPassword && (
                                <p className={`mt-1.5 text-xs font-medium flex items-center gap-1`}
                                    style={{ color: formData.password === formData.confirmPassword ? '#10B981' : '#EF4444' }}
                                >
                                    {formData.password === formData.confirmPassword
                                        ? <><Check className="w-3 h-3" /> Passwords match</>
                                        : <><X className="w-3 h-3" /> Passwords do not match</>
                                    }
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || (formData.confirmPassword && formData.password !== formData.confirmPassword)}
                            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 mt-2"
                            style={{
                                background: 'var(--gradient-primary)',
                                boxShadow: '0 6px 24px rgba(79, 70, 229, 0.35)',
                            }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 32px rgba(79, 70, 229, 0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(79, 70, 229, 0.35)'; }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-bold text-indigo-500 hover:text-indigo-400 dark:text-indigo-400 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Legal note */}
                <p className="text-center text-xs mt-5" style={{ color: 'var(--text-tertiary)' }}>
                    By creating an account, you agree to our{' '}
                    <Link to="/terms-of-service" className="underline hover:text-indigo-500 transition-colors">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy-policy" className="underline hover:text-indigo-500 transition-colors">Privacy Policy</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;