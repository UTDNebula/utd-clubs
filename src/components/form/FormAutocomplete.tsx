import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { ReactNode, useMemo } from 'react';
import { useFieldContext } from '@src/utils/form';
import { SelectOption } from './FormSelect';
import { StyledTextField } from './FormTextField';

type FormAutocompletePropsBase<
  Value,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> = {
  label: ReactNode;
  options: SelectOption<Value>[];
  multiple?: never; // Figure out how to implement this later
  disableClearable?: DisableClearable;
  freeSolo?: FreeSolo;
};

// interface FormAutocompleteProps<
//   Value,
//   Multiple extends boolean | undefined,
//   DisableClearable extends boolean | undefined,
//   FreeSolo extends boolean | undefined,
// > extends FormAutocompletePropsBase<
//       Value,
//       Multiple,
//       DisableClearable,
//       FreeSolo
//     >,
//     Omit<
//       AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo>,
//       | keyof FormAutocompletePropsBase<
//           Value,
//           Multiple,
//           DisableClearable,
//           FreeSolo
//         >
//       | 'renderInput'
//     > {}

interface FormAutocompleteProps<
  Value,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> {
  label: ReactNode;
  options: SelectOption<Value>[];
  multiple?: never; // Figure out how to implement this later
  disableClearable?: DisableClearable;
  freeSolo?: FreeSolo;
}

export default function FormAutocomplete<
  Value,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>({
  label,
  options,
  freeSolo,
  ...props
}: FormAutocompleteProps<Value, Multiple, DisableClearable, FreeSolo>) {
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
    <Autocomplete
      // disableClearable
      className="w-64"
      size="small"
      freeSolo={freeSolo}
      onBlur={field.handleBlur}
      value={selectedObject}
      onChange={(_e, newValue) => {
        if (!freeSolo) {
          if (typeof newValue === 'string') {
            field.handleChange(newValue);
          } else if (typeof newValue?.value === 'string') {
            field.handleChange(newValue?.value ?? newValue?.label ?? '');
          } else {
            field.handleChange('Unknown value');
          }
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
          return (
            option.label ??
            (typeof option.value === 'string' ? option.value : null) ??
            'Unknown option label'
          );
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
            {option.label ?? String(option.value)}
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
              ? field.state.meta.errors.map((err) => err?.message).join('. ') +
                '.'
              : undefined
          }
        />
      )}
      {...props}
    />
  );
}
