import { type ReactNode } from 'react';
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form';

type FormProps<TFormValues extends FieldValues> = {
  methods?: UseFormReturn<TFormValues>;
  children?: ReactNode;
} & React.FormHTMLAttributes<HTMLFormElement>;

export const Form = <TFormValues extends FieldValues>({
  methods,
  children,
  ...props
}: FormProps<TFormValues>) => {
  const formComponent = <form {...props}>{children}</form>;

  if (methods) return <FormProvider {...methods}>{formComponent}</FormProvider>;
  return formComponent;
};

export default Form;
