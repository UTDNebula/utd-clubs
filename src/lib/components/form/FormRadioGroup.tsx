import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup';
import { ReactNode, useMemo } from 'react';
import { useFieldContext } from '@/lib/utils/form';
import { SelectOption } from './FormSelect';

export type FormRadioGroupOption = {
  label: ReactNode;
  value: string;
  disabled?: boolean;
};

export type FormRadioGroupProps = Omit<
  RadioGroupProps,
  'value' | 'onChange' | 'defaultValue' | 'name'
> & {
  label?: ReactNode;
  options?: (SelectOption | string)[];
  helperText?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  allowDeselect?: boolean;
  row?: boolean;
  size?: 'small' | 'medium';
  className?: string;
};

export default function FormRadioGroup({
  label,
  options = [],
  helperText,
  required,
  disabled,
  allowDeselect = true,
  row = false,
  size = 'small',
  className,
  ...props
}: FormRadioGroupProps) {
  const field = useFieldContext<string>();
  const value = field.state.value ?? '';

  const normalizedOptions = useMemo<FormRadioGroupOption[]>(() => {
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

  const errorMessage = !field.state.meta.isValid
    ? (field.state.meta.errors as unknown as (string | { message?: string })[])
        .map((err) => (typeof err === 'string' ? err : err?.message))
        .filter(Boolean)
        .join('. ') + '.'
    : undefined;

  return (
    <FormControl
      className={`flex flex-col gap-1 ${className ?? ''}`}
      error={!field.state.meta.isValid}
      disabled={disabled}
      required={required}
    >
      {label ? (
        <FormLabel
          id={`${field.name}-label`}
          error={!field.state.meta.isValid}
          required={required}
          className="text-sm font-medium whitespace-pre-line text-neutral-700 dark:text-neutral-300"
        >
          {label}
        </FormLabel>
      ) : null}
      <RadioGroup
        aria-labelledby={label ? `${field.name}-label` : undefined}
        name={field.name}
        value={value}
        row={row}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
      >
        {normalizedOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <FormControlLabel
              key={option.value}
              value={option.value}
              disabled={disabled || option.disabled}
              control={
                <Radio
                  id={`${field.name}-${option.value}`}
                  size={size}
                  disabled={disabled || option.disabled}
                />
              }
              label={option.label}
              onClick={(e) => {
                if (allowDeselect && isSelected) {
                  e.preventDefault();
                  field.handleChange('');
                }
              }}
              className="text-neutral-800 dark:text-neutral-200"
            />
          );
        })}
      </RadioGroup>
      {(errorMessage || helperText) && (
        <FormHelperText error={!field.state.meta.isValid}>
          {errorMessage ?? helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export { FormRadioGroup };
