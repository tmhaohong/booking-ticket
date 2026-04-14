import { object, string } from 'yup';
import { emailRegExp, phoneRegExp } from '@/constants';
import type { Translator } from '@/types/type';

const getSignInSchema = (t: Translator) => {
  return object().shape({
    email: string()
      .required(t('error.email.required'))
      .test('email-or-phone', t('error.email.email'), (value) => {
        if (!value) return false;
        return emailRegExp.test(value) || phoneRegExp.test(value);
      }),
    password: string().required(t('error.password.required')),
  });
};

export default getSignInSchema;
