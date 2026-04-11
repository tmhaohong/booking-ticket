import { describe, expect, it } from 'vitest';
import { nameRegExp, phoneRegExp } from './index';

describe('Constants Regex', () => {
  describe('phoneRegExp', () => {
    it('should match valid Vietnamese phone numbers', () => {
      const validNumbers = ['0912345678', '0312345678', '0812345678', '+84912345678'];
      validNumbers.forEach((num) => {
        expect(phoneRegExp.test(num)).toBe(true);
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidNumbers = [
        '123',
        '0212345678',
        '09123456789',
        '912345678',
        '+84212345678',
        'abcdefghij',
      ];
      invalidNumbers.forEach((num) => {
        expect(phoneRegExp.test(num)).toBe(false);
      });
    });
  });

  describe('nameRegExp', () => {
    it('should match valid names with Vietnamese characters', () => {
      const validNames = ['Manh Hao', 'Trần Mạnh Hào', 'Hao 123', 'Nguyễn Thị Bé'];
      validNames.forEach((name) => {
        expect(nameRegExp.test(name)).toBe(true);
      });
    });

    it('should reject names with special characters', () => {
      const invalidNames = ['Manh Hao!', 'Trần @ Mạnh', 'Hao_123', '<script>'];
      invalidNames.forEach((name) => {
        expect(nameRegExp.test(name)).toBe(false);
      });
    });
  });
});
