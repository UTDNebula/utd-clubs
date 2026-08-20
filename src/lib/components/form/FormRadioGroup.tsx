import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import RadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup';
import { useFieldContext } from '@/lib/utils/form';
import { SelectOption } from './FormSelect';

type FormRadioGroupProps = Omit<
  RadioGroupProps,
  'value' | 'onChange' | 'defaultValue'
> & {
  label?: string;
  options: SelectOption[];
  required?: boolean;
  allowDeselect?: boolean;
  className?: string;
};

export default function FormRadioGroup({
  label,
  options,
  required,
  allowDeselect = true,
  className,
  ...props
}: FormRadioGroupProps) {
  const field = useFieldContext<string>();
  const value = field.state.value ?? '';
  const normalizedOptions = options.map((option) => {
    if (typeof option === 'string') {
      return { label: option, value: option };
    } else {
      return {
        label: option.label ?? (option.value as string),
        value: (option.value ?? option.label) as string,
        disabled: option.disabled,
      };
    }
  });

  return (
    <FormControl
      className={`flex flex-col gap-1 ${className ?? ''}`}
      error={!field.state.meta.isValid}
    >
      {label ? (
        <label className="whitespace-pre-line">
          {label}
          {required && (
            <span className="text-red-600 dark:text-red-400"> *</span>
          )}
        </label>
      ) : null}
      <RadioGroup
        value={value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
      >
        {normalizedOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <div key={option.value} className="flex items-center">
              <Radio
                id={`${field.name}-${option.value}`}
                value={option.value}
                size="small"
                checked={isSelected}
                disabled={option.disabled}
                onClick={() => {
                  if (allowDeselect && isSelected) {
                    field.handleChange('');
                  }
                }}
              />
              <label
                htmlFor={`${field.name}-${option.value}`}
                className="ml-1 cursor-pointer text-sm"
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </RadioGroup>
      {!field.state.meta.isValid && (
        <FormHelperText error>
          {field.state.meta.errors.map((err) => err?.message).join('. ') + '.'}
        </FormHelperText>
      )}
    </FormControl>
  );
}
