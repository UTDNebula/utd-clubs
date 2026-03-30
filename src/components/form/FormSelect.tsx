import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';
import { ReactNode } from 'react';
import { useFieldContext } from '@src/utils/form';

export interface SelectOptionBase<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  selected?: boolean;
}

export type SelectOption<T = string> =
  | (Omit<SelectOptionBase<T>, 'label'> &
      Partial<Pick<SelectOptionBase<T>, 'label'>>)
  | (Omit<SelectOptionBase<T>, 'value'> &
      Partial<Pick<SelectOptionBase<T>, 'value'>>)
  | string;

type FormSelectProps = Omit<
  SelectProps,
  'value' | 'onChange' | 'children' | 'options' | 'label'
> & {
  label?: string;
  options?: SelectOption[];
  children?: ReactNode;
};

export default function FormSelect({
  label,
  options,
  children,
  className,
  ...props
}: FormSelectProps) {
  const field = useFieldContext<string>();
  const normalizedOptions = options?.map((option) => {
    if (typeof option === 'string') {
      return { label: option };
    } else {
      return option;
    }
  });

  return (
    <FormControl className={`w-64 ${className}`} size="small">
      {label ? <InputLabel>{label}</InputLabel> : null}
      <GenericSelect
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className="bg-white dark:bg-neutral-900"
        size="small"
        error={!field.state.meta.isValid}
        label={label}
        {...props}
      >
        {children}
        {normalizedOptions?.map((option) => (
          <MenuItem
            key={option.value ?? option.label}
            value={option.value ?? option.label}
            selected={option.selected}
            disabled={option.disabled}
          >
            {option.label ?? option.value}
          </MenuItem>
        ))}
      </GenericSelect>
      <FormHelperText>
        {!field.state.meta.isValid
          ? field.state.meta.errors.map((err) => err?.message).join('. ') + '.'
          : undefined}
      </FormHelperText>
    </FormControl>
  );
}

type GenericSelectProps<T> = Omit<SelectProps<T>, 'value' | 'onChange'> & {
  value: T;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    child: React.ReactNode,
  ) => void;
};

const GenericSelect = <T,>({
  value,
  onChange,
  children,
  ...rest
}: GenericSelectProps<T>) => {
  return (
    <Select
      value={value}
      onChange={onChange as SelectProps<T>['onChange']}
      {...rest}
    >
      {children}
    </Select>
  );
};
