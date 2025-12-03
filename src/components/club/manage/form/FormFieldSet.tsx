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
        'flex flex-col gap-2 rounded-lg bg-white px-14 py-10' +
        ' ' +
        props.className
      }
    >
      <legend className="float-left gap-2 pl-2 text-xl font-bold text-slate-600">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
};

export default FormFieldSet;
