import { describe, expect, it } from 'vitest';
import type { Translator } from '@/types/type';
import getSignInSchema from './sign-in';

describe('Sign In Schema', () => {
  const mockT: Translator = (key: string) => key;
  const schema = getSignInSchema(mockT);

  it('should validate successfully with a valid email', async () => {
    const validEmailPayload = {
      email: 'test@example.com',
      password: 'Password123',
    };

    await expect(schema.validate(validEmailPayload)).resolves.toEqual(validEmailPayload);
  });

  it('should validate successfully with a valid phone number', async () => {
    const validPhonePayload = {
      email: '0912345678',
      password: 'Password123',
    };

    await expect(schema.validate(validPhonePayload)).resolves.toEqual(validPhonePayload);
  });

  it('should throw an error if email/phone field is empty', async () => {
    const invalidPayload = {
      email: '',
      password: 'Password123',
    };

    await expect(schema.validate(invalidPayload)).rejects.toThrow('error.email.required');
  });

  it('should throw an error if both email and phone formats are invalid', async () => {
    const invalidPayload = {
      email: 'invalid-email-and-not-a-phone',
      password: 'Password123',
    };

    await expect(schema.validate(invalidPayload)).rejects.toThrow('error.email.email');
  });

  it('should throw an error if password is empty', async () => {
    const invalidPayload = {
      email: 'test@example.com',
      password: '',
    };

    await expect(schema.validate(invalidPayload)).rejects.toThrow('error.password.required');
  });

  it('should strip away unknown fields if stripUnknown is used', async () => {
    const dirtyPayload = {
      email: 'test@example.com',
      password: 'Password123',
      unwanted: 'I should be stripped',
    };

    const result = await schema.validate(dirtyPayload, { stripUnknown: true });
    expect(result).not.toHaveProperty('unwanted');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('password');
  });
});
