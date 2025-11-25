'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { useTRPC } from '@src/trpc/react';
import { useSearchStore } from '@src/utils/SearchStoreProvider';
import theme from '@src/utils/theme';
import useDebounce from '@src/utils/useDebounce';

export const HomePageSearchBar = () => {
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 300);
  const updateSearch = useSearchStore((state) => state.setSearch);
  const tags = useSearchStore((state) => state.tags);
  const setTags = useSearchStore((state) => state.setTags);
  const api = useTRPC();
  const { data } = useQuery(
    api.club.tagSearch.queryOptions(
      { search: debouncedSearch },
      { enabled: !!debouncedSearch },
    ),
  );
  useEffect(() => {
    updateSearch(debouncedSearch);
  }, [debouncedSearch, updateSearch]);
  const onSubmit = () => {
    document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const firstInteracted = useSearchStore((s) => s.firstInteracted);
  const setFirstInteracted = useSearchStore((s) => s.setFirstInteracted);
  function scrollOnce() {
    if (!firstInteracted) {
      setFirstInteracted();
      document
        .getElementById('content')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)] pt-4 w-full max-w-xs transition-all md:max-w-sm lg:max-w-md ${
          isSticky ? 'fixed top-0 z-50 justify-center' : 'relative'
        }`}
      >
        <Autocomplete
          freeSolo
          multiple
          disableClearable
          aria-label="search"
          inputValue={search}
          value={tags}
          options={data?.tags.map((t) => t.tag) ?? []}
          filterOptions={(o) => o}
          onInputChange={(e, value) => {
            setSearch(value);
            scrollOnce();
          }}
          onChange={(e, value) => {
            setTags(value);
            scrollOnce();
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Search for Clubs or Tags"
              slotProps={{
                input: {
                  ...params.InputProps,
                  sx: {
                    background: 'white',
                    borderRadius: theme.shape.borderRadius,
                  },
                },
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  onSubmit();
                }
              }}
            />
          )}
          renderValue={(value, getItemProps) => {
            return value.map((option: string, index: number) => {
              const { key, ...itemProps } = getItemProps({ index });
              return (
                <Chip key={key} label={option} color="primary" {...itemProps} />
              );
            });
          }}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <li key={key} {...otherProps}>
                <Typography variant="body1">{option}</Typography>
              </li>
            );
          }}
          onFocus={scrollOnce}
        />
      </div>
      {/*Placeholder to avoid layout shift when search bar becomes sticky*/}
      {isSticky && (
        <Autocomplete
          className="pt-4 opacity-0"
          options={[]}
          renderInput={(params) => <TextField {...params}></TextField>}
        ></Autocomplete>
      )}
    </>
  );
};
type SearchBarProps = Omit<ComponentProps<'input'>, 'type'> & {
  submitButton?: boolean;
  submitLogic?: () => void;
};
