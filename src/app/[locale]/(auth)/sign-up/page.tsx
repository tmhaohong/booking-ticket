'use client';

import omit from 'lodash/omit';
import { useParams, useRouter } from 'next/navigation';
import { useT } from 'next-i18next/client';
import { useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createUserAction } from '@/actions/user';
import Button from '@/components/button';
import CheckBox from '@/components/checkbox';
import Form from '@/components/form';
import Input from '@/components/input';
import Link from '@/components/link';
import { BUTTON_KIND, BUTTON_TYPE, INPUT_TYPE } from '@/constants';
import getUserSchema from '@/schema/user';
import CustomLabel from './custom-label';

const COUNTDOWN = 2;

const SignUpPage = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { t } = useT('sign-up');

  const UserSchema = getUserSchema(t);

  const onSubmitHandle = async (data: FieldValues): Promise<void> => {
    setIsPending(true);
    try {
      const result = await createUserAction(omit(data, ['confirmPassword', 'agreement']));
      if (result.success) {
        toast.success(t('messages.success', { count: COUNTDOWN }));

        setTimeout(() => {
          router.push(`/${params.locale}/sign-in`);
        }, COUNTDOWN * 1000);
      } else {
        toast.error(result.message);
        setIsPending(false);
      }
    } catch (e) {
      setIsPending(false);
    }
  };
  return (
    <div className="relative z-1 flex w-full p-5">
      <Form
        onSubmit={onSubmitHandle}
        schema={UserSchema}
        className="flex w-2/3 flex-col gap-8 rounded-2xl border bg-zinc-100 p-10 backdrop-blur-3xl backdrop-saturate-150"
      >
        <div className="flex flex-col gap-1 font-display">
          <h2 className="font-bold text-3xl">{t('titles.title')}</h2>
          <p className="text-sm">{t('titles.description')}</p>
        </div>
        <div className="flex w-full flex-col gap-4">
          <Input label={t('labels.fullName')} name="fullName" type={INPUT_TYPE.TEXT} />
          <Input label={t('labels.email')} name="email" type={INPUT_TYPE.EMAIL} />
          <Input label={t('labels.phoneNumber')} name="phoneNumber" type={INPUT_TYPE.TEXT} />
          <Input label={t('labels.password')} name="password" type={INPUT_TYPE.PASSWORD} />
          <Input
            label={t('labels.confirmPassword')}
            name="confirmPassword"
            type={INPUT_TYPE.PASSWORD}
          />
          <CheckBox labelRender={<CustomLabel />} name="agreement" />
        </div>
        <Button
          type={BUTTON_KIND.PRIMARY}
          text={t('buttons.signUp')}
          buttonType={BUTTON_TYPE.SUBMIT}
          disabled={isPending}
        />
        <div className="text-center">
          {t('footer.prompt')} <Link href={`/${params.locale}/sign-in`}>{t('footer.link')}</Link>
        </div>
      </Form>
    </div>
  );
};

export default SignUpPage;
