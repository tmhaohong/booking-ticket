import { toNextJsHandler } from 'better-auth/next-js';
import auth from '@/helpers/auth';

export const { GET, POST } = toNextJsHandler(auth);
