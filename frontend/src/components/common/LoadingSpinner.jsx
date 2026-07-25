import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border-[3px]',
        md: 'w-12 h-12 border-4',
        lg: 'w-16 h-16 border-[5px]',
        xl: 'w-24 h-24 border-[6px]',
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div 
                className={`rounded-full animate-spin transition-colors duration-300 ${sizeClasses[size]}`}
                style={{
                    borderStyle: 'solid',
                    borderColor: 'var(--border-primary)',
                    borderTopColor: 'var(--brand-primary)',
                    borderRightColor: 'var(--brand-secondary)',
                    filter: 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.45))',
                }}
            />
            <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold tracking-wider uppercase animate-pulse">
                Loading...
            </p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-sm z-50 transition-colors duration-300">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;