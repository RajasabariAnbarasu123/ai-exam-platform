// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
    return password && password.length >= 8;
};

export const isStrongPassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@#$%^&+=]/.test(password);
    const hasMinLength = password.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;
};

export const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@#$%^&+=]/.test(password)) strength++;
    return strength;
};

export const getPasswordStrengthLabel = (strength) => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[strength] || 'Very Weak';
};

// Phone validation
export const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
};

// URL validation
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Name validation
export const isValidName = (name) => {
    return name && name.length >= 2 && name.length <= 100;
};

// Topic validation
export const isValidTopic = (topic) => {
    return topic && topic.length >= 2 && topic.length <= 100;
};

// Question count validation
export const isValidQuestionCount = (count) => {
    return count >= 5 && count <= 30;
};

// File validation
export const isValidImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return allowedTypes.includes(file.type) && file.size <= maxSize;
};

export const isValidFileSize = (file, maxSizeMB = 5) => {
    const maxSize = maxSizeMB * 1024 * 1024;
    return file.size <= maxSize;
};

export const isValidFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
};

// Form validation helpers
export const validateField = (field, value, rules) => {
    const errors = [];
    
    if (rules.required && !value) {
        errors.push(`${field} is required`);
    }
    
    if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must be at most ${rules.maxLength} characters`);
    }
    
    if (rules.email && !isValidEmail(value)) {
        errors.push('Invalid email address');
    }
    
    if (rules.password && !isValidPassword(value)) {
        errors.push('Password must be at least 8 characters');
    }
    
    if (rules.strongPassword && !isStrongPassword(value)) {
        errors.push('Password must contain uppercase, lowercase, number, and special character');
    }
    
    if (rules.confirmPassword && value !== rules.confirmPassword) {
        errors.push('Passwords do not match');
    }
    
    return errors;
};

export const validateForm = (data, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
        const fieldRules = rules[field];
        const value = data[field] || '';
        const fieldErrors = validateField(field, value, fieldRules);
        if (fieldErrors.length > 0) {
            errors[field] = fieldErrors;
        }
    });
    
    return errors;
};


// ... (previous validators code)

// Additional validation utilities
export const validateExamData = (data) => {
    const errors = {};
    
    if (!data.topic || data.topic.trim().length === 0) {
        errors.topic = 'Topic is required';
    }
    
    if (!data.difficulty) {
        errors.difficulty = 'Difficulty is required';
    }
    
    if (!data.questionType) {
        errors.questionType = 'Question type is required';
    }
    
    if (!data.numberOfQuestions || data.numberOfQuestions < 5 || data.numberOfQuestions > 30) {
        errors.numberOfQuestions = 'Number of questions must be between 5 and 30';
    }
    
    return errors;
};

export const validateProfileData = (data) => {
    const errors = {};
    
    if (!data.fullName || data.fullName.trim().length < 2) {
        errors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.email = 'Valid email is required';
    }
    
    return errors;
};

export const validateSettings = (settings) => {
    const errors = {};
    
    if (!settings.siteName || settings.siteName.trim().length === 0) {
        errors.siteName = 'Site name is required';
    }
    
    if (settings.minQuestions && settings.minQuestions < 1) {
        errors.minQuestions = 'Minimum questions must be at least 1';
    }
    
    if (settings.maxQuestions && settings.maxQuestions < settings.minQuestions) {
        errors.maxQuestions = 'Maximum questions must be greater than minimum';
    }
    
    return errors;
};

// Sanitization utilities
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
        .trim()
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[&<>"]/g, (char) => {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            };
            return map[char] || char;
        });
};

export const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeInput(value);
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value);
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
};