import { describe, expect, it, vi } from 'vitest';

vi.mock('better-auth/react', () => ({
  createAuthClient: vi.fn(() => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
    useSession: vi.fn(),
  })),
}));

describe('Auth Client Helper', () => {
  it('should create authClient and export required utilities', async () => {
    const { authClient, signIn, signOut, useSession } = await import('./auth-client');

    expect(authClient).toBeDefined();
    expect(authClient.signIn).toBeDefined();
    expect(authClient.signOut).toBeDefined();
    expect(authClient.useSession).toBeDefined();

    expect(signIn).toBe(authClient.signIn);
    expect(signOut).toBe(authClient.signOut);
    expect(useSession).toBe(authClient.useSession);
  });
});
