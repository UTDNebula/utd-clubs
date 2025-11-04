'use client';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { RightArrowIcon } from '@src/icons/Icons';
import { useTRPC } from '@src/trpc/react';
import { useSearchStore } from '@src/utils/SearchStoreProvider';
import useDebounce from '@src/utils/useDebounce';
import { TagPill } from '../TagPill';
import { SearchResults, SearchResultsItem } from './SearchResults';

export const HomePageSearchBar = () => {
  const [search, setSearch] = useState<string>('');
  const [focused] = useState(false);
  const debouncedFocused = useDebounce(focused, 300);
  const debouncedSearch = useDebounce(search, 300);
  const updateSearch = useSearchStore((state) => state.setSearch);
  const tags = useSearchStore((state) => state.tags);
  const removeTag = useSearchStore((state) => state.removeTag);
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
    >
      {tags.map((t) => (
        <TagPill removeTag={() => removeTag(t)} key={t} name={t} />
      ))}
      <Autocomplete
        freeSolo
        multiple
        aria-label="search"
        options={data?.tags.map((t) => t.tag) ?? []}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            placeholder="Search for Clubs or Tags"
            {...params}
            className="[&>.MuiInputBase-root]:bg-white"
          />
        )}
        renderValue={(value: readonly string[], getItemProps) => {
          return value.map((option: string, index: number) => {
            const { key, ...itemProps } = getItemProps({ index });
            return "s";
          }}
        }
        }
        inputValue={search}
        onInputChange={(e, value) => {
          setSearch(value);
        }}
      />
      {debouncedSearch && debouncedFocused && data && data.tags.length > 0 && (
        <SearchResults
          searchResults={data.tags.map((item) => (
            <SearchResultsItem
              key={item.tag}
              onClick={() => {
                addTag(item.tag);
                setSearch('');
              }}
            >
              # {item.tag}
            </SearchResultsItem>
          ))}
        />
      )}
    </div>
  );
};
type SearchBarProps = Omit<ComponentProps<'input'>, 'type'> & {
  submitButton?: boolean;
  submitLogic?: () => void;
};

export const OldSearchBar = (props: SearchBarProps) => {
  const { submitButton, submitLogic, ...goodProps } = props;
  return (
    <div className="relative">
      <input
        {...goodProps}
        type="text"
        className={`h-10 w-full rounded-full border pl-10 ${submitButton ? 'pr-[38px]' : 'pr-3'} focus:outline-hidden ${props.className} border-gray-200 bg-white`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && typeof submitLogic !== 'undefined') {
            submitLogic();
          }
        }}
      />
      {submitButton && (
        <button
          type={typeof submitLogic !== 'undefined' ? 'button' : 'submit'}
          onClick={
            typeof submitLogic !== 'undefined'
              ? (e) => {
                  e.preventDefault();
                  submitLogic();
                }
              : undefined
          }
          className="absolute inset-y-0 right-2 flex items-center"
        >
          <RightArrowIcon fill="fill-[#C3CAD9]" />
        </button>
      )}
    </div>
  );
};
