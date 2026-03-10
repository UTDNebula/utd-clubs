'use client';

import TagIcon from '@mui/icons-material/Tag';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import { TagChip } from '@src/components/common/TagChip';
import { useTRPC } from '@src/trpc/react';

type ClubTagFilterProps = {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  vertical?: boolean;
};

export default function ClubTagFilter({
  value,
  onChange,
  onBlur,
  error,
  helperText,
  label,
  vertical,
}: ClubTagFilterProps) {
  const api = useTRPC();

  const { data: allTags, isFetching } = useQuery(
    api.club.distinctTags.queryOptions(),
  );

  return (
    <Autocomplete
      disableCloseOnSelect
      disableClearable
      multiple
      handleHomeEndKeys
      selectOnFocus
      clearOnBlur
      noOptionsText="No tags found"
      aria-label="search"
      value={value}
      options={allTags ?? []}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search club tags"
          label={label ?? 'Tags'}
          className="[&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-neutral-900"
          slotProps={{
            input: {
              ...params.InputProps,
              className: vertical
                ? 'flex-col items-start'
                : params.InputProps.className,
              endAdornment: (
                <>
                  {isFetching ? (
                    <CircularProgress
                      color="inherit"
                      size={20}
                      className={
                        vertical ? 'absolute right-10 bottom-4.5' : undefined
                      }
                    />
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
            <TagChip
              key={key}
              icon={<TagIcon color="inherit" />}
              tag={option}
              {...itemProps}
            />
          );
        });
      }}
      onChange={(_e, value) => {
        onChange(value);
      }}
      onBlur={onBlur}
    />
  );
}
