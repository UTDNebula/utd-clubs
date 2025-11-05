'use client';

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { RightArrowIcon } from '@src/icons/Icons';
import { useTRPC } from '@src/trpc/react';
import { useSearchStore } from '@src/utils/SearchStoreProvider';
import useDebounce from '@src/utils/useDebounce';
import { SearchResults, SearchResultsItem } from './SearchResults';

export const HomePageSearchBar = () => {
  const [search, setSearch] = useState<string>('');
  const [focused] = useState(false);
  const debouncedFocused = useDebounce(focused, 300);
  const debouncedSearch = useDebounce(search, 300);
  const updateSearch = useSearchStore((state) => state.setSearch);
  const tags = useSearchStore((state) => state.tags);
  const setTags = useSearchStore((state) => state.setTags);
  const addTag = useSearchStore((state) => state.addTag);
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
  return (
    <div
      ref={containerRef}
      className={`text-shadow-[0_0_4px_rgb(0_0_0_/_0.4)] mr-3 w-full max-w-xs transition-all md:max-w-sm lg:max-w-md ${
        isSticky ? 'fixed top-0 z-50 justify-center' : 'relative'
      }`}
      suppressHydrationWarning
    >
      <Autocomplete
        freeSolo
        multiple
        aria-label="search"
        options={data?.tags.map((t) => t.tag) ?? []}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            placeholder="Search for Clubs or Tags"
            className="[&>.MuiInputBase-root]:bg-white"
            {...params}
          />
        )}
        value={tags}
        renderValue={(value, getItemProps) => {
          return value.map((option: string, index: number) => {
            const { key, ...itemProps } = getItemProps({ index });
            return (
              <Chip key={key} label={option} color="primary" {...itemProps} />
            );
          });
        }}
        filterOptions={(o) => o}
        inputValue={search}
        onInputChange={(e, value) => {
          setSearch(value);
        }}
        onChange={(e, value) => {
          setTags(value);
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
type SearchBarProps = Omit<ComponentProps<'input'>, 'type'> & {
  submitButton?: boolean;
  submitLogic?: () => void;
};
