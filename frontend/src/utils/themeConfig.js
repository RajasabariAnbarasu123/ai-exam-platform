// Theme configuration
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

export const themeConfig = {
    light: {
        colors: {
            primary: '#4F46E5',
            secondary: '#7C3AED',
            success: '#10B981',
            warning: '#F59E0B',
            danger: '#EF4444',
            background: '#FFFFFF',
            surface: '#F3F4F6',
            text: '#111827',
            textSecondary: '#6B7280',
            border: '#E5E7EB'
        },
        shadows: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }
    },
    dark: {
        colors: {
            primary: '#6366F1',
            secondary: '#8B5CF6',
            success: '#34D399',
            warning: '#FBBF24',
            danger: '#F87171',
            background: '#111827',
            surface: '#1F2937',
            text: '#F9FAFB',
            textSecondary: '#9CA3AF',
            border: '#374151'
        },
        shadows: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
        }
    }
};

// Get theme colors
export const getThemeColors = (theme = 'light') => {
    return themeConfig[theme]?.colors || themeConfig.light.colors;
};

// Get theme shadows
export const getThemeShadows = (theme = 'light') => {
    return themeConfig[theme]?.shadows || themeConfig.light.shadows;
};

// CSS variables for theme
export const getThemeCSSVariables = (theme = 'light') => {
    const colors = getThemeColors(theme);
    const shadows = getThemeShadows(theme);
    
    return {
        '--color-primary': colors.primary,
        '--color-secondary': colors.secondary,
        '--color-success': colors.success,
        '--color-warning': colors.warning,
        '--color-danger': colors.danger,
        '--color-background': colors.background,
        '--color-surface': colors.surface,
        '--color-text': colors.text,
        '--color-text-secondary': colors.textSecondary,
        '--color-border': colors.border,
        '--shadow-sm': shadows.sm,
        '--shadow-md': shadows.md,
        '--shadow-lg': shadows.lg,
        '--shadow-xl': shadows.xl
    };
};

// Theme utility functions
export const isDarkTheme = (theme) => theme === 'dark';
export const isLightTheme = (theme) => theme === 'light';

export const toggleTheme = (currentTheme) => {
    return currentTheme === 'light' ? 'dark' : 'light';
};

export const getPreferredTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};

export const applyTheme = (theme) => {
    const root = document.documentElement;
    const variables = getThemeCSSVariables(theme);
    
    Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
    
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};

// Glassmorphism styles
export const getGlassStyles = (theme = 'light') => {
    const isDark = isDarkTheme(theme);
    return {
        background: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
        boxShadow: isDark 
            ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)' 
            : '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    };
};