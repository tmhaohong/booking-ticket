import bcrypt from 'bcrypt';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from '@/infrastructure/database/prisma';

const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
    password: {
      hash: async (password) => {
        return bcrypt.hash(password, 10);
      },
      verify: async ({ hash, password }) => {
        return bcrypt.compare(password, hash);
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 2,
    updateAge: 60 * 60 * 24 * 1,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'USER',
      },
    },
  },
});

export  default auth;