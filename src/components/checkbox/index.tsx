'use client';

import get from 'lodash/get';
import type { ReactNode } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import ErrorMessage from '@/components/error-message';
import Icon from '@/components/icon';
import cn from '@/helpers/classname-helper';
import type { InputProps } from '@/types/interface';

interface CheckBoxProps extends Omit<InputProps, 'type'> {
  label?: string;
  labelRender?: ReactNode;
}

const CheckBox = ({ className, name, label, labelRender, ...rest }: CheckBoxProps) => {
  const { register } = useFormContext();
  const { errors } = useFormState();
  const error = get(errors, name);

  return (
    <label
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-2 text-sm text-text transition-colors duration-500 has-checked:text-primary',
        className,
      )}
    >
      <input className="peer hidden" type="checkbox" {...register(name)} {...rest} />
      <Icon className={cn("peer-checked:hidden!",{
        'text-red-600': error,
      })} name="check_box_outline_blank" />
      <Icon className="peer-not-checked:hidden!" name="select_check_box" />
      {labelRender ? labelRender : label && <span className="select-none">{label}</span>}
      {error && <ErrorMessage message={String(error.message)} className='bottom-0 translate-y-full' />}
    </label>
  );
};

export default CheckBox;
