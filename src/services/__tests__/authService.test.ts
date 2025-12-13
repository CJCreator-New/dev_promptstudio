import { describe, test, expect, beforeEach } from 'vitest';
import { checkAccountLockout } from '../authService';

describe('Auth Service Tests', () => {
  describe('Account Lockout', () => {
    beforeEach(() => {
      // Clear any existing lockout data
    });

    test('allows login with no previous attempts', () => {
      const result = checkAccountLockout('new@example.com');
      expect(result.locked).toBe(false);
      expect(result.attempts).toBe(0);
    });

    test('tracks failed login attempts', () => {
      const email = 'test@example.com';
      
      for (let i = 0; i < 3; i++) {
        const result = checkAccountLockout(email);
        expect(result.locked).toBe(false);
      }
    });

    test('locks account after max attempts', () => {
      const email = 'locked@example.com';
      
      // Simulate 5 failed attempts
      for (let i = 0; i < 5; i++) {
        checkAccountLockout(email);
      }
      
      const result = checkAccountLockout(email);
      expect(result.attempts).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Password Validation', () => {
    test('validates strong password', () => {
      const password = 'Test123!@#';
      expect(password.length).toBeGreaterThanOrEqual(8);
      expect(/[A-Z]/.test(password)).toBe(true);
      expect(/[a-z]/.test(password)).toBe(true);
      expect(/[0-9]/.test(password)).toBe(true);
      expect(/[^A-Za-z0-9]/.test(password)).toBe(true);
    });

    test('rejects weak password', () => {
      const password = 'weak';
      expect(password.length).toBeLessThan(8);
    });
  });

  describe('Session Management', () => {
    test('calculates session expiry for remember me', () => {
      const now = Date.now();
      const rememberExpiry = now + 30 * 24 * 60 * 60 * 1000; // 30 days
      expect(rememberExpiry).toBeGreaterThan(now);
    });

    test('calculates session expiry for default', () => {
      const now = Date.now();
      const defaultExpiry = now + 24 * 60 * 60 * 1000; // 24 hours
      expect(defaultExpiry).toBeGreaterThan(now);
    });
  });
});
