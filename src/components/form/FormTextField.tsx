import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useFieldContext } from '@src/utils/form';

type StyledTextFieldProps = TextFieldProps;

export function StyledTextField(props: StyledTextFieldProps) {
  return (
    <TextField
      size={props.size ?? (props.multiline ? 'medium' : 'small')}
      {...props}
      className={`[&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-neutral-900 w-full ${props.className}`}
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
  helperText,
  ...props
}: FormTextFieldFieldProps) {
  const field = useFieldContext<string>();
  const errorMessage = !field.state.meta.isValid
    ? field.state.meta.errors.map((err) => err?.message).join('. ') + '.'
    : undefined;
  return (
    <StyledTextField
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      error={!field.state.meta.isValid}
      helperText={errorMessage ?? helperText}
      label={label}
      {...props}
    />
  );
}
