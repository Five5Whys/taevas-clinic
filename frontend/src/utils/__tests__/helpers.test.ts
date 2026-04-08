import {
  formatPhoneNumber,
  formatDate,
  formatTime,
  formatDateTime,
  getUserInitials,
  getFullName,
  truncateText,
  getStatusColor,
  getErrorMessage,
  hasRole,
  capitalize,
  calculateWaitTime,
  formatMinutesToTime,
  debounce,
} from '../helpers';
import type { User } from '@/types';

// ── formatPhoneNumber ──────────────────────────────────────────────
describe('formatPhoneNumber', () => {
  it('formats a 10-digit number with +91 prefix', () => {
    expect(formatPhoneNumber('9876543210')).toBe('+91 98765 43210');
  });

  it('formats a 12-digit number starting with 91', () => {
    expect(formatPhoneNumber('919876543210')).toBe('+91 98765 43210');
  });

  it('returns the original string for non-standard lengths', () => {
    expect(formatPhoneNumber('12345')).toBe('12345');
  });

  it('returns the original string when empty', () => {
    expect(formatPhoneNumber('')).toBe('');
  });

  it('strips non-digit characters before formatting', () => {
    expect(formatPhoneNumber('987-654-3210')).toBe('+91 98765 43210');
  });
});

// ── formatDate / formatTime / formatDateTime ───────────────────────
describe('formatDate', () => {
  it('formats an ISO date string with default format', () => {
    expect(formatDate('2024-03-15')).toBe('15 Mar 2024');
  });

  it('returns empty string on invalid input', () => {
    expect(formatDate('not-a-date')).toBe('');
  });
});

describe('formatTime', () => {
  it('formats an ISO datetime to HH:mm', () => {
    expect(formatTime('2024-03-15T14:30:00')).toBe('14:30');
  });
});

describe('formatDateTime', () => {
  it('formats an ISO datetime with default format', () => {
    expect(formatDateTime('2024-03-15T14:30:00')).toBe('15 Mar 2024 14:30');
  });
});

// ── getUserInitials ────────────────────────────────────────────────
describe('getUserInitials', () => {
  const makeUser = (first?: string, last?: string): User => ({
    id: '1',
    phone: '9876543210',
    role: 'DOCTOR',
    firstName: first,
    lastName: last,
  });

  it('returns both initials when first and last name exist', () => {
    expect(getUserInitials(makeUser('John', 'Doe'))).toBe('JD');
  });

  it('returns single initial when only firstName exists', () => {
    expect(getUserInitials(makeUser('John'))).toBe('J');
  });

  it('returns ? when user has no names', () => {
    expect(getUserInitials(makeUser())).toBe('?');
  });

  it('returns ? for null user', () => {
    expect(getUserInitials(null)).toBe('?');
  });
});

// ── getFullName ────────────────────────────────────────────────────
describe('getFullName', () => {
  const makeUser = (first?: string, last?: string): User => ({
    id: '1',
    phone: '9876543210',
    role: 'DOCTOR',
    firstName: first,
    lastName: last,
  });

  it('returns full name when both parts exist', () => {
    expect(getFullName(makeUser('John', 'Doe'))).toBe('John Doe');
  });

  it('returns first name only when last name is missing', () => {
    expect(getFullName(makeUser('John'))).toBe('John');
  });

  it('returns "User" for null user', () => {
    expect(getFullName(null)).toBe('User');
  });
});

// ── truncateText ───────────────────────────────────────────────────
describe('truncateText', () => {
  it('returns original text when shorter than limit', () => {
    expect(truncateText('Hi', 10)).toBe('Hi');
  });

  it('returns original text when exactly at limit', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });

  it('truncates with ellipsis when over limit', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
  });
});

