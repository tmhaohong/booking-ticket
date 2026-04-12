import * as nextI18NextServer from 'next-i18next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createUserAction, signInAction } from './index';
import auth from '@/helpers/auth';
import log from '@/helpers/log';
import prisma from '@/infrastructure/database/prisma';

// Mock dependencies
vi.mock('@/infrastructure/database/prisma', () => ({
  default: {
    user: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/helpers/auth', () => ({
  default: {
    api: {
      signUpEmail: vi.fn(),
      signInEmail: vi.fn(),
    },
  },
}));

vi.mock('@/helpers/log', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(() => 'mock-error-event-id'),
  },
}));

vi.mock('next-i18next/server', () => ({
  getT: vi.fn(),
}));

const { mockCookieStore } = vi.hoisted(() => ({
  mockCookieStore: {
    set: vi.fn(),
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({}),
  cookies: vi.fn().mockResolvedValue(mockCookieStore),
}));

describe('User Server Actions', () => {
  const mockT = vi.fn((key: string) => key);

  beforeEach(() => {
    vi.clearAllMocks();
    (nextI18NextServer.getT as any).mockResolvedValue({ t: mockT });
  });

  describe('createUserAction', () => {
    const validSignupPayload = {
      fullName: 'Trần Mạnh Hào',
      email: 'hao@example.com',
      phoneNumber: '0912345678',
      password: 'Password123',
      confirmPassword: 'Password123',
      agreement: true,
    };

    it('should successfully create a valid user via better-auth', async () => {
      (prisma.user.findFirst as any).mockResolvedValue(null);
      (auth.api.signUpEmail as any).mockResolvedValue({
        user: { id: 'new_user_123' },
      });

      const result = await createUserAction(validSignupPayload);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: validSignupPayload.email },
            { phoneNumber: validSignupPayload.phoneNumber },
          ],
        },
      });

      expect(auth.api.signUpEmail).toHaveBeenCalledWith({
        body: {
          email: validSignupPayload.email,
          password: validSignupPayload.password,
          name: validSignupPayload.fullName,
        },
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'new_user_123' },
        data: { phoneNumber: validSignupPayload.phoneNumber },
      });

      expect(result).toEqual({
        success: true,
        message: 'messages.success',
        userId: 'new_user_123',
      });

      expect(log.info).toHaveBeenCalledWith('Create new user successfully.', { userId: 'new_user_123' });
    });

    it('should reject creation if email or phone already exists in DB', async () => {
      (prisma.user.findFirst as any).mockResolvedValue({
        id: 'existing_user_123',
        email: validSignupPayload.email,
      });

      const result = await createUserAction(validSignupPayload);

      expect(result).toEqual({
        success: false,
        message: 'error.email.existed',
      });

      expect(auth.api.signUpEmail).not.toHaveBeenCalled();
      expect(log.warn).toHaveBeenCalledWith('Account already exists!', { email: validSignupPayload.email });
    });

    it('should handle schema validation errors gracefully', async () => {
      const invalidPayload = { ...validSignupPayload, email: 'not-an-email' };

      const result = await createUserAction(invalidPayload);

      expect(result.success).toBe(false);
      expect(result.status).toBe(500); 
      expect(auth.api.signUpEmail).not.toHaveBeenCalled();
    });
  });

  describe('signInAction', () => {
    const validEmailSignIn = {
      email: 'hao@example.com',
      password: 'Password123',
    };

    const validPhoneSignIn = {
      email: '0912345678', // the sign in schema uses "email" for both types
      password: 'Password123',
    };

    const mockResponse = {
      headers: {
        getSetCookie: () => [
          'better-auth.session_token=token123; Path=/; Max-Age=60; HttpOnly',
        ],
      },
    };

    it('should sign in successfully using an email', async () => {
      (auth.api.signInEmail as any).mockResolvedValue(mockResponse);

      const result = await signInAction(validEmailSignIn);

      expect(prisma.user.findFirst).not.toHaveBeenCalled(); // Skipping phone check
      expect(auth.api.signInEmail).toHaveBeenCalledWith({
        body: {
          email: validEmailSignIn.email,
          password: validEmailSignIn.password,
        },
        asResponse: true,
        headers: {},
      });

      expect(mockCookieStore.set).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'messages.success',
      });
    });

    it('should look up email and sign in successfully if a phone number is provided', async () => {
      (prisma.user.findFirst as any).mockResolvedValue({
        email: 'real_email_for_phone@example.com',
      });
      (auth.api.signInEmail as any).mockResolvedValue(mockResponse);

      const result = await signInAction(validPhoneSignIn);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { phoneNumber: validPhoneSignIn.email },
      });

      expect(auth.api.signInEmail).toHaveBeenCalledWith(expect.objectContaining({
        body: {
          email: 'real_email_for_phone@example.com',
          password: validPhoneSignIn.password,
        },
      }));

      expect(result.success).toBe(true);
    });

    it('should reject sign in if phone number is not found/linked to any user', async () => {
      (prisma.user.findFirst as any).mockResolvedValue(null); // user phone not found

      const result = await signInAction(validPhoneSignIn);

      expect(result).toEqual({
        success: false,
        message: 'error.accountNotFound',
      });
      expect(auth.api.signInEmail).not.toHaveBeenCalled();
      expect(log.warn).toHaveBeenCalledWith('Account not found by phone.', { phone: validPhoneSignIn.email });
    });

    it('should handle signIn integration exceptions gracefully', async () => {
      (auth.api.signInEmail as any).mockRejectedValue(new Error('Invalid password'));

      const result = await signInAction(validEmailSignIn);

      expect(result).toEqual({
        success: false,
        status: 401,
        message: 'error.invalidCredentials',
        supportCode: 'mock-error-event-id',
      });
      expect(log.error).toHaveBeenCalled();
    });
  });
});
