/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormControl, MenuItem } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { type ReactNode } from 'react';
import {
  Controller,
  Path,
  useFormContext,
  type ControllerProps,
  type FieldValues,
} from 'react-hook-form';

type FormSelectProps<TFormValues extends FieldValues> = Omit<
  ControllerProps<TFormValues>,
  'render'
> &
  TextFieldProps & {
    className?: string | undefined;
    label?: ReactNode;
  };

export const FormSelect = <TFormValues extends FieldValues>({
  name,
  control,
  label,
  className,
  rules,
  key,
  children,
  ...props
}: FormSelectProps<TFormValues>) => {
  const methods = useFormContext();

  const error = methods.getFieldState(name).error;

  // const error = index
  //   ? methods.formState.errors[name][index]
  //   : methods.formState.errors[name];

  const handleChange = (event: SelectChangeEvent) => {
    // @ts-expect-error `event.target.value` is a string, but it should have an assertion to the correct type
    methods.setValue(name, event.target.value);
  };

  return (
    <Controller
      {...{ name }}
      {...{ control }}
      render={({ field }) => (
        <FormControl
          sx={{ m: 1, minWidth: 180 }}
          size="small"
          className={className + ' m-2 [&>.MuiInputBase-root]:bg-white'}
        >
          <InputLabel id={`select-label-${key}`}>{label}</InputLabel>
          <Select
            labelId={`select-label-${key}`}
            id="outlined-basic"
            label={label}
            // value={methods.getValues(name)}
            // value={methods.getFieldState(name)}
            // value={methods}
            // value={<MenuItem value="discord">Discord</MenuItem>}
            // value={}
            onChange={handleChange}
          >
            {children}
          </Select>
        </FormControl>
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

export default FormSelect;
