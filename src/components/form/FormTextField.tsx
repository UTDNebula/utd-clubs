import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useFieldContext } from '@src/utils/form';

type StyledTextFieldProps = TextFieldProps;

export function StyledTextField(props: StyledTextFieldProps) {
  return (
    <TextField
      size="small"
      {...props}
      className={`[&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-neutral-900 w-64 ${props.className}`}
    />
  );
}

type FormTextFieldFieldPropsBase = { label?: string };

type FormTextFieldFieldProps = Omit<
  TextFieldProps,
  keyof FormTextFieldFieldPropsBase
> &
  FormTextFieldFieldPropsBase;

export default function FormTextField({
  label,
  ...props
}: FormTextFieldFieldProps) {
  const field = useFieldContext<string>();
  return (
    <StyledTextField
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      error={!field.state.meta.isValid}
      helperText={
        !field.state.meta.isValid
          ? field.state.meta.errors.map((err) => err?.message).join('. ') + '.'
          : undefined
      }
      label={label}
      {...props}
    />
  );
}
