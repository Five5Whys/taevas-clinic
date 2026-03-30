import { format, parseISO } from 'date-fns';
import { User } from '@/types';

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
 * Parse error message from API response
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    if ('data' in error && error.data && typeof error.data === 'object') {
      if ('message' in error.data && typeof error.data.message === 'string') {
        return error.data.message;
      }
    }
    if ('response' in error && error.response && typeof error.response === 'object') {
      if ('data' in error.response && error.response.data) {
        if (
          typeof error.response.data === 'object' &&
          'message' in error.response.data &&
          typeof error.response.data.message === 'string'
        ) {
          return error.response.data.message;
        }
      }
    }
  }
  return 'An error occurred';
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
