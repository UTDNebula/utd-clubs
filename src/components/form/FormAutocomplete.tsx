import Autocomplete from '@mui/material/Autocomplete';
import { useFieldContext } from '@src/utils/form';
import { StyledTextField } from './FormTextField';

type FormAutocompleteFreeSoloProps = {
  label: string;
  options: string[];
  className?: string;
};

export function FormAutocompleteFreeSolo({
  label,
  options,
  className,
  ...props
}: FormAutocompleteFreeSoloProps) {
  const field = useFieldContext<string>();
  return (
    <Autocomplete
      freeSolo
      options={options}
      className={`w-64 ${className}`}
      size="small"
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(_e, newValue) => field.handleChange(newValue ?? '')}
      filterSelectedOptions
      renderInput={(params) => (
        <StyledTextField
          {...params}
          label={label}
          error={!field.state.meta.isValid}
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
