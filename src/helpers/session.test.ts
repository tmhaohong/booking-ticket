import { headers } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import auth from '@/helpers/auth';
import { getSession } from './session';

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('@/helpers/auth', () => ({
  default: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe('Session Helper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call auth.api.getSession with headers and return the session', async () => {
    const mockHeaders = new Headers();
    mockHeaders.set('cookie', 'test-cookie=123');

    // Mocks
    vi.mocked(headers).mockResolvedValue(mockHeaders);
    const mockSession = { user: { id: 'mock-user-id', name: 'Test User' }, session: { id: 'session-id' } };
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any);

    const result = await getSession();

    expect(headers).toHaveBeenCalled();
    expect(auth.api.getSession).toHaveBeenCalledWith({ headers: mockHeaders });
    expect(result).toEqual(mockSession);
  });
});
