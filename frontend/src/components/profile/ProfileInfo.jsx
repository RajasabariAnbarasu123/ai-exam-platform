import React from 'react';
import { 
    User, 
    Mail, 
    Calendar, 
    Award, 
    Shield,
    CheckCircle,
    XCircle
} from 'lucide-react';

const ProfileInfo = ({ profile }) => {
    const infoItems = [
        {
            label: 'Full Name',
            value: profile.fullName,
            icon: User,
            color: 'text-indigo-500'
        },
        {
            label: 'Email Address',
            value: profile.email,
            icon: Mail,
            color: 'text-blue-500'
        },
        {
            label: 'Member Since',
            value: new Date(profile.joinedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            }),
            icon: Calendar,
            color: 'text-green-500'
        },
        {
            label: 'Role',
            value: profile.role || 'User',
            icon: Shield,
            color: 'text-purple-500'
        },
        {
            label: 'Total Exams',
            value: profile.totalExams || 0,
            icon: Award,
            color: 'text-yellow-500'
        },
        {
            label: 'Email Verified',
            value: profile.emailVerified ? 'Yes' : 'No',
            icon: profile.emailVerified ? CheckCircle : XCircle,
            color: profile.emailVerified ? 'text-green-500' : 'text-red-500'
        }
    ];

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Profile Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infoItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg bg-white dark:bg-gray-700 ${item.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.label}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {profile.bio && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bio</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {profile.bio}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfileInfo;