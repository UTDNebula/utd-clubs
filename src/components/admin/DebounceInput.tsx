import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useEffect, useState } from 'react';

type Props = {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<TextFieldProps, 'onChange'>;

export default function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: Props) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      size="small"
      className={`[&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-haiti min-w-16 [&>.MuiInputBase-root]:max-h-8 text-xs ${props.className ?? ''}`}
    />
  );
}
