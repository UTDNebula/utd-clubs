import TextField from '@mui/material/TextField';
import { useFieldContext } from '@src/utils/form';

export default function FormTextField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  return (
    <TextField
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      className="grow-100 [&>.MuiInputBase-root]:bg-white"
      size="small"
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
