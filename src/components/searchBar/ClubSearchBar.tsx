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
import Link from 'next/link';
import { useState } from 'react';
import { useTRPC } from '@src/trpc/react';
import useDebounce from '@src/utils/useDebounce';

export const ClubSearchBar = () => {
  const [input, setInput] = useState('');
  const debouncedSearch = useDebounce(input, 300);
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
      className="w-full"
      aria-label="search"
      inputValue={input}
      options={input == '' ? [] : (data ?? [])}
      filterOptions={(o) => o}
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
              sx: {
                background: 'white',
                borderRadius: 'calc(infinity * 1px)',
              },
            },
          }}
          placeholder="Search for Clubs"
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Link key={key} href={`/directory/${option.slug}`}>
            <li {...otherProps}>
              <Typography variant="body1">{option.name}</Typography>
            </li>
          </Link>
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
