'use client';

import { Autocomplete, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTRPC } from '@src/trpc/react';
import useDebounce from '@src/utils/useDebounce';

function getFullName(user: { firstName: string; lastName: string }) {
  return user.firstName + ' ' + user.lastName;
}

type UserSearchBarProps = {
  passUser: (user: { id: string; name: string }) => void;
};

export const UserSearchBar = ({ passUser }: UserSearchBarProps) => {
  const [input, setInput] = useState('');
  const debouncedSearch = useDebounce(input, 300);
  const api = useTRPC();
  const { data } = useQuery(
    api.userMetadata.searchByName.queryOptions(
      { name: debouncedSearch },
      { enabled: !!debouncedSearch },
    ),
  );

  return (
    <Autocomplete
      freeSolo
      disableClearable
      className="w-full max-w-xs md:max-w-sm lg:max-w-md"
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
          slotProps={{
            input: {
              ...params.InputProps,
              type: 'search',
              sx: {
                background: 'white',
                borderRadius: 'calc(infinity * 1px)',
              },
            },
          }}
          placeholder="Search for Someone"
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <li
            key={key}
            {...otherProps}
            onClick={() => {
              passUser({ id: option.id, name: getFullName(option) });
              setInput('');
            }}
          >
            <Typography variant="body1">{getFullName(option)}</Typography>
          </li>
        );
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        return getFullName(option);
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
