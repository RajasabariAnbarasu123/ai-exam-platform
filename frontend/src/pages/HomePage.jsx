import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
    Sparkles, 
    Rocket, 
    Shield, 
    Zap, 
    ChevronRight,
    GraduationCap,
    Brain,
    Clock,
    Award,
    Users,
    BarChart3,
    CheckCircle,
    ArrowRight,
    Star
} from 'lucide-react';

const HomePage = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: Brain,
            title: 'AI-Powered Questions',
            description: 'Generate dynamic, unique exam questions on any topic using advanced language models.',
            gradient: 'from-purple-500 to-indigo-500',
            glow: 'rgba(124, 58, 237, 0.2)',
            badge: 'AI Engine',
        },
        {
            icon: Clock,
            title: 'Adaptive Timing',
            description: 'Smart per-question timers adapt to difficulty level and your performance.',
            gradient: 'from-cyan-500 to-blue-500',
            glow: 'rgba(6, 182, 212, 0.2)',
            badge: 'Smart Timer',
        },
        {
            icon: Award,
            title: 'Instant Results',
            description: 'Get detailed performance analytics and personalized insights immediately after each exam.',
            gradient: 'from-emerald-500 to-teal-500',
            glow: 'rgba(16, 185, 129, 0.2)',
            badge: 'Analytics',
        },
        {
            icon: Shield,
            title: 'Secure & Reliable',
            description: 'Enterprise-grade security protects your data, with 99.9% uptime guarantee.',
            gradient: 'from-rose-500 to-pink-500',
            glow: 'rgba(239, 68, 68, 0.2)',
            badge: 'Secure',
        },
    ];

    const stats = [
        { label: 'Questions Generated', value: '1000+', icon: Sparkles, color: '#7C3AED' },
        { label: 'Active Users', value: '10+', icon: Users, color: '#4F46E5' },
        { label: 'Exams Taken', value: '100+', icon: BarChart3, color: '#06B6D4' },
        { label: 'Success Rate', value: '90%', icon: CheckCircle, color: '#10B981' },
    ];

    const testimonialHighlights = [
        { text: 'Best AI exam tool I\'ve used', stars: 5 },
        { text: 'Incredibly accurate questions', stars: 5 },
        { text: 'Perfect for my prep', stars: 5 },
    ];

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

            {/* ========== HERO SECTION ========== */}
            <div className="relative overflow-hidden">
                {/* Decorative Blobs */}
                <div
                    className="absolute top-[-120px] left-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                    }}
                />
                <div
                    className="absolute top-0 right-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                    }}
                />
                <div
                    className="absolute bottom-0 left-1/2 w-[700px] h-[300px] -translate-x-1/2 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse, rgba(6,182,212,0.1) 0%, transparent 70%)',
                        filter: 'blur(30px)',
                    }}
                />

                {/* Dot grid pattern */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, var(--border-primary) 1px, transparent 0)',
                        backgroundSize: '28px 28px',
                        opacity: 0.6,
                    }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full mb-8 animate-fade-in"
                            style={{
                                background: 'rgba(79, 70, 229, 0.1)',
                                border: '1px solid rgba(79, 70, 229, 0.2)',
                            }}
                        >
                            <Sparkles className="w-3.5 h-3.5" style={{ color: '#4F46E5' }} />
                            <span className="text-sm font-semibold" style={{ color: '#4F46E5' }}>
                                AI-Powered Exam Platform
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <span className="gradient-text">Smart Exams</span>
                            <br />
                            <span style={{ color: 'var(--text-primary)' }}>Powered by AI</span>
                        </h1>

                        {/* Subtitle */}
                        <p
                            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in"
                            style={{ color: 'var(--text-secondary)', animationDelay: '0.2s' }}
                        >
                            Generate dynamic exams with AI, get instant results, and track your performance with detailed analytics. The future of online assessment is here.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <Link
                                to={isAuthenticated ? '/dashboard' : '/signup'}
                                className="group flex items-center space-x-2.5 px-8 py-4 text-white rounded-2xl text-base font-semibold transition-all duration-300 hover:-translate-y-1"
                                style={{
                                    background: 'var(--gradient-primary)',
                                    boxShadow: '0 8px 32px rgba(79, 70, 229, 0.35)',
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px rgba(79, 70, 229, 0.5)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(79, 70, 229, 0.35)'}
                            >
                                <Rocket className="w-4.5 h-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
                                <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                to="/about"
                                className="group flex items-center space-x-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-200 hover:-translate-y-0.5"
                                style={{
                                    background: 'var(--glass-bg)',
                                    border: '1.5px solid var(--border-primary)',
                                    color: 'var(--text-primary)',
                                    boxShadow: 'var(--shadow-sm)',
                                }}
                            >
                                <span>Learn More</span>
                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    style={{
                                        background: 'var(--glass-bg)',
                                        border: '1px solid var(--glass-border)',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)',
                                    }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                                        style={{ background: `${stat.color}18` }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color: stat.color }} />
                                    </div>
                                    <p className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                        {stat.value}
                                    </p>
                                    <p className="text-xs font-medium mt-0.5 uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                                        {stat.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ========== FEATURES SECTION ========== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-14">
                    <div
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                        style={{
                            background: 'rgba(79, 70, 229, 0.1)',
                            border: '1px solid rgba(79, 70, 229, 0.2)',
                            color: '#4F46E5',
                        }}
                    >
                        <Zap className="w-3 h-3" />
                        <span>Powerful Features</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                        Why Choose AI Exam Platform?
                    </h2>
                    <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        Experience the future of online examinations with cutting-edge features designed for modern learners.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 cursor-default"
                                style={{
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                    boxShadow: 'var(--shadow-sm)',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.boxShadow = `0 12px 40px ${feature.glow}, var(--shadow-md)`;
                                    e.currentTarget.style.borderColor = feature.glow.replace('0.2', '0.4');
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                                }}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                                    style={{
                                        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                                        backgroundImage: `linear-gradient(135deg, ${feature.gradient.includes('purple') ? '#7C3AED' : feature.gradient.includes('cyan') ? '#06B6D4' : feature.gradient.includes('emerald') ? '#10B981' : '#EF4444'}, ${feature.gradient.includes('indigo') ? '#4F46E5' : feature.gradient.includes('blue') ? '#3B82F6' : feature.gradient.includes('teal') ? '#14B8A6' : '#EC4899'})`,
                                    }}
                                >
                                    <Icon className="w-5.5 h-5.5" style={{ width: '1.375rem', height: '1.375rem' }} />
                                </div>
                                <div
                                    className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit mb-3"
                                    style={{
                                        background: feature.glow,
                                        color: feature.glow.includes('124') ? '#7C3AED' : feature.glow.includes('182') ? '#06B6D4' : feature.glow.includes('185') ? '#10B981' : '#EF4444',
                                    }}
                                >
                                    {feature.badge}
                                </div>
                                <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                    {feature.title}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ========== CTA SECTION ========== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div
                    className="relative overflow-hidden rounded-3xl p-12 text-center"
                    style={{
                        background: 'var(--gradient-primary)',
                        boxShadow: '0 20px 60px rgba(79, 70, 229, 0.4)',
                    }}
                >
                    {/* Inner blobs */}
                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
                    <div className="absolute bottom-[-80px] left-[-30px] w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex justify-center mb-5">
                            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-indigo-100 max-w-xl mx-auto mb-8 text-base leading-relaxed">
                            Join thousands of students and professionals who are already achieving more with AI Exam Platform.
                        </p>
                        <Link
                            to={isAuthenticated ? '/exam/start' : '/signup'}
                            className="group inline-flex items-center space-x-2.5 px-8 py-4 bg-white text-indigo-600 rounded-2xl text-base font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
                        >
                            <Zap className="w-4.5 h-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
                            <span>{isAuthenticated ? 'Start an Exam' : 'Create Free Account'}</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <p className="text-indigo-200 text-xs mt-4">No credit card required · Free forever plan available</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
