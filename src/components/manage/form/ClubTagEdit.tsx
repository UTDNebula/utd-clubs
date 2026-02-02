'use client';

import TagIcon from '@mui/icons-material/Tag';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@src/trpc/react';

export const ClubTagEdit = ({
  value,
  onChange,
  onBlur,
  error,
  helperText,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur: () => void;
  error?: boolean;
  helperText?: string;
}) => {
  const api = useTRPC();

  const { data: allTags, isFetching } = useQuery(
    api.club.distinctTags.queryOptions(),
  );

  const filter = createFilterOptions<string>({});

  return (
    <Autocomplete
      disableCloseOnSelect
      disableClearable
      multiple
      handleHomeEndKeys
      selectOnFocus
      clearOnBlur
      noOptionsText="Loading..."
      aria-label="search"
      value={value}
      options={allTags ?? []}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search tags or add custom"
          label="Tags"
          required
          className="[&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-neutral-900"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {isFetching ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
          error={error}
          helperText={helperText}
        />
      )}
      renderValue={(value, getItemProps) => {
        return value.map((option: string, index: number) => {
          const { key, ...itemProps } = getItemProps({ index });
          return (
            <Chip
              key={key}
              icon={<TagIcon color="inherit" />}
              label={option}
              color="primary"
              {...itemProps}
            />
          );
        });
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        // Trim user specified tag
        const input = params.inputValue.trim();

        // Wait for fetching, and don't allow blank tags
        if (!isFetching && input != '') {
          filtered.push(`Add "${input}" tag`);
        }

        return filtered;
      }}
      onChange={(_e, value) => {
        const last = value[value.length - 1];
        if (typeof last === 'string' && last.startsWith('Add ')) {
          // Trim the (Add ) and the ( tag) part of the
          value[value.length - 1] = last.substring(5, last.length - 5);
        }
        onChange(value);
      }}
      onBlur={onBlur}
    />
  );
};
