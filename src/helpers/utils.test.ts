import crypto from 'crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateRandom, hashPassword } from './utils';

describe('utils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('hashPassword', () => {
    it('should generate a string hash', async () => {
      const password = 'mySecretPassword';
      const salt = 'randomSalt';
      const hash = await hashPassword(password, salt);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should return the correct hash for a given password and salt', async () => {
      const password = 'mySecretPassword';
      const salt = 'randomSalt';
      const hash = await hashPassword(password, salt);

      const expectedHash = await new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
          if (err) reject(err);
          else resolve(derivedKey.toString('hex'));
        });
      });

      expect(hash).toBe(expectedHash);
    });

    it('should produce different hashes for different passwords with the same salt', async () => {
      const salt = 'randomSalt';
      const hash1 = await hashPassword('password123', salt);
      const hash2 = await hashPassword('password456', salt);

      expect(hash1).not.toBe(hash2);
    });

    it('should reject if crypto.scrypt throws an error', async () => {
      // Mock crypto.scrypt to simulate an error
      vi.spyOn(crypto, 'scrypt').mockImplementationOnce((password, salt, keylen, callback) => {
        (callback as Function)(new Error('Simulated scrypt error'), Buffer.from(''));
      });

      await expect(hashPassword('password', 'salt')).rejects.toThrow('Simulated scrypt error');
    });
  });

  describe('generateRandom', () => {
    it('should generate a 32-character hex string by default (16 bytes)', () => {
      const randomString = generateRandom();

      expect(typeof randomString).toBe('string');
      expect(randomString).toHaveLength(32); // 16 bytes = 32 hex characters
      expect(/^[0-9a-f]+$/i.test(randomString)).toBe(true); // Should be valid hex
    });

    it('should respect the length parameter', () => {
      const length = 8;
      const randomString = generateRandom(length);

      expect(randomString).toHaveLength(length * 2); // 8 bytes = 16 hex characters
    });

    it('should generate unique values on subsequent calls', () => {
      const randomString1 = generateRandom();
      const randomString2 = generateRandom();

      expect(randomString1).not.toBe(randomString2);
    });
  });
});
