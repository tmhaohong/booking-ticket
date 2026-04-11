'use client'

import cn from '@/helpers/classname-helper';

interface IconProps {
  name: string;
  className?: string;
}

const Icon = ({ className, name }: IconProps) => (
  <span
    className={cn('material-symbols-rounded text-2xl leading-6 transition-colors duration-400', className)}
  >
    {name}
  </span>
);

export default Icon;
