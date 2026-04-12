'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useT } from 'next-i18next/client';
import { Suspense, useEffect, useTransition } from 'react';
import type { FieldValues } from 'react-hook-form';
import toast from 'react-hot-toast';
import { signInAction } from '@/actions/user';
import Button from '@/components/button';
import Form from '@/components/form';
import Input from '@/components/input';
import Link from '@/components/link';
import { BUTTON_KIND, BUTTON_TYPE, INPUT_TYPE } from '@/constants';
import getSignInSchema from '@/schema/sign-in';

const SignInForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useT('sign-in');

  const SignInSchema = getSignInSchema(t);

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      toast.error(t('messages.sessionExpired'));
      router.replace('/sign-in');
    }
  }, [searchParams, t, router]);

  const onSubmitHandle = async (data: FieldValues): Promise<void> => {
    startTransition(async () => {
      const result = await signInAction(data);
      if (result.success) {
        toast.success(t('messages.success'));
        router.push('/home');
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="relative z-1 flex w-full p-5">
      <Form
        onSubmit={onSubmitHandle}
        schema={SignInSchema}
        className="flex w-2/3 flex-col gap-8 rounded-2xl border bg-zinc-100 p-10 backdrop-blur-3xl backdrop-saturate-150"
      >
        <div className="flex flex-col gap-1 font-display">
          <h2 className="font-bold text-3xl">{t('titles.title')}</h2>
          <p className="text-sm">{t('titles.description')}</p>
        </div>
        <div className="flex w-full flex-col gap-4">
          <Input label={t('labels.email')} name="email" type={INPUT_TYPE.TEXT} />
          <Input label={t('labels.password')} name="password" type={INPUT_TYPE.PASSWORD} />
        </div>
        <Button
          type={BUTTON_KIND.PRIMARY}
          text={t('buttons.signIn')}
          buttonType={BUTTON_TYPE.SUBMIT}
          disabled={isPending}
        />
        <div className="text-center">
          New to the scene? <Link href="/sign-up">Create Account</Link>
        </div>
      </Form>
    </div>
  );
};

const SignInPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
};

export default SignInPage;
