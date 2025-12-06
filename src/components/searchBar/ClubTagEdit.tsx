'use client';

import TagIcon from '@mui/icons-material/Tag';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@src/trpc/react';

export const ClubTagEdit = ({
  tags,
  setTagsAction,
}: {
  tags: string[];
  setTagsAction: (value: string[]) => void;
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
      aria-label="search"
      value={tags}
      options={allTags ?? []}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search tags or add custom"
          label="Tags"
          className="[&>.MuiInputBase-root]:bg-white"
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
        setTagsAction(value);
      }}
    />
  );
};
