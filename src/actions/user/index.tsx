'use server';

import { headers } from 'next/headers';
import { getT } from 'next-i18next/server';
import type { FieldValues } from 'react-hook-form';
import auth from '@/helpers/auth';
import log from '@/helpers/log';
import prisma from '@/infrastructure/database/prisma';
import getSignInSchema from '@/schema/sign-in';
import { getServerUserSchema } from '@/schema/user';

export const createUserAction = async (data: FieldValues) => {
  log.info('Begin creating User.', { hasName: !!data.fullName, hasEmail: !!data.email });
  const { t } = await getT('sign-up');

  try {
    const validatedData = await getServerUserSchema(t).validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          ...(validatedData.phoneNumber ? [{ phoneNumber: validatedData.phoneNumber }] : []),
        ],
      },
    });

    if (existingUser) {
      log.warn('Account already exists!', { hasEmail: !!validatedData.email });
      return { success: false, message: t('error.email.existed') };
    }

    const result = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.fullName,
      },
    });

    if (validatedData.phoneNumber && result.user?.id) {
      try {
        await prisma.user.update({
          where: { id: result.user.id },
          data: { phoneNumber: validatedData.phoneNumber },
        });
      } catch (updateErr) {
        log.warn('Failed to save phone number post-signup', { userId: result.user.id });
      }
    }

    log.info('Create new user successfully.', { userId: result.user?.id });

    return {
      success: true,
      message: t('messages.success'),
      userId: result.user?.id,
    };
  } catch (err: unknown) {
    const error = err as any;
    const eventId = log.error(error, 'CREATE_USER_ACTION_FAILURE');

    let message = 'An unexpected error occurred. Please try again.';

    if (error?.name === 'ValidationError') {
      message = error.message;
    } else if (
      error?.code === 'USER_ALREADY_EXISTS' ||
      error?.message?.includes('already exists')
    ) {
      message = t('error.email.existed', { defaultValue: 'Email or account already exists.' });
    } else if (error?.message === 'PHONE_UPDATE_FAILED') {
      message =
        'Account was created, but your phone number could not be saved. Please update it inside your profile.';
    } else if (error?.code === 'P2002') {
      message = t('error.email.existed', {
        defaultValue: 'Email or phone number is already registered.',
      });
    }

    return {
      success: false,
      status: 500,
      message,
      supportCode: eventId,
    };
  }
};

export const signInAction = async (data: FieldValues) => {
  log.info('Begin signing in.', { hasEmail: !!data.email });
  const { t } = await getT('sign-in');

  try {
    const validatedData = await getSignInSchema(t).validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    // If input is a phone number, look up the email first
    let loginEmail = validatedData.email;
    const isPhone = /^(\+84|0)[35789][0-9]{8}$/.test(validatedData.email);

    if (isPhone) {
      const user = await prisma.user.findFirst({
        where: { phoneNumber: validatedData.email },
      });

      if (!user?.email) {
        log.warn('Account not found by phone.', { isPhoneLookup: true });
        return { success: false, message: t('error.accountNotFound') };
      }

      loginEmail = user.email;
    }

    const response = await auth.api.signInEmail({
      body: {
        email: loginEmail,
        password: validatedData.password,
      },
      asResponse: true,
      headers: await headers(),
    });

    const setCookies = response.headers.getSetCookie();
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    for (const cookie of setCookies) {
      const [nameValue, ...parts] = cookie.split(';');
      const [name, ...valueParts] = nameValue.split('=');
      const value = valueParts.join('=');
      const options: Record<string, unknown> = {};
      for (const part of parts) {
        const [key, val] = part.trim().split('=');
        const k = key.toLowerCase();
        if (k === 'path') options.path = val;
        if (k === 'max-age') options.maxAge = Number(val);
        if (k === 'expires') options.expires = new Date(val);
        if (k === 'httponly') options.httpOnly = true;
        if (k === 'secure') options.secure = true;
        if (k === 'samesite') options.sameSite = val?.toLowerCase();
      }
      cookieStore.set(name.trim(), decodeURIComponent(value), options);
    }

    log.info('User signed in successfully.', { isPhone });

    return {
      success: true,
      message: t('messages.success'),
    };
  } catch (err: unknown) {
    const error = err as any;
    const eventId = log.error(error, 'SIGN_IN_ACTION_FAILURE');

    if (error?.name === 'ValidationError') {
      return {
        success: false,
        status: 400,
        message: error.message,
        supportCode: eventId,
      };
    }

    // Auth provider errors (better-auth throws APIError with specific messages or status codes)
    if (error?.status === 401 || error?.message?.includes('invalid')) {
      return {
        success: false,
        status: 401,
        message: t('error.invalidCredentials', { defaultValue: 'Invalid credentials.' }),
        supportCode: eventId,
      };
    }

    return {
      success: false,
      status: 500,
      message: 'An unexpected server error occurred.',
      supportCode: eventId,
    };
  }
};
