'use client';

import TagIcon from '@mui/icons-material/Tag';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useTRPC } from '@src/trpc/react';
import useDebounce from '@src/utils/useDebounce';

export const ClubTagEdit = ({
  tags,
  setTagsAction,
}: {
  tags: string[];
  setTagsAction: (value: string[]) => void;
}) => {
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 300);
  const api = useTRPC();
  const { data } = useQuery({
    placeholderData: (previousData, _previousQuery) => previousData,
    ...api.club.tagSearch.queryOptions(
      { search: debouncedSearch },
      { enabled: !!debouncedSearch },
    ),
  });

  const { data: distinctTags } = useQuery(api.club.distinctTags.queryOptions());

  const containerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const originalOffset = useRef<number>(0);

  useEffect(() => {
    if (containerRef.current) {
      originalOffset.current =
        containerRef.current.getBoundingClientRect().top + window.scrollY;
    }
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > originalOffset.current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // const filter = createFilterOptions<SelectClub>();
  // TODO: Clearing search after typing doesnt give results again
  return (
    <div
      ref={containerRef}
      className={`text-shadow-[0_0_4px_rgb(0_0_0_/_0.4)] mr-3 w-full max-w-xs transition-all md:max-w-sm lg:max-w-md ${
        isSticky ? 'fixed top-0 z-50 justify-center' : 'relative'
      }`}
      suppressHydrationWarning
    >
      <Autocomplete
        disableCloseOnSelect
        disableClearable
        multiple
        handleHomeEndKeys
        aria-label="search"
        renderInput={(params) => (
          <TextField
            variant="outlined"
            placeholder="Search tags or add custom"
            className="[&>.MuiInputBase-root]:bg-white"
            {...params}
          />
        )}
        // value={tags}
        defaultValue={tags}
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
        // options={distinctTags ?? []}
        options={data?.tags.map((t) => t.tag) ?? distinctTags ?? []}
        filterOptions={(options, params) => {
          if (params.inputValue !== '' && options.length == 0) {
            options.push(`Add "${params.inputValue}" tag`);
          }

          return options;
        }}
        inputValue={search}
        onInputChange={(_e, value) => {
          setSearch(value);
        }}
        onChange={(e, value) => {
          // TODO: Is there a better way to do this?
          const last = value[value.length - 1];
          if (typeof last === 'string' && last.startsWith('Add ')) {
            value[value.length - 1] = last.substring(5, last.length - 5);
          }
          setTagsAction(value);
        }}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <li key={key} {...otherProps}>
              <Typography variant="body1">{option}</Typography>
            </li>
          );
        }}
      />
    </div>
  );
};
