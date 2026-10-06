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
import { useBaseHeaderContext } from '@/lib/components/BaseHeader';
import useDebounce from '@/lib/utils/useDebounce';
import { useTRPC } from '@/trpc/react';

export type ClubSearchResult = {
  id: string;
  name: string;
  slug: string;
};

type ClubSearchBarProps = {
  input: string;
  onChange: (input: string) => void;
  onSelect: (value: string | ClubSearchResult) => void;
};

export const ClubSearchBar = ({
  input,
  onChange,
  onSelect,
}: ClubSearchBarProps) => {
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

  const { openCollapsibleSearchBar } = useBaseHeaderContext();

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
        if (reason === 'selectOption' && value && typeof value !== 'string') {
          onSelect(value);
        } else if (reason === 'createOption' && typeof value === 'string') {
          onSelect(value);
        }
      }}
      onInputChange={(event, value) => {
        onChange(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          className="w-full"
          // Focus small screen search bar whenever user presses search icon button
          autoFocus={openCollapsibleSearchBar}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <div className="flex items-center gap-2">
                  <InputAdornment position="end">
                    {params.slotProps.input.endAdornment}
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
                'bg-white dark:bg-neutral-800 rounded-full ' +
                params.slotProps.input.className,
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
