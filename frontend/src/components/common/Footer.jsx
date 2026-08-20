import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin, Mail, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        platform: [
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Start Exam', path: '/exam/start' },
            { label: 'Exam History', path: '/history' },
            { label: 'Profile', path: '/profile' },
        ],
        company: [
            { label: 'About Us', path: '/about' },
            { label: 'Contact', path: '/contact' },
        ],
        legal: [
            { label: 'Privacy Policy', path: '/privacy-policy' },
            { label: 'Terms of Service', path: '/terms-of-service' },
            { label: 'Cookie Policy', path: '/privacy-policy' },
        ],
    };

    const socialLinks = [
        { icon: Github, href: '#', label: 'GitHub' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Mail, href: '#', label: 'Email' },
    ];

    return (
        <footer
            style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px) saturate(160%)',
                WebkitBackdropFilter: 'blur(12px) saturate(160%)',
                borderTop: '1px solid var(--glass-border)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    {/* Brand Column */}
                    <div className="md:col-span-4">
                        <Link to="/" className="flex items-center space-x-2.5 mb-4 group w-fit">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow duration-300">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text tracking-tight">AI Exam</span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                            The smartest way to create, take, and evaluate exams. Powered by advanced AI to deliver personalized learning experiences.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center space-x-2">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                    style={{
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-primary)',
                                        color: 'var(--text-tertiary)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'var(--gradient-primary)';
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'var(--bg-secondary)';
                                        e.currentTarget.style.color = 'var(--text-tertiary)';
                                        e.currentTarget.style.borderColor = 'var(--border-primary)';
                                    }}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>Platform</h3>
                            <ul className="space-y-2.5">
                                {footerLinks.platform.map(link => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.path}
                                            className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                                            style={{ color: 'var(--text-secondary)' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#4F46E5'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>Company</h3>
                            <ul className="space-y-2.5">
                                {footerLinks.company.map(link => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.path}
                                            className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                                            style={{ color: 'var(--text-secondary)' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#4F46E5'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>Legal</h3>
                            <ul className="space-y-2.5">
                                {footerLinks.legal.map(link => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.path}
                                            className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                                            style={{ color: 'var(--text-secondary)' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#4F46E5'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    className="mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3"
                    style={{ borderTop: '1px solid var(--border-primary)' }}
                >
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        &copy; {currentYear} AI Exam Platform. All rights reserved.
                    </p>
                    <p className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        Made with
                        <Heart className="w-3.5 h-3.5 text-red-400 fill-current animate-pulse" />
                        and
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        by AI Exam Team
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;