'use client';

import { INPUT_TYPE } from '@/constants';
import cn from '@/helpers/classname-helper';
import type { InputProps } from '@/types/interface';
import Text from './text';

const Wrapper = ({ type, ...rest }: InputProps) => {
  switch (type) {
    case INPUT_TYPE.PASSWORD:
      return <Text type={type} {...rest} />;
    default:
      return <Text type={type} {...rest} />;
  }
};

interface CustomInputProps extends InputProps {
  label?: string;
  className?: string;
  description?: string;
  isOptional?: boolean;
}
const Input = ({
  label,
  className,
  description,
  isOptional,
  name,
  type,
  ...rest
}: CustomInputProps) => (
  <div className={cn('flex w-full flex-col gap-1', className)}>
    {label && (
      <label htmlFor={name}>
        <span className="font-semibold text-sm text-text">{label}</span>
        {isOptional && <span className="ml-2 font-light text-foreground text-xs">(Optional)</span>}
      </label>
    )}
    {description && <p className="mb-1 font-light text-foreground text-xs">{description}</p>}
    <div className="relative">
      <Wrapper type={type} name={name} {...rest} />
    </div>
  </div>
);

export default Input;
