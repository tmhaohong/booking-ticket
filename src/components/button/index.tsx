import type { ComponentPropsWithoutRef } from 'react';
import type { BUTTON_KIND, BUTTON_TYPE } from '@/constants';
import Primary from './primary';

interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'type'> {
  type: (typeof BUTTON_KIND)[keyof typeof BUTTON_KIND];
  text: string;
  isLoading?: boolean;
  buttonType?: (typeof BUTTON_TYPE)[keyof typeof BUTTON_TYPE];
}

const Button = ({ type, ...rest }: ButtonProps) => {
  switch (type) {
    default:
      return <Primary {...rest} />;
  }
};

export default Button;
