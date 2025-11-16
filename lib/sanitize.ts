import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize user input to prevent XSS attacks
 * Removes all HTML tags and dangerous characters
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  
  // Remove all HTML tags and scripts
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
  });
  
  // Trim whitespace
  return cleaned.trim();
}

/**
 * Sanitize HTML content (for emails, etc.)
 * Allows safe HTML tags only
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  // Allow only safe HTML tags
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'div', 'span', 'table', 'tr', 'td', 'th'
    ],
    ALLOWED_ATTR: ['href', 'target', 'style'],
    ALLOW_DATA_ATTR: false,
  });
  
  return cleaned;
}

/**
 * Validate and sanitize email addresses
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  // Remove any HTML/scripts
  const cleaned = sanitizeText(email);
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned)) {
    throw new Error('Invalid email format');
  }
  
  return cleaned.toLowerCase();
}

/**
 * Sanitize numbers (prevent NaN, Infinity, etc.)
 */
export function sanitizeNumber(input: string | number, min?: number, max?: number): number {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  
  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Invalid number');
  }
  
  if (min !== undefined && num < min) {
    throw new Error(`Number must be at least ${min}`);
  }
  
  if (max !== undefined && num > max) {
    throw new Error(`Number must be at most ${max}`);
  }
  
  return num;
}

/**
 * Sanitize phone numbers
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Validate length (US phone numbers are 10 digits)
  if (digits.length !== 10) {
    throw new Error('Invalid phone number');
  }
  
  // Format as (555) 123-4567
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/**
 * Sanitize zip codes
 */
export function sanitizeZipCode(zip: string): string {
  if (!zip) return '';
  
  // Remove all non-digit characters
  const digits = zip.replace(/\D/g, '');
  
  // Validate length (US zip codes are 5 digits)
  if (digits.length !== 5) {
    throw new Error('Invalid zip code');
  }
  
  return digits;
}