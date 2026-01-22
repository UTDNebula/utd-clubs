'use client';

import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTRPC } from '@src/trpc/react';
import useDebounce from '@src/utils/useDebounce';

export const ClubSearchBar = () => {
  const [input, setInput] = useState('');
  const debouncedSearch = useDebounce(input, 300);
  const router = useRouter();
  const api = useTRPC();

  const { data, isFetching } = useQuery(
    api.club.byName.queryOptions(
      { name: debouncedSearch },
      {
        enabled: !!debouncedSearch,
        placeholderData: keepPreviousData,
      },
    ),
  );

  return (
    <Autocomplete
      freeSolo
      disableClearable
      autoHighlight
      className="w-full"
      aria-label="search"
      inputValue={input}
      options={input === '' ? [] : (data ?? [])}
      filterOptions={(o) => o}
      onChange={(event, value, reason) => {
        // navigation
        if (reason == 'selectOption' && value && typeof value !== 'string') {
          router.push(`/directory/${value.slug}`);
        } else if (reason == 'createOption') {
          // if no exact match, go to home screen search to try misspellings
          router.push(`/?search=${input}`);
        }
      }}
      onInputChange={(e, value) => {
        setInput(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          className="w-full"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <div className="flex gap-2 items-center">
                  <InputAdornment position="end">
                    {params.InputProps.endAdornment}
                    {isFetching ? (
                      <CircularProgress color="inherit" size={24} />
                    ) : (
                      <SearchIcon />
                    )}
                  </InputAdornment>
                </div>
              ),
              type: 'search',
              className:
                'bg-white dark:bg-neutral-900 rounded-full ' +
                params.InputProps.className,
            },
          }}
          placeholder="Search for Clubs"
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <li key={key} {...otherProps}>
            <Typography variant="body1">{option.name}</Typography>
          </li>
        );
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        return option.name;
      }}
      getOptionKey={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        return option.id;
      }}
    />
  );
};
