import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ inverted = false }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const buttonStyle = {
        background: isDark
            ? 'rgba(99, 102, 241, 0.15)'
            : (inverted ? 'rgba(255, 255, 255, 0.15)' : 'rgba(79, 70, 229, 0.08)'),
        border: `1px solid ${
            isDark
                ? 'rgba(99, 102, 241, 0.25)'
                : (inverted ? 'rgba(255, 255, 255, 0.3)' : 'rgba(79, 70, 229, 0.15)')
        }`,
        boxShadow: isDark ? '0 0 12px rgba(99, 102, 241, 0.2)' : 'none',
    };

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            style={buttonStyle}
        >
            <span className="sr-only">
                {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            </span>
            {isDark ? (
                <Sun
                    className="w-4 h-4 transition-all duration-300"
                    style={{ color: '#FBBF24' }}
                />
            ) : (
                <Moon
                    className="w-4 h-4 transition-all duration-300"
                    style={{ color: inverted ? '#FFFFFF' : '#4F46E5' }}
                />
            )}
        </button>
    );
};

export default ThemeToggle;