// ✅ Validators Tests
const {
  validateEmail,
  validateMobileNumber,
  validateAadhar,
  validateUsername
} = require('../utils/validators');

describe('Validators Tests', () => {
  describe('validatePassword', () => {
    it('should accept strong password', () => {
      const result = validatePassword('StrongPass@123');
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('weakpass@123');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('uppercase');
    });

    it('should reject password without number', () => {
      const result = validatePassword('WeakPass@abc');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('number');
    });

    it('should reject password without special character', () => {
      const result = validatePassword('WeakPass123');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('special character');
    });

    it('should reject password less than 8 characters', () => {
      const result = validatePassword('Pass@1');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should accept valid email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@domain.co.in')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid.email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('validateMobileNumber', () => {
    it('should accept valid Indian mobile', () => {
      expect(validateMobileNumber('9876543210')).toBe(true);
      expect(validateMobileNumber('8765432109')).toBe(true);
      expect(validateMobileNumber('7654321098')).toBe(true);
    });

    it('should reject invalid mobile', () => {
      expect(validateMobileNumber('123456789')).toBe(false); // Too short
      expect(validateMobileNumber('12345678901')).toBe(false); // Wrong start digit
      expect(validateMobileNumber('abcdefghij')).toBe(false); // Non-numeric
    });

    // new username tests
    describe('validateUsername', () => {
      it('should accept valid username', () => {
        expect(validateUsername('user_123')).toBe(true);
        expect(validateUsername('Admin1')).toBe(true);
      });
      it('should reject too short or invalid characters', () => {
        expect(validateUsername('ab')).toBe(false); // too short
        expect(validateUsername('user!@#')).toBe(false); // invalid chars
        expect(validateUsername('')).toBe(false);
      });
    });
  });

    it('should accept valid 12-digit Aadhar', () => {
      expect(validateAadhar('123456789012')).toBe(true);
    });

    it('should reject invalid Aadhar', () => {
      expect(validateAadhar('12345678901')).toBe(false); // 11 digits
      expect(validateAadhar('1234567890123')).toBe(false); // 13 digits
      expect(validateAadhar('abcdefghijkl')).toBe(false); // Non-numeric
    });
  });
});
