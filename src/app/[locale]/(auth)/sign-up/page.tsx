'use client';

import omit from 'lodash/omit';
import { useRouter } from 'next/navigation';
import { useT } from 'next-i18next/client';
import { useTransition } from 'react';
import type { FieldValues } from 'react-hook-form';
import toast from 'react-hot-toast';
import createUserAction from '@/actions/user';
import Button from '@/components/button';
import CheckBox from '@/components/checkbox';
import Form from '@/components/form';
import Input from '@/components/input';
import { BUTTON_KIND, BUTTON_TYPE, INPUT_TYPE } from '@/constants';
import getUserSchema from '@/schema/user';
import CustomLabel from './custom-label';

const COUNTDOWN = 2;

const SignUpPage = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useT('sign-up');

  const UserSchema = getUserSchema(t);

  const onSubmitHandle = async (data: FieldValues): Promise<void> => {
    startTransition(async () => {
      const result = await createUserAction(omit(data, ['confirmPassword', 'agreement']));
      if (result.success) {
        toast.success(t('messages.success', { count: COUNTDOWN }));

        setTimeout(() => {
          router.push('/sign-in');
        }, COUNTDOWN * 1000);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex w-full p-5">
      <Form onSubmit={onSubmitHandle} schema={UserSchema} className="flex w-1/2 flex-col gap-6">
        <div className="flex w-full flex-col gap-4">
          <Input label="Full Name" name="fullName" type={INPUT_TYPE.TEXT} />
          <Input label="Email" name="email" type={INPUT_TYPE.EMAIL} />
          <Input label="Phone Number" name="phoneNumber" type={INPUT_TYPE.TEXT} />
          <Input label="Password" name="password" type={INPUT_TYPE.PASSWORD} />
          <Input label="Confirm Password" name="confirmPassword" type={INPUT_TYPE.PASSWORD} />
          <CheckBox labelRender={<CustomLabel />} name="agreement" />
        </div>
        <Button
          type={BUTTON_KIND.PRIMARY}
          text="Sign Up"
          buttonType={BUTTON_TYPE.SUBMIT}
          disabled={isPending}
        />
      </Form>
    </div>
  );
};

export default SignUpPage;
