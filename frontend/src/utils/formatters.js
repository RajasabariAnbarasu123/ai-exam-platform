// Currency formatter
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

// Date formatters
export const dateFormatters = {
    short: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    },
    long: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    },
    time: (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    dateTime: (date) => {
        return `${dateFormatters.short(date)} ${dateFormatters.time(date)}`;
    }
};

// Number formatters
export const numberFormatters = {
    integer: (num) => {
        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0
        }).format(num);
    },
    decimal: (num, digits = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits
        }).format(num);
    },
    percentage: (num, digits = 1) => {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: digits,
            maximumFractionDigits: digits
        }).format(num / 100);
    },
    compact: (num) => {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(num);
    }
};

// Duration formatter
export const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    
    return parts.join(' ');
};

// Score formatters
export const scoreFormatters = {
    score: (score, total) => {
        return `${score}/${total}`;
    },
    percentage: (score, total) => {
        if (total === 0) return '0%';
        return `${((score / total) * 100).toFixed(1)}%`;
    },
    rating: (percentage) => {
        if (percentage >= 90) return 'Excellent';
        if (percentage >= 75) return 'Good';
        if (percentage >= 60) return 'Average';
        if (percentage >= 40) return 'Below Average';
        return 'Needs Improvement';
    }
};

// Text formatters
export const textFormatters = {
    capitalize: (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    titleCase: (str) => {
        if (!str) return '';
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },
    sentenceCase: (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    truncate: (str, length = 50, suffix = '...') => {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substring(0, length) + suffix;
    },
    slug: (str) => {
        if (!str) return '';
        return str
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
};

// File size formatter
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};