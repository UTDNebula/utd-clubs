// /* eslint-disable @typescript-eslint/no-unused-vars */
import PillButton from '@src/components/PillButton';
import React, { type ReactNode } from 'react';
import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

type HTMLInputTypes = 'button' | 'checkbox' | 'color' | 'file' | 'text';
const HTMLTextArea = 'textarea' as const;

type FormInputPropsBase<TFormValues extends FieldValues> = {
  children?: ReactNode;
  register?: UseFormRegister<TFormValues>;
  type?: HTMLInputTypes | typeof HTMLTextArea;
  name?: Path<TFormValues>;
  label?: ReactNode;
  // required?: boolean;
};

// type FormInputPropsAsHTMLInput<TFormValues extends FieldValues> = {
//   type: 'input';
// } & FormInputPropsBase<TFormValues> &
//   DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

// type FormInputPropsAsHTMLTextArea<TFormValues extends FieldValues> = {
//   type: 'textarea';
// } & FormInputPropsBase<TFormValues> &
//   DetailedHTMLProps<
//     TextareaHTMLAttributes<HTMLTextAreaElement>,
//     HTMLTextAreaElement
//   >;

type FormInputPropsAsHTMLInput<TFormValues extends FieldValues> =
  FormInputPropsBase<TFormValues> &
    React.PropsWithChildren<React.ComponentPropsWithRef<'input'>>;

type FormInputPropsAsHTMLTextArea<TFormValues extends FieldValues> =
  FormInputPropsBase<TFormValues> &
    React.PropsWithChildren<React.ComponentPropsWithRef<'textarea'>>;

type FormInputPropsAsHTMLButton<TFormValues extends FieldValues> =
  FormInputPropsBase<TFormValues> &
    Omit<
      React.PropsWithChildren<React.ComponentPropsWithRef<'button'>>,
      'type'
    >;

// interface FormInputPropsAsHTMLInput<TFormValues extends FieldValues> extends
//   FormInputPropsBase<TFormValues>,
//     React.PropsWithChildren<React.ComponentPropsWithRef<'input'>> {}

// interface FormInputPropsAsHTMLTextArea<TFormValues extends FieldValues> extends
//   FormInputPropsBase<TFormValues>,
//     React.PropsWithChildren<React.ComponentPropsWithRef<'textarea'>> {}

// Ideally this would be a union instead, but I just can't get typescript to behave when I do that, so...
type FormInputProps<TFormValues extends FieldValues> =
  FormInputPropsAsHTMLInput<TFormValues> &
    FormInputPropsAsHTMLTextArea<TFormValues> &
    FormInputPropsAsHTMLButton<TFormValues>;

// type FormInputProps<TFormValues extends FieldValues> =
//   | FormInputPropsAsHTMLInput<TFormValues>
//   | FormInputPropsAsHTMLTextArea<TFormValues>
//   | FormInputPropsAsHTMLButton<TFormValues>;

const baseLabelStyle = 'text-s flex flex-col gap-2 p-2 font-bold';
const baseFormInputStyle =
  'rounded-lg border border-slate-600 bg-white px-3 py-2 text-xs font-medium text-slate-600';

/**
 * @deprecated
 */
const FormInput = <TFormValues extends FieldValues>({
  children,
  register,
  type,
  name,
  label,
  // required,
  ...props
}: FormInputProps<TFormValues>) => {
  const formProps =
    register && name ? register(name /* , { required } */) : { name: name };

  if (type === HTMLTextArea) {
    return (
      <label className={baseLabelStyle + ' ' + props.className}>
        {label}
        <textarea
          {...formProps}
          {...props}
          className={baseFormInputStyle + ' h-24'}
        >
          {children}
        </textarea>
      </label>
    );
  }

  if (type === 'button') {
    return (
      // <button
      //   {...formProps}
      //   {...props}
      //   className={`w-min p-2 text-s bg-blue-primary min-w-max cursor-pointer rounded-full font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-white`}
      // >
      //   {label}
      //   {children}
      // </button>

      // TODO: Make PillButton not suck
      <PillButton onClick={props.onClick}>
        {label as string}
      </PillButton>
    );
  }

  if (type === 'checkbox') {
    return (
      <label
        className={
          baseLabelStyle +
          ' flex-row-reverse justify-end py-0' +
          ' ' +
          props.className
        }
      >
        {label}
        <input
          {...formProps}
          {...props}
          type={type}
          className={baseFormInputStyle}
        >
          {children}
        </input>
      </label>
    );
  }

  if (type === 'file') {
    return (
      <label className={baseLabelStyle + ' ' + props.className}>
        {label}
        <input
          {...formProps}
          {...props}
          type={type}
          className={baseFormInputStyle}
        >
          {children}
        </input>
      </label>
    );
  }

  // type === "text" and default
  return (
    <label className={baseLabelStyle + ' ' + props.className}>
      {label}
      <input
        {...formProps}
        {...props}
        type={type}
        className={baseFormInputStyle}
      >
        {children}
      </input>
    </label>
  );
};

// const FormInput = forwardRef<HTMLInputElement, FormInputProps<any>>(ComponentDef(props)));
// const FormInput = forwardRef<HTMLInputElement, FormInputProps<any>>(
//   ({
//     children,
//     register,
//     type,
//     name,
//     label,
//     required,
//     ...props
//   }: FormInputProps<TFormValues>) => {
//     if (type === HTMLTextArea) {
//       return (
//         <label>
//           {label}
//           <textarea name={name} {...props}>
//             {children}
//           </textarea>
//         </label>
//       );
//     }
//     return (
//       <label>
//         {label}
//         {register && name ? (
//           <input
//             {...register(name, { required })}
//             {...props}
//             /* type={type} name={name} */
//             type={name}
//           >
//             {children}
//           </input>
//         ) : (
//           <input type={type} name={name} {...props}></input>
//         )}
//       </label>
//     );
//   },
// );

export default FormInput;
