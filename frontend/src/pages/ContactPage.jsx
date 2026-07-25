import React, { useState, useEffect } from 'react';
import { 
    Mail, 
    Phone, 
    MapPin, 
    Send, 
    Loader2,
    CheckCircle,
    MessageCircle,
    Clock
} from 'lucide-react';
import { showToast } from '../components/common/ToastNotifications';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const ContactPage = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.fullName || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await api.post('/public/contact', formData);
            setSubmitted(true);
            showToast.success('Message sent successfully!');
            setFormData({
                name: user?.fullName || '',
                email: user?.email || '',
                subject: '',
                message: ''
            });
            setTimeout(() => setSubmitted(false), 3000);
        } catch (error) {
            showToast.error(error.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: 'rajasabaria3184@gmail.com',
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            icon: Phone,
            label: 'Phone',
            value: '+91 9876543210',
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            icon: MapPin,
            label: 'Address',
            value: '123 MK Street, Salem, TamilNadu',
            color: 'text-red-500',
            bg: 'bg-red-50 dark:bg-red-900/20'
        },
        {
            icon: Clock,
            label: 'Working Hours',
            value: 'Mon-Fri: 9:00 AM - 6:00 PM',
            color: 'text-purple-500',
            bg: 'bg-purple-50 dark:bg-purple-900/20'
        }
    ];

    if (submitted) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="glass-card p-12 text-center max-w-md mx-auto">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Message Sent!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Thank you for reaching out. We'll get back to you soon.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold gradient-text mb-4">
                    Contact Us
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Form */}
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                        Send a Message
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Your Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center justify-between">
                                <span>Email Address</span>
                                {user && <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">Registered Account</span>}
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800"
                                placeholder="john@example.com"
                                required
                                disabled={!!user}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="How can we help?"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                className="form-input"
                                placeholder="Tell us about your inquiry..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            <span>{loading ? 'Sending...' : 'Send Message'}</span>
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                            Get in Touch
                        </h2>
                        
                        <div className="space-y-4">
                            {contactInfo.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={index} className={`p-4 rounded-xl ${item.bg} flex items-start space-x-4`}>
                                        <div className={`p-2 rounded-lg bg-white dark:bg-gray-700 ${item.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {item.label}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="glass-card p-8 text-center">
                        <MessageCircle className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Quick Response
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            We typically respond within 24 hours during business days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;