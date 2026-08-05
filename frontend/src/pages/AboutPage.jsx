import React from 'react';
import { 
    Target, 
    Eye, 
    Heart, 
    Users,
    Award,
    TrendingUp,
    Shield,
    Sparkles
} from 'lucide-react';

const AboutPage = () => {
    const values = [
        {
            icon: Target,
            title: 'Mission',
            description: 'To revolutionize online examinations through AI-powered technology',
            color: 'text-blue-500'
        },
        {
            icon: Eye,
            title: 'Vision',
            description: 'To make quality education accessible through smart assessment tools',
            color: 'text-purple-500'
        },
        {
            icon: Heart,
            title: 'Core Values',
            description: 'Innovation, Integrity, and Excellence in everything we do',
            color: 'text-red-500'
        }
    ];

    const team = [
        {
            name: 'Rajasabari Anbarasu',
            role: 'CEO & Founder',
            image: 'https://ui-avatars.com/api/?name=Rajasabari+Anbarasu&size=150'
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Hero */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold gradient-text mb-4">
                    About AI Exam Platform
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    We're on a mission to transform how people learn and assess their knowledge through intelligent, adaptive AI technology.
                </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {values.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="glass-card p-6 text-center">
                            <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-700 inline-block mb-4 ${item.color}`}>
                                <Icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {item.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Team */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                    Meet Our Team
                </h2>
                <div className="flex flex-wrap justify-center gap-6">
                    {team.map((member, index) => (
                        <div key={index} className="glass-card p-6 text-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[280px]">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-24 h-24 rounded-full mx-auto mb-4"
                            />
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                {member.name}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
