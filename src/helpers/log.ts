import * as Sentry from '@sentry/nextjs';
import pino from 'pino';

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});

const log = {
  info: (msg: string, obj?: any) => {
    logger.info(obj, msg);
  },

  warn: (msg: string, obj?: any) => {
    logger.warn(obj, msg);
  },

  error: (error: any, context: string) => {
    logger.error({ err: error, context }, `[ERROR]: ${context}`);
    const eventId = Sentry.captureException(error, {
      tags: { context },
    });

    return eventId;
  },
};

export default log;