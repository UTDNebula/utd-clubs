import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import useDebounce from 'src/utils/useDebounce';

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
  const debouncedValue = useDebounce(value, debounce);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      size="small"
      className={`min-w-16 text-xs [&>.MuiInputBase-root]:max-h-8 ${props.className ?? ''}`}
    />
  );
}
