/*
 * # NOTE ABOUT THE `FormAutocomplete` COMPONENT
 * This component is still a work in progress due to its complexity, so it is
 * best to re-implement an Autocomplete component yourself and add any features
 * you may need.
 *
 * Things that are broken:
 * - Filtering options
 * - `multiple` prop
 * - Using `AutocompleteProps`
 * - ...and probably a lot more
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import Autocomplete, {
  AutocompleteProps,
  createFilterOptions,
} from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { ReactNode, useMemo } from 'react';
import { useFieldContext } from '@src/utils/form';
import { SelectOption, SelectOptionBase } from './FormSelect';
import { StyledTextField } from './FormTextField';

const filterOptions = createFilterOptions<SelectOptionBase>({
  matchFrom: 'any',
  stringify: (option) => {
    return option.label ?? option.value;
  },
  trim: true,
});

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
  className?: string;
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
  className,
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

  const selectedObject = useMemo(() => {
    const found = normalizedOptions.find(
      (option) => (option.value ?? option.label) === field.state.value,
    );
    return found ?? null;
  }, [field.state.value, normalizedOptions]);

  return (
    <Autocomplete
      // disableClearable
      className={`w-64 ${className}`}
      size="small"
      freeSolo={freeSolo}
      onBlur={field.handleBlur}
      /* @ts-expect-error MUI complains about switching from uncontrolled to controlled, so we set selectedObject to null on line 108 and expect this error */
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
      getOptionKey={(option) => {
        if (typeof option === 'string') {
          return option.replaceAll(' ', '');
        } else {
          return (
            (typeof option.value === 'string'
              ? option.value.replaceAll(' ', '')
              : null) ??
            option.label?.replaceAll(' ', '') ??
            'UnknownKey'
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
          className="w-full"
        />
      )}
      // filterOptions={filterOptions}
      {...props}
    />
  );
}

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
