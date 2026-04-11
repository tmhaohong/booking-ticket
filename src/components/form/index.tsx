'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import type { ReactNode } from 'react';
import { type FieldValues, FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import type { ObjectSchema } from 'yup';

const Form = ({
  className,
  onSubmit,
  schema,
  children,
}: {
  className?: string;
  onSubmit: SubmitHandler<FieldValues>;
  schema?: ObjectSchema<FieldValues>;
  children: ReactNode;
}) => {
  const methods = useForm({
    ...(schema && { resolver: yupResolver(schema) }),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className} noValidate>
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
