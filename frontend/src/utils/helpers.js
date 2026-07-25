// Date formatting
export const formatDate = (date, format = 'MMM DD, YYYY') => {
    if (!date) return 'N/A';
    const d = new Date(date);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    return d.toLocaleDateString('en-US', options);
};

export const formatTime = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return `${formatDate(date)} ${formatTime(date)}`;
};

export const getTimeAgo = (date) => {
    if (!date) return 'N/A';
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
};

// String formatting
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str, length = 50) => {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
};

export const slugify = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Number formatting
export const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
};

export const formatPercentage = (num) => {
    if (!num) return '0%';
    return `${num.toFixed(1)}%`;
};

export const formatScore = (score, total) => {
    return `${score}/${total}`;
};

// Color utilities
export const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 75) return 'text-blue-500';
    if (percentage >= 60) return 'text-yellow-500';
    if (percentage >= 40) return 'text-orange-500';
    return 'text-red-500';
};

export const getPerformanceBadge = (percentage) => {
    if (percentage >= 90) {
        return { label: 'Excellent', color: 'bg-green-100 text-green-700' };
    }
    if (percentage >= 75) {
        return { label: 'Good', color: 'bg-blue-100 text-blue-700' };
    }
    if (percentage >= 60) {
        return { label: 'Average', color: 'bg-yellow-100 text-yellow-700' };
    }
    if (percentage >= 40) {
        return { label: 'Below Average', color: 'bg-orange-100 text-orange-700' };
    }
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-700' };
};

// Array utilities
export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
};

export const sortBy = (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

export const unique = (array) => {
    return [...new Set(array)];
};

// Object utilities
export const pick = (obj, keys) => {
    return keys.reduce((result, key) => {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
        return result;
    }, {});
};

export const omit = (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
};

// File utilities
export const downloadFile = (data, filename, type = 'application/pdf') => {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export const getFileExtension = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts[parts.length - 1];
};

// DOM utilities
export const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Device detection
export const isMobile = () => {
    return window.innerWidth < 768;
};

export const isTablet = () => {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
};

export const isDesktop = () => {
    return window.innerWidth >= 1024;
};

// Browser storage
export const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage set error:', error);
        }
    },
    remove: (key) => {
        localStorage.removeItem(key);
    },
    clear: () => {
        localStorage.clear();
    }
};