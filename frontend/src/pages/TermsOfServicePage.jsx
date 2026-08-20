import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Scale, UserCheck, AlertTriangle, ShieldCheck, Cpu, RefreshCw, HelpCircle } from 'lucide-react';

const TermsOfServicePage = () => {
    const lastUpdated = "August 20, 2026";

    const sections = [
        {
            icon: UserCheck,
            title: '1. Acceptance of Terms',
            content: `By registering for an account, accessing, or using AI Exam Platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to all terms, you may not access or use the platform.`
        },
        {
            icon: ShieldCheck,
            title: '2. User Accounts & Responsibilities',
            content: `To access exam generation and evaluation features, you must create an account:
• Accuracy: You must provide accurate, current, and complete registration information.
• Account Security: You are responsible for safeguarding your credentials and for all activities under your account.
• Eligibility: You must be at least 13 years old (or the applicable age of digital consent in your jurisdiction) to register.`
        },
        {
            icon: Cpu,
            title: '3. AI Content & Exam Guidelines',
            content: `AI Exam Platform leverages artificial intelligence to create questions, grade answers, and render assessments:
• Content Disclaimer: While our AI algorithms strive for high educational accuracy, questions and evaluations are generated dynamically. Users should verify critical academic material.
• Academic Integrity: The platform is intended for practice, learning, and legitimate evaluation. Users agree not to attempt system exploitation, prompt injection, or automated scraping.`
        },
        {
            icon: AlertTriangle,
            title: '4. Prohibited Conduct',
            content: `Users are strictly prohibited from engaging in:
• Reverse engineering, decompiling, or probing the platform's backend services or AI prompt structures.
• Distributing malicious code, attempting unauthorized access, or burdening platform infrastructure.
• Sharing account credentials with third parties or bypassing access controls.`
        },
        {
            icon: Scale,
            title: '5. Intellectual Property Rights',
            content: `• Platform Ownership: The software, design system, branding, algorithms, and interface elements are owned by AI Exam Platform.
• Generated Content: Subject to compliance with these terms, users receive a personal, non-exclusive license to use generated test results and reports for personal and educational purposes.`
        },
        {
            icon: RefreshCw,
            title: '6. Service Availability & Modifications',
            content: `• Service Updates: We continuously update and refine our feature set, AI models, and interface.
• Downtime & Maintenance: Scheduled maintenance or unforeseen outages may occur. We endeavor to maintain high availability but do not guarantee uninterrupted uptime.`
        },
        {
            icon: HelpCircle,
            title: '7. Limitation of Liability & Termination',
            content: `• Disclaimer: The platform is provided "as is" and "as available" without warranties of any kind.
• Termination: We reserve the right to suspend or terminate accounts that violate these Terms of Service.
• Contact: For questions regarding these terms, please contact us at support@aiexamplatform.com.`
        }
    ];

    return (
        <>
            <Helmet>
                <title>Terms of Service - AI Exam Platform</title>
                <meta name="description" content="Terms of Service for AI Exam Platform. Review the rules, user responsibilities, and terms governing your use of our AI assessment platform." />
            </Helmet>

            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 mb-4 border border-indigo-500/20">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-extrabold gradient-text tracking-tight mb-3">
                        Terms of Service
                    </h1>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                        Last Updated: {lastUpdated}
                    </p>
                    <p className="mt-4 text-base max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        Welcome to AI Exam Platform. Please read these Terms of Service carefully before using our website and services.
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

export default TermsOfServicePage;
