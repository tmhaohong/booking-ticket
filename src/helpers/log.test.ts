import * as Sentry from '@sentry/nextjs';
import pino from 'pino';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import log from './log';

vi.mock('pino', () => {
  const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
  return {
    default: vi.fn(() => mockLogger),
  };
});

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(() => 'mock-event-id'),
}));

describe('Logger Helper', () => {
  // We need to re-import or get the mocked logger instance
  const mockPinoLogger = pino();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call pino info correctly', () => {
    log.info('test info', { id: 1 });
    expect(mockPinoLogger.info).toHaveBeenCalledWith({ id: 1 }, 'test info');
  });

  it('should call pino warn correctly', () => {
    log.warn('test warn', { id: 2 });
    expect(mockPinoLogger.warn).toHaveBeenCalledWith({ id: 2 }, 'test warn');
  });

  it('should call pino error and Sentry captureException correctly', () => {
    const error = new Error('Test error');
    const eventId = log.error(error, 'TEST_CONTEXT');

    expect(mockPinoLogger.error).toHaveBeenCalledWith(
      { err: error, context: 'TEST_CONTEXT' },
      '[ERROR]: TEST_CONTEXT'
    );
    expect(Sentry.captureException).toHaveBeenCalledWith(error, {
      tags: { context: 'TEST_CONTEXT' },
    });
    expect(eventId).toBe('mock-event-id');
  });
});
