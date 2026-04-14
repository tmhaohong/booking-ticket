import bcrypt from 'bcrypt';
import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock('better-auth', () => ({
  betterAuth: vi.fn((config) => config),
}));

vi.mock('better-auth/adapters/prisma', () => ({
  prismaAdapter: vi.fn(() => 'mocked-prisma-adapter'),
}));

vi.mock('@/infrastructure/database/prisma', () => ({
  default: 'mocked-prisma-client',
}));

describe('Auth Helper Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize betterAuth with the correct configuration', async () => {
    const { default: authConfig } = await import('./auth');

    const config = authConfig as any;

    expect(config.database).toBe('mocked-prisma-adapter');
    expect(config.emailAndPassword.enabled).toBe(true);
    expect(config.emailAndPassword.minPasswordLength).toBe(6);
    expect(config.session.expiresIn).toBe(60 * 60 * 24 * 2);

    expect(config.user.additionalFields.role.defaultValue).toBe('USER');
  });

  it('should properly configure password hashing using bcrypt', async () => {
    const { default: authConfig } = await import('./auth');
    const { password } = (authConfig as any).emailAndPassword;

    vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);

    const hashResult = await password.hash('my-password');
    expect(bcrypt.hash).toHaveBeenCalledWith('my-password', 10);
    expect(hashResult).toBe('hashed-password');
  });

  it('should properly configure password verification using bcrypt', async () => {
    const { default: authConfig } = await import('./auth');
    const { password } = (authConfig as any).emailAndPassword;

    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const verifyResult = await password.verify({
      hash: 'hashed-password',
      password: 'my-password',
    });

    expect(bcrypt.compare).toHaveBeenCalledWith('my-password', 'hashed-password');
    expect(verifyResult).toBe(true);
  });
});