// ── getStatusColor ─────────────────────────────────────────────────
describe('getStatusColor', () => {
  it('maps ACTIVE to success', () => {
    expect(getStatusColor('ACTIVE')).toBe('success');
  });

  it('maps COMPLETED to success', () => {
    expect(getStatusColor('COMPLETED')).toBe('success');
  });

  it('maps SCHEDULED to info', () => {
    expect(getStatusColor('SCHEDULED')).toBe('info');
  });

  it('maps PENDING to warning', () => {
    expect(getStatusColor('PENDING')).toBe('warning');
  });

  it('maps CANCELLED to error', () => {
    expect(getStatusColor('CANCELLED')).toBe('error');
  });

  it('defaults to info for unknown status', () => {
    expect(getStatusColor('UNKNOWN')).toBe('info');
  });
});

// ── getErrorMessage ────────────────────────────────────────────────
describe('getErrorMessage', () => {
  it('returns the string directly when error is a string', () => {
    expect(getErrorMessage('Something failed')).toBe('Something failed');
  });

  it('extracts message from an object with message property', () => {
    expect(getErrorMessage({ message: 'Bad request' })).toBe('Bad request');
  });

  it('extracts message from axios-style response.data.message', () => {
    const axiosError = {
      response: { data: { message: 'Unauthorized' } },
    };
    expect(getErrorMessage(axiosError)).toBe('Unauthorized');
  });

  it('returns default message for unknown error shapes', () => {
    expect(getErrorMessage(42)).toBe('Something went wrong. Please try again.');
    expect(getErrorMessage(null)).toBe('Something went wrong. Please try again.');
    expect(getErrorMessage(undefined)).toBe('Something went wrong. Please try again.');
  });
});

// ── hasRole ────────────────────────────────────────────────────────
describe('hasRole', () => {
  it('returns true when single role matches', () => {
    expect(hasRole('DOCTOR', 'DOCTOR')).toBe(true);
  });

  it('returns false when single role does not match', () => {
    expect(hasRole('DOCTOR', 'PATIENT')).toBe(false);
  });

  it('returns true when role is in the allowed array', () => {
    expect(hasRole('DOCTOR', ['DOCTOR', 'SUPERADMIN'])).toBe(true);
  });

  it('returns false when role is not in the allowed array', () => {
    expect(hasRole('PATIENT', ['DOCTOR', 'SUPERADMIN'])).toBe(false);
  });

  it('returns false when userRole is null', () => {
    expect(hasRole(null, 'DOCTOR')).toBe(false);
  });
});

// ── capitalize ─────────────────────────────────────────────────────
describe('capitalize', () => {
  it('capitalizes first letter and lowercases the rest', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('returns empty string for empty input', () => {
    expect(capitalize('')).toBe('');
  });

  it('handles already-capitalized string', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('lowercases remaining characters', () => {
    expect(capitalize('hELLO')).toBe('Hello');
  });
});

// ── calculateWaitTime ──────────────────────────────────────────────
describe('calculateWaitTime', () => {
  it('returns positive minutes from a past timestamp', () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    expect(calculateWaitTime(thirtyMinutesAgo)).toBe(30);
  });

  it('returns 0 for a future timestamp', () => {
    const future = new Date(Date.now() + 60 * 60 * 1000);
    expect(calculateWaitTime(future)).toBe(0);
  });
});

// ── formatMinutesToTime ────────────────────────────────────────────
describe('formatMinutesToTime', () => {
  it('returns minutes only when under 60', () => {
    expect(formatMinutesToTime(45)).toBe('45m');
  });

  it('returns hours only when exactly 60', () => {
    expect(formatMinutesToTime(60)).toBe('1h');
  });

  it('returns hours and minutes when over 60', () => {
    expect(formatMinutesToTime(90)).toBe('1h 30m');
  });

  it('returns hours only when evenly divisible', () => {
    expect(formatMinutesToTime(120)).toBe('2h');
  });
});

// ── debounce ───────────────────────────────────────────────────────
describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls the function after the wait period', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets timer on rapid calls and only fires once', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    jest.advanceTimersByTime(100);
    debounced();
    jest.advanceTimersByTime(100);
    debounced();
    jest.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
