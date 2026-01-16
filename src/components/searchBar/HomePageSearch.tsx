'use client';

import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Chip,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useTRPC } from '@src/trpc/react';
import { useSearchStore } from '@src/utils/SearchStoreProvider';
import theme from '@src/utils/theme';
import useDebounce from '@src/utils/useDebounce';

export const HomePageSearchBar = () => {
  const {
    search: initialSearch,
    setSearch: updateSearch,
    tags,
    setTags,
    setShouldFocus,
    isFetching,
  } = useSearchStore((state) => state);
  const [search, setSearch] = useState<string>(initialSearch);
  const debouncedSearch = useDebounce(search, 300);

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [headerGradientOpacity, setHeaderGradientOpacity] = useState(1);
  const originalOffset = useRef<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        originalOffset.current =
          containerRef.current.getBoundingClientRect().top + window.scrollY;
      }
    };
    handleResize();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > originalOffset.current);
      setHeaderGradientOpacity((scrollY - originalOffset.current) / 128);
    };
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // if the url already has search or tag params, scroll straight to the results
  useEffect(() => {
    if (initialSearch.length > 0 || tags.length > 0) {
      scroll();
    }
  }, [initialSearch.length, tags.length]);

  function scroll() {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: 'smooth',
    });
  }
  function handleInteraction(shouldScroll: boolean = true) {
    // When we interact again after pressing enter, don't tab to the results once they load
    setShouldFocus(false);
    if (shouldScroll) {
      scroll();
    }
  }
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Optional: Check if we are not already sticky to avoid jumping if the user scrolls back up
    if (!isSticky) {
      inputRef.current?.focus();
    }
  }, [isSticky]);

  function onSubmit() {
    setOpen(false);
    // Blur the input while results load
    inputRef.current?.blur();
    scroll();
    setShouldFocus(true);
  }

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header background gradient for improved clarity */}
      {isSticky && (
        <div
          style={{ opacity: headerGradientOpacity }}
          className="fixed inset-0 z-10 h-32 w-full bg-linear-to-b from-black/50 to-transparent"
        ></div>
      )}
      <div
        ref={containerRef}
        className={`drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)] pt-2 w-full max-w-xs transition-all md:max-w-sm lg:max-w-md ${
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
            handleInteraction();
          }}
          onChange={(e, value) => {
            setTags(value);
            handleInteraction();
          }}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Search for Clubs or Tags"
              inputRef={inputRef}
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <div className="flex gap-2 items-center">
                      <InputAdornment position="start">
                        {params.InputProps.endAdornment}
                        {isFetching ? (
                          <CircularProgress color="inherit" size={24} />
                        ) : (
                          <SearchIcon />
                        )}
                      </InputAdornment>
                    </div>
                  ),
                  sx: {
                    background: 'white',
                    borderRadius: theme.shape.borderRadius,
                  },
                },
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Tab') {
                  e.preventDefault();
                  e.stopPropagation();
                  onSubmit();
                } else if (e.key.length === 1) {
                  // A character not something like Shift
                  handleInteraction();
                }
              }}
              onFocus={() => handleInteraction(false)}
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
        />
      </div>
      {/*Placeholder to avoid layout shift when search bar becomes sticky*/}
      {isSticky && (
        <Autocomplete
          className="pt-2 opacity-0"
          options={[]}
          renderInput={(params) => <TextField {...params}></TextField>}
        ></Autocomplete>
      )}
    </>
  );
};
