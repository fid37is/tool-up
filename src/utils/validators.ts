/**
 * Validation utility functions for form inputs and data integrity
 */

/**
 * Validates email format
 * @param email - The email address to validate
 * @returns Boolean indicating if the email format is valid
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param password - The password to validate
 * @param minLength - Minimum required length (default: 8)
 * @returns Boolean indicating if the password meets strength requirements
 */
export const isStrongPassword = (password: string, minLength: number = 8): boolean => {
    if (password.length < minLength) return false;

    // Check for at least one uppercase letter
    const hasUppercase = /[A-Z]/.test(password);

    // Check for at least one lowercase letter
    const hasLowercase = /[a-z]/.test(password);

    // Check for at least one number
    const hasNumber = /[0-9]/.test(password);

    // Check for at least one special character
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
};

/**
 * Validates phone number format
 * @param phone - The phone number to validate
 * @returns Boolean indicating if the phone number format is valid
 */
export const isValidPhone = (phone: string): boolean => {
    // This is a simple validation that allows different formats
    // Customize based on your country/region requirements
    const cleanedPhone = phone.replace(/\D/g, '');
    return cleanedPhone.length >= 10 && cleanedPhone.length <= 15;
};

/**
 * Validates if a string is not empty after trimming
 * @param value - The string to check
 * @returns Boolean indicating if the string is not empty
 */
export const isNotEmpty = (value: string): boolean => {
    return value.trim().length > 0;
};

/**
 * Validates if a number is within a specified range
 * @param value - The number to validate
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Boolean indicating if the number is within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
};

/**
 * Validates postal/zip code format
 * @param postalCode - The postal code to validate
 * @param countryCode - The ISO country code (default: 'US')
 * @returns Boolean indicating if the postal code format is valid for the given country
 */
export const isValidPostalCode = (postalCode: string, countryCode: string = 'US'): boolean => {
    // Different regex patterns based on country
    const patterns: Record<string, RegExp> = {
        'US': /^\d{5}(-\d{4})?$/,
        'CA': /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
        'UK': /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
        // Add more country patterns as needed
    };

    const pattern = patterns[countryCode] || patterns['US'];
    return pattern.test(postalCode);
};

/**
 * Validates credit card number using Luhn algorithm
 * @param cardNumber - The credit card number to validate
 * @returns Boolean indicating if the credit card number is valid
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
    // Remove all non-digit characters
    const digits = cardNumber.replace(/\D/g, '');

    if (digits.length < 13 || digits.length > 19) {
        return false;
    }

    // Luhn algorithm implementation
    let sum = 0;
    let shouldDouble = false;

    // Loop through digits from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
};

/**
 * Validates URL format
 * @param url - The URL to validate
 * @returns Boolean indicating if the URL format is valid
 */
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Validates if a date is in the future
 * @param date - The date to validate
 * @returns Boolean indicating if the date is in the future
 */
export const isFutureDate = (date: Date): boolean => {
    const now = new Date();
    return date > now;
};

/**
 * Validates if a string matches a specific pattern
 * @param value - The string to validate
 * @param pattern - The RegExp pattern to match against
 * @returns Boolean indicating if the string matches the pattern
 */
export const matchesPattern = (value: string, pattern: RegExp): boolean => {
    return pattern.test(value);
};