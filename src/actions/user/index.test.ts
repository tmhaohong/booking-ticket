import bcrypt from 'bcrypt';
import * as nextI18NextServer from 'next-i18next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import log from '@/helpers/log';
import prisma from '@/infrastructure/database/prisma';
import createUserAction from './index';

// Mock dependencies
vi.mock('@/infrastructure/database/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
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

describe('createUserAction', () => {
  const mockT = vi.fn((key: string) => key);

  beforeEach(() => {
    vi.clearAllMocks();
    (nextI18NextServer.getT as any).mockResolvedValue({ t: mockT });
  });

  const validPayload = {
    fullName: 'Trần Mạnh Hào',
    email: 'hao@example.com',
    phoneNumber: '0912345678',
    password: 'Password123',
    confirmPassword: 'Password123',
    agreement: true,
  };

  it('should successfully create a highly validated user', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null); // No existing user
    (bcrypt.hash as any).mockResolvedValue('hashed_password_123'); // Fake hash

    const mockCreatedUser = { id: 'user_123', ...validPayload };
    (prisma.user.create as any).mockResolvedValue(mockCreatedUser);

    const result = await createUserAction(validPayload);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: validPayload.email } });
    expect(bcrypt.hash).toHaveBeenCalledWith(validPayload.password, 10);
    expect(prisma.user.create).toHaveBeenCalled();

    expect(result).toEqual({
      success: true,
      message: 'messages.success', // Based on the mockT return
      userId: 'user_123',
    });

    expect(log.info).toHaveBeenCalledWith('Create new user successfully.', { userId: 'user_123' });
  });

  it('should reject creation if email already exists', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'existing_user_123',
      email: validPayload.email,
    });

    const result = await createUserAction(validPayload);

    expect(result).toEqual({
      success: false,
      message: 'error.email.existed',
    });

    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(log.warn).toHaveBeenCalledWith('Email is existed!', { email: validPayload.email });
  });

  it('should handle schema validation errors automatically', async () => {
    const invalidPayload = { ...validPayload, email: 'not-an-email' };

    const result = await createUserAction(invalidPayload);

    expect(result.success).toBe(false);
    expect(result.status).toBe(500); // Handled by catch block fallback currently
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('should handle fatal database connection errors gracefully', async () => {
    (prisma.user.findUnique as any).mockRejectedValue(new Error('DB Connection Failed'));

    const result = await createUserAction(validPayload);

    expect(result).toEqual({
      success: false,
      status: 500,
      message: 'error.email.existed', // Standard fallback mapped in your function
      supportCode: 'mock-error-event-id', // From mocked Sentry log
    });

    expect(log.error).toHaveBeenCalled();
  });
});
