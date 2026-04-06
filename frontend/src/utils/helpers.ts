import { format, parseISO } from 'date-fns';
import type { User } from '@/types';

/**
 * Format phone number to readable format
 * Input: "9876543210" -> Output: "+91 98765 43210"
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Format date to readable format
 */
export const formatDate = (date: string | Date, formatStr = 'dd MMM yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return '';
  }
};

/**
 * Format time to readable format
 */
export const formatTime = (time: string | Date, formatStr = 'HH:mm'): string => {
  try {
    const timeObj = typeof time === 'string' ? parseISO(time) : time;
    return format(timeObj, formatStr);
  } catch {
    return '';
  }
};

/**
 * Format datetime to readable format
 */
export const formatDateTime = (
  datetime: string | Date,
  formatStr = 'dd MMM yyyy HH:mm'
): string => {
  try {
    const dateObj = typeof datetime === 'string' ? parseISO(datetime) : datetime;
    return format(dateObj, formatStr);
  } catch {
    return '';
  }
};

/**
 * Get user initials from name
 */
export const getUserInitials = (user: User | null): string => {
  if (!user) return '?';
  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  if (user.firstName) {
    return user.firstName.charAt(0).toUpperCase();
  }
  return '?';
};

/**
 * Get full name from user
 */
export const getFullName = (user: User | null): string => {
  if (!user) return 'User';
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  return `${firstName} ${lastName}`.trim();
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

/**
 * Get color based on status
 */
export const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'info' => {
  const statusColors: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
    ACTIVE: 'success',
    COMPLETED: 'success',
    SCHEDULED: 'info',
    IN_PROGRESS: 'info',
    PENDING: 'warning',
    CANCELLED: 'error',
    EXPIRED: 'error',
    NO_SHOW: 'error',
    WAITING: 'info',
    IN_CONSULTATION: 'warning',
  };
  return statusColors[status] || 'info';
};

/**
 * Parse error message from API response with user-friendly mapping
 */
export const getErrorMessage = (error: unknown): string => {
  let raw = '';

  if (typeof error === 'string') {
    raw = error;
  } else if (error && typeof error === 'object') {
    // Axios error shape
    if ('response' in error && error.response && typeof error.response === 'object') {
      const resp = error.response as { status?: number; data?: { message?: string } };
      const status = resp.status;
      const msg = resp.data?.message || '';

      // HTTP status-based friendly messages
      if (status === 401) return msg || 'Invalid credentials. Please check your phone/email and password.';
      if (status === 403) return 'Access denied. You do not have permission for this action.';
      if (status === 404) return 'Account not found. Please check your details or sign up.';
      if (status === 409) return msg || 'An account with this phone/email already exists.';
      if (status === 422) return msg || 'Invalid input. Please check the form and try again.';
      if (status === 429) return 'Too many attempts. Please wait a few minutes and try again.';
      if (status === 500) return 'Server error. Please try again later.';
      if (status === 502 || status === 503) return 'Service temporarily unavailable. Please try again shortly.';
      if (msg) raw = msg;
    }
    if (!raw && 'message' in error && typeof error.message === 'string') {
      raw = error.message;
    }
    if (!raw && 'data' in error && error.data && typeof error.data === 'object') {
      if ('message' in error.data && typeof error.data.message === 'string') {
        raw = error.data.message;
      }
    }
  }

  // Map common backend messages to user-friendly text
  if (raw) return mapErrorMessage(raw);
  return 'Something went wrong. Please try again.';
};

/**
 * Map raw backend error messages to user-friendly messages
 */
const ERROR_MAP: Record<string, string> = {
  'Bad credentials': 'Incorrect password. Please try again.',
  'Invalid credentials': 'Invalid credentials. Please check your phone/email and password.',
  'User not found': 'No account found with these details. Please sign up.',
  'Account is locked': 'Account locked due to too many failed attempts. Try again in 15 minutes.',
  'Account is disabled': 'Your account has been deactivated. Contact your administrator.',
  'Token expired': 'Your session has expired. Please login again.',
  'Invalid token': 'Session invalid. Please login again.',
  'Phone number already exists': 'An account with this phone number already exists. Try logging in.',
  'Email already exists': 'An account with this email already exists. Try logging in.',
  'OTP expired': 'OTP has expired. Please request a new one.',
  'Invalid OTP': 'Invalid OTP code. Please check and try again.',
  'Max OTP retries exceeded': 'Too many failed OTP attempts. Please request a new code.',
  'Network Error': 'Unable to connect to server. Please check your internet connection.',
  'timeout of': 'Request timed out. Please check your connection and try again.',
};

const mapErrorMessage = (raw: string): string => {
  // Exact match
  if (ERROR_MAP[raw]) return ERROR_MAP[raw];
  // Partial match
  for (const [key, friendly] of Object.entries(ERROR_MAP)) {
    if (raw.toLowerCase().includes(key.toLowerCase())) return friendly;
  }
  return raw;
};

/**
 * Check if user has a specific role
 */
export const hasRole = (userRole: string | null, requiredRole: string | string[]): boolean => {
  if (!userRole) return false;
  if (typeof requiredRole === 'string') {
    return userRole === requiredRole;
  }
  return requiredRole.includes(userRole);
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Calculate wait time between two timestamps
 */
export const calculateWaitTime = (startTime: string | Date): number => {
  const now = new Date();
  const start = typeof startTime === 'string' ? parseISO(startTime) : startTime;
  const diffMs = now.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return Math.max(0, diffMins);
};

/**
 * Format minutes to readable time
 */
export const formatMinutesToTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
