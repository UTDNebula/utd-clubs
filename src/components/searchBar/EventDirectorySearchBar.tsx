import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import theme from '@src/utils/theme';

type EventDirectorySearchBarProps = {
  initialValue?: string;
  onChange?: (value: string) => void;
};

export default function EventDirectorySearchBar({
  initialValue,
  onChange,
}: EventDirectorySearchBarProps) {
  const [input, setInput] = useState(initialValue ?? '');

  return (
    <TextField
      value={input}
      onChange={(e) => {
        const newValue = e.target.value;
        setInput(newValue);
        onChange?.(newValue);
      }}
      size="small"
      className="w-full"
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment
              position="end"
              className="text-neutral-800 dark:text-neutral-200"
            >
              <SearchIcon color="inherit" />
            </InputAdornment>
          ),
          type: 'search',
          className: 'bg-white dark:bg-neutral-800 min-h-12',
          sx: {
            borderRadius: theme.shape.borderRadius,
          },
        },
      }}
      placeholder="Search events..."
    />
  );
}
