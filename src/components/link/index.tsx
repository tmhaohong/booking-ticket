import NextLink from 'next/link';
import type { ReactNode } from 'react';
import cn from '@/helpers/classname-helper';

const Link = ({
  href,
  children,
  className,
}: {
  href: string;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <NextLink href={href} className={cn('font-semibold text-blue-500 hover:underline', className)}>
      {children}
    </NextLink>
  );
};

export default Link;
