'use client';

import get from 'lodash/get';
import { useFormContext, useFormState } from 'react-hook-form';
import ErrorMessage from '@/components/error-message';
import cn from '@/helpers/classname-helper';
import type { InputProps } from '@/types/interface';

const Text = ({ name, type, ...rest }: InputProps) => {
  const { register } = useFormContext();
  const { errors } = useFormState();
  const error = get(errors, name);

  return (
    <>
      <input
        id={name}
        type={type}
        {...rest}
        {...register(name)}
        autoComplete="off"
        className={cn("w-full rounded-xl border border-line px-4 py-2 text-base text-text transition-colors duration-500 focus:border-primary focus:outline-none", {
          'border-red-600': error,
        })}
      />
      {error && (
        <div className="relative">
          <ErrorMessage message={String(error.message)} />
        </div>
      )}
    </>
  );
};

export default Text;
