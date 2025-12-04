import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button, { type ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { type ReactNode } from 'react';
import {
  Controller,
  useFormContext,
  type ControllerProps,
  type FieldValues,
} from 'react-hook-form';

type FormFileUploadProps<TFormValues extends FieldValues> = Omit<
  ControllerProps<TFormValues>,
  'render'
> &
  ButtonProps & {
    className?: string | undefined;
    label?: ReactNode;
  };

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const FormFileUpload = <TFormValues extends FieldValues>({
  name,
  control,
  label,
  className,
  rules,
  ...props
}: FormFileUploadProps<TFormValues>) => {
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
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={(event) => console.log(event.target.files)}
            multiple
          />
        </Button>

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

export default FormFileUpload;
