'use client';

import TagIcon from '@mui/icons-material/Tag';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
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

  const { data: rawTags, isFetching } = useQuery(
    api.club.distinctTags.queryOptions(),
  );

  const filter = createFilterOptions<string>({});
  const allTags =
    rawTags?.map((t: { tag: string; count: number } | string) =>
      typeof t === 'string' ? t : t.tag,
    ) ?? [];

  const tagStringToObject = useMemo(() => {
    if (!rawTags) return {};
    return Object.fromEntries(rawTags.map((t) => [t.tag, t]));
  }, [rawTags]);

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
      options={allTags ?? []}
      renderOption={(props, option) => {
        const { key, className, ...otherProps } = props;
        const original = tagStringToObject[option];

        return (
          <li
            key={key}
            className={`flex flex-row justify-between ${className}`}
            {...otherProps}
          >
            <span>{option}</span>
            {original && (
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                {original.count}
              </span>
            )}
          </li>
        );
      }}
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
          const original = tagStringToObject[option];

          return (
            <Tooltip
              key={key}
              title={
                original
                  ? `In ${original.count} ${original.count === 1 ? 'club' : 'clubs'}`
                  : ''
              }
            >
              <span>
                <TagChip
                  icon={<TagIcon color="inherit" />}
                  tag={option}
                  {...itemProps}
                />
              </span>
            </Tooltip>
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
