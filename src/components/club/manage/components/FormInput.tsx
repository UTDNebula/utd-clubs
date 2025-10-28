import React from 'react';
import type { FieldValues } from 'react-hook-form';
import {
  type FormBaseProps,
  formLabelBaseStyle,
  formComponentBaseStyle,
  labelPositionStyle,
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
            'py-0 cursor-pointer',
            props.className,
          ].join(' ')}
        >
          {label}
          <input
            {...formProps}
            {...props}
            type={type}
            className={formComponentBaseStyle}
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
            className={formComponentBaseStyle}
          >
            {children}
          </input>
        </label>
      );
  }
};

export default FormInput;
