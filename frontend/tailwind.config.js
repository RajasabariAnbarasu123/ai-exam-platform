/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4F46E5',
                    light: '#818CF8',
                    dark: '#4338CA',
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    300: '#A5B4FC',
                    400: '#818CF8',
                    500: '#4F46E5',
                    600: '#4338CA',
                    700: '#3730A3',
                    800: '#312E81',
                    900: '#1E1B4B'
                },
                secondary: {
                    DEFAULT: '#7C3AED',
                    light: '#A78BFA',
                    dark: '#6D28D9',
                    50: '#F5F3FF',
                    100: '#EDE9FE',
                    200: '#DDD6FE',
                    300: '#C4B5FD',
                    400: '#A78BFA',
                    500: '#7C3AED',
                    600: '#6D28D9',
                    700: '#5B21B6',
                    800: '#4C1D95',
                    900: '#2E1065'
                },
                success: {
                    DEFAULT: '#10B981',
                    light: '#34D399',
                    dark: '#059669'
                },
                warning: {
                    DEFAULT: '#F59E0B',
                    light: '#FBBF24',
                    dark: '#D97706'
                },
                danger: {
                    DEFAULT: '#EF4444',
                    light: '#F87171',
                    dark: '#DC2626'
                },
                info: {
                    DEFAULT: '#3B82F6',
                    light: '#60A5FA',
                    dark: '#2563EB'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['Fira Code', 'monospace']
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '120': '30rem',
                '128': '32rem',
                '144': '36rem'
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem'
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
                'soft': '0 4px 20px rgba(0, 0, 0, 0.06)',
                'medium': '0 8px 30px rgba(0, 0, 0, 0.12)',
                'hard': '0 16px 48px rgba(0, 0, 0, 0.18)'
            },
            backdropBlur: {
                'xs': '2px',
                'sm': '4px',
                'md': '8px',
                'lg': '12px',
                'xl': '16px'
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                'gradient-success': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                'gradient-danger': 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                'gradient-warning': 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'fade-in-up': 'fadeInUp 0.5s ease-in-out',
                'fade-in-down': 'fadeInDown 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-in-out',
                'slide-down': 'slideDown 0.3s ease-in-out',
                'scale': 'scale 0.3s ease-in-out',
                'pulse-slow': 'pulse 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'shimmer': 'shimmer 1.5s ease-in-out infinite',
                'spin-slow': 'spin 2s linear infinite'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                slideDown: {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                scale: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' }
                }
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/line-clamp')
    ],
    safelist: [
        'animate-fade-in',
        'animate-fade-in-up',
        'animate-slide-up',
        'animate-scale',
        'animate-pulse-slow',
        'animate-float',
        'bg-gradient-primary',
        'bg-gradient-secondary',
        'bg-gradient-success',
        'bg-gradient-danger',
        'bg-gradient-warning',
        'text-gradient'
    ]
};