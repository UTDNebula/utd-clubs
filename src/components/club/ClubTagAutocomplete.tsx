'use client';

import TagIcon from '@mui/icons-material/Tag';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import { TagChip } from '@src/components/common/TagChip';
import { useTRPC } from '@src/trpc/react';

type ClubTagAutocompleteProps = {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  placeholder?: string;
  noOptionsText?: string;
  vertical?: boolean;
  allowAddingOptions?: boolean;
  className?: string;
};

export default function ClubTagAutocomplete({
  value,
  onChange,
  onBlur,
  error,
  helperText,
  label,
  placeholder,
  noOptionsText,
  vertical,
  allowAddingOptions = false,
  className,
}: ClubTagAutocompleteProps) {
  const api = useTRPC();

  const { data: allTags, isFetching } = useQuery(
    api.club.distinctTags.queryOptions(),
  );

  const filter = createFilterOptions<string>({});
  const stringOptions = allTags?.map((tag) => tag.tag) ?? [];

  return (
    <Autocomplete
      disableCloseOnSelect
      disableClearable
      multiple
      handleHomeEndKeys
      selectOnFocus
      clearOnBlur
      noOptionsText={
        noOptionsText ?? (allowAddingOptions ? 'Loading...' : 'No tags found')
      }
      aria-label={allowAddingOptions ? 'Tag search' : 'Tag search and adding'}
      value={value}
      options={stringOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={
            placeholder ??
            (allowAddingOptions
              ? 'Search tags or add custom'
              : 'Search club tags')
          }
          label={label ?? 'Tags'}
          className="[&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-neutral-800"
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
      filterOptions={
        allowAddingOptions
          ? (options, params) => {
            const filtered = filter(options, params);

            const ignoredWords = ['and', 'or', 'of', 'in', 'the'];

            // Trim user specified tag, then capitalize first letter of every word except ignoredWords
            const input = params.inputValue
              .trim()
              .replace(/\b\w+/g, (word, index) => {
                if (index > 0 && ignoredWords.includes(word.toLowerCase())) {
                  return word;
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
              });

            // Wait for fetching, don't allow blank tags, don't allow already existing tags
            if (!isFetching && input != '' && !options.includes(input)) {
              filtered.push(`Add "${input}" tag`);
            }

            return filtered;
          }
          : undefined
      }
      onChange={(_e, value) => {
        if (allowAddingOptions) {
          const last = value[value.length - 1];
          if (typeof last === 'string' && last.startsWith('Add ')) {
            // Trim the (Add ) and the ( tag) part of the
            value[value.length - 1] = last.substring(5, last.length - 5);
          }
        }
        onChange(value);
      }}
      onBlur={onBlur}
      className={className}
    />
  );
}
