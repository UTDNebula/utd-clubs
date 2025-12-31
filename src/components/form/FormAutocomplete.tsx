import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { useMemo } from 'react';
import { useFieldContext } from '@src/utils/form';
import { SelectOption } from './FormSelect';
import { StyledTextField } from './FormTextField';

type FormAutocompletePropsBase = {
  label: string;
  options: SelectOption[];
  freeSolo?: boolean;
  multiple?: never; // Figure out how to implement this later
  disableClearable?: boolean;
};

// Omit<
//   AutocompleteProps<string, undefined, undefined, undefined>,
//   keyof FormAutocompletePropsBase
// > &
type FormAutocompleteProps = FormAutocompletePropsBase;

export default function FormAutocomplete({
  label,
  options,
  freeSolo,
  ...props
}: FormAutocompleteProps) {
  const field = useFieldContext<string>();
  const normalizedOptions = options?.map((option) => {
    if (typeof option === 'string') {
      return { label: option };
    } else {
      return option;
    }
  });

  const selectedObject = useMemo(
    () =>
      normalizedOptions.find(
        (option) => (option.value ?? option.label) === field.state.value,
      ),
    [field.state.value, normalizedOptions],
  );

  return (
    <div>
      <Autocomplete
        // disableClearable
        className="w-64"
        size="small"
        freeSolo={freeSolo}
        onBlur={field.handleBlur}
        value={selectedObject}
        onChange={(_e, newValue) => {
          if (typeof newValue === 'string') {
            if (!freeSolo) field.handleChange(newValue);
          } else {
            if (!freeSolo)
              field.handleChange(newValue?.value ?? newValue?.label ?? '');
          }
        }}
        inputValue={freeSolo ? field.state.value : undefined}
        onInputChange={(_e, newValue) => {
          if (freeSolo) field.handleChange(newValue);
        }}
        options={normalizedOptions}
        isOptionEqualToValue={(option, value) =>
          option.value === value.value && option.label === value.label
        }
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          } else {
            return option.label ?? option.value ?? 'Unknown option';
          }
        }}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <Box
              key={key}
              component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...optionProps}
            >
              {option.label ?? option.value}
            </Box>
          );
        }}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            label={label}
            error={!field.state.meta.isValid}
            helperText={
              !field.state.meta.isValid
                ? field.state.meta.errors
                    .map((err) => err?.message)
                    .join('. ') + '.'
                : undefined
            }
          />
        )}
        {...props}
      />
    </div>
  );
}
