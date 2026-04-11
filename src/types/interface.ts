import type { ComponentPropsWithoutRef } from 'react';
import type { INPUT_TYPE } from '@/constants';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  type: (typeof INPUT_TYPE)[keyof typeof INPUT_TYPE];
  name: string;
}
