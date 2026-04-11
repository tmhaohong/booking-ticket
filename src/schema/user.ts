import { boolean, object, ref, string } from 'yup';
import { nameRegExp, phoneRegExp } from '@/constants';
import type { Translator } from '@/types/type';

const getUserSchema = (t: Translator) => {
  return object().shape({
    fullName: string()
      .required(t('error.fullName.required'))
      .min(5, t('error.fullName.min'))
      .max(100, t('error.fullName.max'))
      .matches(nameRegExp, t('error.fullName.matches')),
    email: string().required(t('error.email.required')).email(t('error.email.email')),
    phoneNumber: string()
      .nullable()
      .notRequired()
      .test('is-phone-number', t('error.phoneNumber'), (value) => {
        return !value || phoneRegExp.test(value);
      }),
    password: string()
      .required(t('error.password.required'))
      .min(6, t('error.password.min'))
      .max(20, t('error.password.max'))
      .matches(/[a-zA-Z]/, t('error.password.matches'))
      .matches(/[0-9]/, t('error.password.matches')),
    confirmPassword: string()
      .required(t('error.confirmPassword.required'))
      .oneOf([ref('password')], t('error.confirmPassword.oneOf')),
    agreement: boolean()
      .oneOf([true], t('error.agreement.required')),
  });
};

export const getServerUserSchema = (t: Translator) =>
  getUserSchema(t).omit(['confirmPassword', 'agreement']);

export default getUserSchema;
