'use client';

import {
  Autocomplete,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useTRPC } from '@src/trpc/react';
import useDebounce from '@src/utils/useDebounce';

function getFullName(user: {
  firstName: string | null;
  lastName: string | null;
}) {
  return `${user.firstName ?? ''} ${user.lastName ?? ''}`;
}

type UserSearchBarProps = {
  passUser: (user: { id: string; name: string; email: string }) => void;
  placeholder?: string;
  className?: string;
};

export const UserSearchBar = ({
  passUser,
  placeholder,
  className,
}: UserSearchBarProps) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = React.useState(false);

  const debouncedSearch = useDebounce(input, 300);
  const api = useTRPC();
  const { data } = useQuery(
    api.userMetadata.searchByNameOrEmail.queryOptions(
      { search: debouncedSearch },
      { enabled: !!debouncedSearch },
    ),
  );

  useEffect(() => {
    setLoading(false);
  }, [data]);

  return (
    <Autocomplete
      freeSolo
      disableClearable
      // className="w-full max-w-xs md:max-w-sm lg:max-w-md"
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
          className={'w-full' + ' ' + className}
          onChange={() => {
            setLoading(true);
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              type: 'search',
              className:
                'bg-white dark:bg-haiti rounded-full ' +
                params.InputProps.className,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
          placeholder={placeholder ?? 'Search for Someone'}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <li
            key={key}
            {...otherProps}
            onClick={() => {
              passUser({
                id: option.id,
                name: getFullName(option),
                email: option.email,
              });
              setInput('');
            }}
          >
            <div>
              <Typography variant="body1">{getFullName(option)}</Typography>
              <Typography variant="caption">{option.email}</Typography>
            </div>
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
