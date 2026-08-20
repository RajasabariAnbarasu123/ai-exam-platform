import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Eye, FileText, Database, Bell, UserCheck, Mail } from 'lucide-react';

const PrivacyPolicyPage = () => {
    const lastUpdated = "August 20, 2026";

    const sections = [
        {
            icon: Eye,
            title: '1. Information We Collect',
            content: `We collect information you provide directly to us when using AI Exam Platform, including:
• Account Information: Name, email address, password hash, and profile preferences.
• Assessment Data: Exam responses, test scores, completion duration, and performance analytics.
• System & Usage Data: IP address, browser type, device information, and interaction logs with our platform.`
        },
        {
            icon: Database,
            title: '2. How We Use Your Information',
            content: `Your data is processed strictly for legitimate educational and platform enhancement purposes:
• Generating adaptive, AI-driven exam questions and personalized assessments.
• Calculating evaluation scores, feedback summaries, and detailed skill breakdown analytics.
• Maintaining platform security, detecting fraudulent attempt patterns, and preventing cheating.
• Sending system updates, password reset requests, and transactional notifications.`
        },
        {
            icon: Lock,
            title: '3. Data Security & Storage',
            content: `We implement robust security controls to safeguard your personal data:
• Encryption in transit (TLS/SSL) and at rest for sensitive account information.
• Secure database storage with strict access controls and role-based permissions.
• Continuous security monitoring to defend against unauthorized access or breaches.`
        },
        {
            icon: Shield,
            title: '4. AI Question & Content Processing',
            content: `When you request AI-generated exams:
• Topic prompts and difficulty settings are processed by automated AI algorithms to create questions.
• Personal identity data is never shared with third-party language models.
• Exam content generated remains associated with your account for historical review.`
        },
        {
            icon: FileText,
            title: '5. Cookies & Tracking Technologies',
            content: `We use essential session tokens and local storage to keep you authenticated:
• Authentication Tokens: Keep you securely logged in across pages.
• Theme Preferences: Store your dark/light mode choices locally on your browser.
• We do not sell your personal data or use third-party tracking cookies for targeted advertising.`
        },
        {
            icon: UserCheck,
            title: '6. Your Rights & Data Control',
            content: `You maintain control over your personal data:
• Right to Access: View your full profile, history, and evaluation scores at any time from your dashboard.
• Right to Rectification: Update your personal profile information directly within account settings.
• Right to Erasure: Request account deletion and associated evaluation data by contacting support.`
        },
        {
            icon: Mail,
            title: '7. Contact Us Regarding Privacy',
            content: `If you have questions, concerns, or requests regarding this Privacy Policy or how your data is handled, please reach out to us at:
• Email: support@aiexamplatform.com or privacy@aiexamplatform.com
• Contact Form: Navigate to our Contact page for direct inquiry submission.`
        }
    ];

    return (
        <>
            <Helmet>
                <title>Privacy Policy - AI Exam Platform</title>
                <meta name="description" content="Privacy Policy for AI Exam Platform. Learn how we collect, use, and protect your personal data and exam performance data." />
            </Helmet>

            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 mb-4 border border-indigo-500/20">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-extrabold gradient-text tracking-tight mb-3">
                        Privacy Policy
                    </h1>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                        Last Updated: {lastUpdated}
                    </p>
                    <p className="mt-4 text-base max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        At AI Exam Platform, we prioritize your privacy and data security. This Privacy Policy details how we manage, protect, and process your information when using our smart exam platform.
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-6">
                    {sections.map((section, idx) => {
                        const IconComponent = section.icon;
                        return (
                            <div 
                                key={idx} 
                                className="glass-card p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:border-indigo-500/30"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 shrink-0 mt-1">
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                            {section.title}
                                        </h2>
                                        <div 
                                            className="text-sm sm:text-base leading-relaxed whitespace-pre-line"
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            {section.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicyPage;
