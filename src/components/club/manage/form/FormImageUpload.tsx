import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { type ReactNode } from 'react';
import {
  Controller,
  useFormContext,
  type ControllerProps,
  type FieldValues,
} from 'react-hook-form';
import UploadImage from '../components/UploadImage';

type FormImageUploadProps<TFormValues extends FieldValues> = Omit<
  ControllerProps<TFormValues>,
  'render'
> &
  TextFieldProps & {
    clubId: string;
    className?: string | undefined;
    label?: ReactNode;
  };

export const FormImageUpload = <TFormValues extends FieldValues>({
  name,
  control,
  label,
  className,
  rules,
  clubId,
  ...props
}: FormImageUploadProps<TFormValues>) => {
  const methods = useFormContext();

  const error = methods.getFieldState(name).error;

  // const error = index
  //   ? methods.formState.errors[name][index]
  //   : methods.formState.errors[name];

  return (
    <Controller
      {...{ name }}
      {...{ control }}
      render={({ field }) => (
        <UploadImage clubId={clubId} />
        // <TextField
        //   id="outlined-basic"
        //   label={label}
        //   variant="outlined"
        //   size="small"
        //   {...field}
        //   // TODO: This doesn't work, investigate how to pull required from Zod schema
        //   required={!!rules?.required || !!rules?.min}
        //   error={!!error}
        //   helperText={error?.message}
        //   className={className + ' m-2 [&>.MuiInputBase-root]:bg-white'}
        //   {...props}
        // />
      )}
    />
  );
};

export default FormImageUpload;
