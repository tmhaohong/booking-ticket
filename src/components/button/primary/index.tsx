'use client';

import type { ButtonHTMLAttributes } from 'react';
import { BUTTON_TYPE } from '@/constants';
import cn from '@/helpers/classname-helper';

interface PrimaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  isLoading?: boolean;
  buttonType?: (typeof BUTTON_TYPE)[keyof typeof BUTTON_TYPE];
}

const Primary = ({
  className,
  text,
  disabled,
  buttonType = BUTTON_TYPE.BUTTON,
  onClick,
  isLoading,
  ...rest
}: PrimaryProps) => {
  return (
    <button
      {...rest}
      type={buttonType}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'flex cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-2 font-medium text-base text-white transition-all duration-300 hover:brightness-110',
        {
          'cursor-auto bg-slate-300 text-gray-400 hover:brightness-100': disabled || isLoading,
        },
        className,
      )}
    >
      {text}
    </button>
  );
};

export default Primary;
