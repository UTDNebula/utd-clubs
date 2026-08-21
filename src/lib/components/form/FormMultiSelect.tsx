import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import { ReactNode, useMemo } from 'react';
import { TagChip } from '@/lib/components/TagChip';
import { useFieldContext } from '@/lib/utils/form';
import { SelectOption } from './FormSelect';
import { StyledTextField } from './FormTextField';

export type NormalizedMultiSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type FormMultiSelectProps = Omit<
  AutocompleteProps<NormalizedMultiSelectOption, true, false, false>,
  'value' | 'onChange' | 'options' | 'renderInput' | 'multiple'
> & {
  label?: string;
  placeholder?: string;
  options?: (SelectOption | string)[];
  helperText?: ReactNode;
  required?: boolean;
  className?: string;
  size?: 'small' | 'medium';
};

export default function FormMultiSelect({
  label,
  placeholder,
  options = [],
  helperText,
  required,
  className,
  size = 'small',
  disabled,
  readOnly,
  disableCloseOnSelect = true,
  ...props
}: FormMultiSelectProps) {
  const field = useFieldContext<string[]>();

  const normalizedOptions = useMemo<NormalizedMultiSelectOption[]>(() => {
    return options.map((option) => {
      if (typeof option === 'string') {
        return { label: option, value: option, disabled: false };
      }
      return {
        label: option.label ?? (option.value as string) ?? '',
        value: (option.value ?? option.label) as string,
        disabled: option.disabled ?? false,
      };
    });
  }, [options]);

  const selectedOptions = useMemo(() => {
    const rawValues = Array.isArray(field.state.value) ? field.state.value : [];
    return rawValues.map((val) => {
      const match = normalizedOptions.find((opt) => opt.value === val);
      return match ?? { label: val, value: val, disabled: false };
    });
  }, [field.state.value, normalizedOptions]);

  const errorMessage = !field.state.meta.isValid
    ? (field.state.meta.errors as unknown as (string | { message?: string })[])
        .map((err) => (typeof err === 'string' ? err : err?.message))
        .filter(Boolean)
        .join('. ') + '.'
    : undefined;

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect={disableCloseOnSelect}
      options={normalizedOptions}
      value={selectedOptions}
      size={size}
      disabled={disabled}
      readOnly={readOnly}
      className={className ?? 'w-64'}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      getOptionLabel={(option) => option.label}
      getOptionDisabled={(option) => !!option.disabled}
      onBlur={field.handleBlur}
      onChange={(_event, newValue) => {
        field.handleChange(newValue.map((item) => item.value));
      }}
      renderOption={(props, option, { selected }) => {
        const { key, ...otherProps } = props;
        return (
          <li
            key={key}
            {...otherProps}
            className={`flex items-center gap-2 ${otherProps.className ?? ''}`}
          >
            <Checkbox
              size="small"
              checked={selected}
              className="p-0 text-neutral-500 dark:text-neutral-400"
            />
            <span className="text-sm">{option.label}</span>
          </li>
        );
      }}
      renderValue={(value, getItemProps) =>
        value.map((option, index) => {
          const { key, ...itemProps } = getItemProps({ index });
          return (
            <TagChip key={key} tag={option.label} size={size} {...itemProps} />
          );
        })
      }
      renderInput={(params) => (
        <StyledTextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={!field.state.meta.isValid}
          helperText={errorMessage ?? helperText}
          size={size}
          className="w-full"
        />
      )}
      {...props}
    />
  );
}

export { FormMultiSelect };
