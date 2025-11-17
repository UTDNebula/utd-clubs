/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { type ReactNode } from 'react';
import {
  Controller,
  useFormContext,
  type ControllerProps,
  type FieldValues,
} from 'react-hook-form';

type FormDatePickerProps<TFormValues extends FieldValues> = Omit<
  ControllerProps<TFormValues>,
  'render'
> & {
  className?: string | undefined;
  label?: ReactNode;
};

const FormDateField = <TFormValues extends FieldValues>({
  name,
  label,
  className,
  rules,
  ...props
}: FormDatePickerProps<TFormValues>) => {
  const methods = useFormContext();

  const error = methods.getFieldState(name).error;

  return (
    <Controller
      name={name}
      {...props}
      render={({ field }) => (
        <DatePicker
          // value={parseISO(date)}
          // onChange={(newValue, context) => {
          //   if (context.validationError == null && newValue != null) {
          //     setDate(newValue);
          //   }
          // }}
          // className="[&>.MuiInputBase-root]:bg-white "
          slotProps={{
            actionBar: {
              actions: ['today', 'accept'],
            },
            textField: {
              id: 'outlined-basic',
              variant: 'outlined',
              size: 'small',
              label: label,
              ...field,
              // // TODO: This doesn't work, investigate how to pull required from Zod schema
              // required: !!rules?.required || !!rules?.min,
              error: !!error,
              helperText: error?.message,
              className: className + ' m-2 [&>.MuiInputBase-root]:bg-white',
            },
          }}
        />
      )}
    />
  );
};

export default FormDateField;
