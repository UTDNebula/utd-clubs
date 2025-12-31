import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useFieldContext } from '@src/utils/form';

type StyledTextFieldProps = TextFieldProps;

export function StyledTextField(props: StyledTextFieldProps) {
  return (
    <TextField
      className="[&>.MuiInputBase-root]:bg-white"
      size="small"
      {...props}
    />
  );
}

export default function FormTextField({ label }: { label: string }) {
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
    />
  );
}
