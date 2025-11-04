/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ReactNode } from 'react';
import type {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  Path,
  UseFormRegister,
} from 'react-hook-form';

export type labelPositions = 'top' | 'left' | 'right' | 'bottom';

export interface ReactHookFormProps<TFormValues extends FieldValues> {
  register?: UseFormRegister<TFormValues>;
  error?: FieldError;
  // error?: Merge<FieldError, FieldErrorsImpl<TFormValues>>;
}

export interface FormBaseProps<TFormValues extends FieldValues>
  extends ReactHookFormProps<TFormValues> {
  children?: ReactNode;
  name?: Path<TFormValues>;
  label?: ReactNode;
  labelPosition?: labelPositions;
  required?: boolean;
}

export const formLabelBaseStyle =
  'text-s flex flex-col gap-2 p-2 font-bold w-fit';
export const formComponentBaseStyle =
  'rounded-lg border border-slate-600 focus:outline-2 focus:outline-blue-primary bg-white px-3 py-2 text-xs font-medium text-slate-600';
export const formComponentErrorBaseStyle =
  'rounded-lg border border-red-500 focus:outline-2 focus:outline-red-500 bg-white px-3 py-2 text-xs font-medium text-slate-600';

export function labelPositionStyle(position: labelPositions) {
  switch (position) {
    case 'top':
      return 'flex-col';
    case 'left':
      return 'flex-row';
    case 'right':
      return 'flex-row-reverse justify-end';
    case 'bottom':
      return 'flex-col-reverse';
    default:
      return '';
  }
}
