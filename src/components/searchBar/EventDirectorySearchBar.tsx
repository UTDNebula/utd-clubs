import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import theme from '@src/utils/theme';
import { useEventDirectoryStore } from '../events/directory/filter/utils';

type EventDirectorySearchBarProps = {
  initialValue?: string;
  onChange?: (value: string) => void;
};

export default function EventDirectorySearchBar({
  initialValue,
  onChange,
}: EventDirectorySearchBarProps) {
  const loading =
    useEventDirectoryStore((state) => state.fetchStatus) === 'fetching';

  const [input, setInput] = useState(initialValue ?? '');
  const [focused, setFocused] = useState(false);

  const showCircularProgress = loading && focused;
  const StyledCircularProgress = <CircularProgress size={24} color="inherit" />;

  return (
    <Box
      className="relative overflow-clip"
      sx={{
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <TextField
        value={input}
        onChange={(e) => {
          const newValue = e.target.value;
          setInput(newValue);
          onChange?.(newValue);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        size="small"
        className="w-full"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment
                position="end"
                className="text-neutral-800 dark:text-neutral-200"
              >
                {input ? (
                  <Tooltip title="Clear search" disableInteractive>
                    <IconButton
                      onClick={() => {
                        setInput('');
                        onChange?.('');
                      }}
                      size="small"
                      className="-mr-1"
                    >
                      {showCircularProgress ? (
                        StyledCircularProgress
                      ) : (
                        <ClearIcon color="inherit" />
                      )}
                    </IconButton>
                  </Tooltip>
                ) : showCircularProgress ? (
                  StyledCircularProgress
                ) : (
                  <SearchIcon color="inherit" />
                )}
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
      {!focused && (
        <LinearProgress
          className={`absolute bottom-0 w-full transition-[height,_opacity] ${loading ? 'opacity-100 h-1' : 'opacity-0 h-0'}`}
        />
      )}
    </Box>
  );
}
