'use server';

import bcrypt from 'bcrypt';
import { getT } from 'next-i18next/server';
import type { FieldValues } from 'react-hook-form';
import log from '@/helpers/log';
import prisma from '@/infrastructure/database/prisma';
import { getServerUserSchema } from '@/schema/user';

const createUserAction = async (data: FieldValues) => {
  log.info('Begin creating User.', { fullName: data.fullName, email: data.email });
  const { t } = await getT('sign-up');

  try {
    const validatedData = await getServerUserSchema(t).validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      log.warn('Email is existed!', { email: validatedData.email });
      return { success: false, message: t('error.email.existed') };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        passwordHash: hashedPassword,
      },
    });

    log.info('Create new user successfully.', { userId: newUser.id });

    return {
      success: true,
      message: t('messages.success'),
      userId: newUser.id,
    };
  } catch (error: any) {
    const eventId = log.error(error, 'CREATE_USER_ACTION_FAILURE');
    return {
      success: false,
      status: 500,
      message: t('error.email.existed'),
      supportCode: eventId,
    };
  }
};

export default createUserAction;
