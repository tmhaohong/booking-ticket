import { describe, expect, it } from 'vitest';
import type { Translator } from '@/types/type';
import getUserSchema, { getServerUserSchema } from './user';

describe('User Schemas', () => {
  const mockT: Translator = (key: string) => key;

  describe('getUserSchema (Client Schema)', () => {
    const schema = getUserSchema(mockT);

    it('should validate successfully for a perfect user payload', async () => {
      const validPayload = {
        fullName: 'Trần Mạnh Hào',
        email: 'hao@example.com',
        phoneNumber: '0912345678',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreement: true,
      };

      await expect(schema.validate(validPayload)).resolves.toEqual(validPayload);
    });

    it('should throw an error if agreement is false', async () => {
      const invalidPayload = {
        fullName: 'Trần Mạnh Hào',
        email: 'hao@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreement: false, // Invalid
      };

      await expect(schema.validate(invalidPayload)).rejects.toThrow('error.agreement.required');
    });

    it('should throw an error if passwords do not match', async () => {
      const invalidPayload = {
        fullName: 'Trần Mạnh Hào',
        email: 'hao@example.com',
        password: 'Password123',
        confirmPassword: 'Password456',
        agreement: true,
      };

      await expect(schema.validate(invalidPayload)).rejects.toThrow('error.confirmPassword.oneOf');
    });

    it('should throw an error for invalid email', async () => {
      const invalidPayload = {
        fullName: 'Trần Mạnh Hào',
        email: 'not-an-email',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreement: true,
      };

      await expect(schema.validate(invalidPayload)).rejects.toThrow('error.email.email');
    });
  });

  describe('getServerUserSchema', () => {
    const schema = getServerUserSchema(mockT);

    it('should successfully validate omitting confirmPassword and agreement', async () => {
      const serverPayload = {
        fullName: 'Trần Mạnh Hào',
        email: 'hao@example.com',
        password: 'Password123',
      };

      await expect(schema.validate(serverPayload)).resolves.toEqual(serverPayload);
    });

    it('should strip away confirmPassword and agreement if provided', async () => {
      const dirtyPayload = {
        fullName: 'Trần Mạnh Hào',
        email: 'hao@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreement: true,
      };

      const result = await schema.validate(dirtyPayload, { stripUnknown: true });
      expect(result).not.toHaveProperty('confirmPassword');
      expect(result).not.toHaveProperty('agreement');
      expect(result).toHaveProperty('fullName');
    });
  });
});
