'use client';

import { Autocomplete, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { useTRPC } from '@src/trpc/react';
import useDebounce from '@src/utils/useDebounce';
import { useBaseHeaderContext } from '../header/BaseHeader';

export const EventSearchBar = () => {
  const [input, setInput] = useState('');
  const debouncedSearch = useDebounce(input, 300);
  const api = useTRPC();
  const { data } = useQuery(
    api.event.byName.queryOptions(
      { name: debouncedSearch, sortByDate: true },
      { enabled: !!input },
    ),
  );

  const { openCompactSearchBar } = useBaseHeaderContext();

  return (
    <Autocomplete
      freeSolo
      disableClearable
      className="w-full"
      aria-label="search"
      inputValue={input}
      options={data ?? []}
      filterOptions={(o) => o}
      onInputChange={(e, value) => {
        setInput(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          className="w-full"
          // Focus small screen search bar whenever user presses search icon button
          autoFocus={openCompactSearchBar}
          slotProps={{
            input: {
              ...params.InputProps,
              type: 'search',
              className:
                'bg-white dark:bg-neutral-900 rounded-full ' +
                params.InputProps.className,
            },
          }}
          placeholder="Search for Events"
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Link key={key} href={`/events/${option.id}`}>
            <li {...otherProps}>
              <div>
                <Typography variant="body1">{option.name}</Typography>
                <Typography variant="caption">{option.club.name}</Typography>
              </div>
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
