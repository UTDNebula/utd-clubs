import Typography from '@mui/material/Typography';
import React, { type ReactNode } from 'react';

interface FormFieldSetPropsBase {
  legend?: ReactNode;
}

type FormFieldSetProps = FormFieldSetPropsBase &
  Omit<
    React.PropsWithChildren<React.ComponentPropsWithRef<'fieldset'>>,
    keyof FormFieldSetPropsBase
  >;

export const FormFieldSet = ({
  children,
  legend,
  ...props
}: FormFieldSetProps) => {
  return (
    <fieldset
      {...props}
      className={
        'flex flex-col gap-2 rounded-lg bg-white sm:px-14 max-sm:px-2 sm:py-10 max-sm:py-4 min-w-0 max-w-6xl ' +
        props.className
      }
    >
      {legend && (
        <legend className="float-left">
          <Typography
            variant="h2"
            className="ml-2 text-xl font-bold text-haiti"
          >
            {legend}
          </Typography>
        </legend>
      )}
      {children}
    </fieldset>
  );
};

export default FormFieldSet;
