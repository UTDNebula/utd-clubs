import React from 'react';
import type { FieldValues } from 'react-hook-form';
import {
  formComponentBaseStyle,
  formComponentErrorBaseStyle,
  formLabelBaseStyle,
  labelPositionStyle,
  type FormBaseProps,
} from './FormBase';

type HTMLInputTypes = 'checkbox' | 'color' | 'file' | 'text';

interface FormInputPropsBase<TFormValues extends FieldValues>
  extends FormBaseProps<TFormValues> {
  type?: HTMLInputTypes;
}

type FormInputProps<TFormValues extends FieldValues> =
  FormInputPropsBase<TFormValues> &
    Omit<
      React.PropsWithChildren<React.ComponentPropsWithRef<'input'>>,
      keyof FormInputPropsBase<TFormValues>
    >;

export const FormInput = <TFormValues extends FieldValues>({
  children,
  register,
  error,
  type,
  name,
  label,
  labelPosition,
  ...props
}: FormInputProps<TFormValues>) => {
  const formProps =
    register && name ? register(name /* , { required } */) : { name: name };

  switch (type) {
    case 'checkbox':
      return (
        <label
          className={[
            formLabelBaseStyle,
            labelPositionStyle(labelPosition ?? 'right'),
            'cursor-pointer items-center',
            props.className,
          ].join(' ')}
        >
          {label}
          <input
            {...formProps}
            {...props}
            type={type}
            className={`formComponentBaseStyle`}
          >
            {children}
          </input>
        </label>
      );
    case 'color':
    case 'file':
    case 'text':
    default:
      return (
        <label
          className={[
            formLabelBaseStyle,
            labelPositionStyle(labelPosition ?? 'top'),
            props.className,
          ].join(' ')}
        >
          {label}
          <input
            {...formProps}
            {...props}
            type={type}
            className={`${error ? formComponentErrorBaseStyle : formComponentBaseStyle}`}
            aria-invalid={!!error}
          >
            {children}
          </input>
          {error && (
            <span className="text-xs text-red-500">{error.message}</span>
          )}
        </label>
      );
  }
};

export default FormInput;
