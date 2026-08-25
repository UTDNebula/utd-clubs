import Autocomplete from '@mui/material/Autocomplete';
import { useFieldContext } from '@/lib/utils/form';
import { StyledTextField } from './FormTextField';

type FormAutocompleteFreeSoloProps = {
  label?: string;
  placeholder?: string;
  options: string[];
  className?: string;
  required?: boolean;
};

export function FormAutocompleteFreeSolo({
  label,
  placeholder,
  options,
  className,
  required,
  ...props
}: FormAutocompleteFreeSoloProps) {
  const field = useFieldContext<string>();
  return (
    <Autocomplete
      freeSolo
      autoSelect
      options={options}
      className={className ?? 'w-64'}
      size="small"
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(_e, newValue) => field.handleChange(newValue ?? '')}
      filterSelectedOptions
      renderInput={(params) => (
        <StyledTextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={!field.state.meta.isValid}
          required={required}
          helperText={
            !field.state.meta.isValid
              ? (
                  field.state.meta.errors as unknown as {
                    message: string;
                  }[]
                )
                  .map((err) => err?.message)
                  .join('. ') + '.'
              : undefined
          }
          className="w-full"
        />
      )}
      {...props}
    />
  );
}
