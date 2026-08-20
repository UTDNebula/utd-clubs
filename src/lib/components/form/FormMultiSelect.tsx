import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectProps } from '@mui/material/Select';
import { TagChip } from '@/lib/components/TagChip';
import { useFieldContext } from '@/lib/utils/form';
import { SelectOption } from './FormSelect';

type FormMultiSelectProps = Omit<
  SelectProps<string[]>,
  'value' | 'onChange' | 'multiple' | 'options' | 'label'
> & {
  label?: string;
  options?: SelectOption[];
  className?: string;
};

export default function FormMultiSelect({
  label,
  options,
  className,
  ...props
}: FormMultiSelectProps) {
  const field = useFieldContext<string[]>();
  const value = Array.isArray(field.state.value) ? field.state.value : [];
  const normalizedOptions = options?.map((option) => {
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
    <FormControl className={`w-64 ${className}`} size="small">
      {label ? (
        <InputLabel error={!field.state.meta.isValid} required={props.required}>
          {label}
        </InputLabel>
      ) : null}
      <Select
        multiple
        value={value}
        onBlur={field.handleBlur}
        onChange={(event) => {
          const val = event.target.value;
          field.handleChange(
            typeof val === 'string' ? val.split(',') : (val as string[]),
          );
        }}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <div className="flex flex-wrap gap-1">
            {(selected as string[]).map((selectedVal) => (
              <TagChip key={selectedVal} tag={selectedVal} size="small" />
            ))}
          </div>
        )}
        MenuProps={{
          slotProps: {
            paper: {
              className: 'max-h-60',
            },
          },
        }}
        className="bg-white dark:bg-neutral-800"
        size="small"
        error={!field.state.meta.isValid}
        label={label}
        {...props}
      >
        {normalizedOptions?.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText error={!field.state.meta.isValid}>
        {!field.state.meta.isValid
          ? field.state.meta.errors.map((err) => err?.message).join('. ') + '.'
          : undefined}
      </FormHelperText>
    </FormControl>
  );
}
