import React from 'react';
import type { FieldValues } from 'react-hook-form';
import {
  formComponentBaseStyle,
  formComponentErrorBaseStyle,
  formLabelBaseStyle,
  labelPositionStyle,
  type FormBaseProps,
} from './FormBase';

// interface FormInputPropsBase<TFormValues extends FieldValues>
//   extends FormBaseProps<TFormValues> {}

// type FormInputProps<TFormValues extends FieldValues> =
//   FormInputPropsBase<TFormValues> &
//     Omit<
//       React.PropsWithChildren<React.ComponentPropsWithRef<'input'>>,
//       keyof FormInputPropsBase<TFormValues>

type FormTextAreaProps<TFormValues extends FieldValues> =
  FormBaseProps<TFormValues> &
    Omit<
      React.PropsWithChildren<React.ComponentPropsWithRef<'textarea'>>,
      keyof FormBaseProps<TFormValues>
    >;

export const FormTextArea = <TFormValues extends FieldValues>({
  children,
  register,
  error,
  name,
  label,
  labelPosition,
  required,
  ...props
}: FormTextAreaProps<TFormValues>) => {
  const formProps =
    register && name ? register(name, { required }) : { name: name };

  return (
    <label
      className={[
        formLabelBaseStyle,
        labelPositionStyle(labelPosition ?? 'top'),
        'w-full flex-wrap',
        props.className,
      ].join(' ')}
    >
      {label}
      <textarea
        {...formProps}
        {...props}
        className={`${error ? formComponentErrorBaseStyle : formComponentBaseStyle} h-24 grow-1`}
        aria-invalid={!!error}
      >
        {children}
      </textarea>
      {error && <span className="text-xs text-red-500">{error.message}</span>}
    </label>
  );
};

export default FormTextArea;
