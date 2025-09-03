'use client';
import { useEffect, useState } from 'react';
import { useTRPC } from '@src/trpc/react';
import useDebounce from '@src/utils/useDebounce';
import { SearchResults, SearchResultsItem } from './SearchResults';
import { useSearchStore } from '@src/utils/SearchStoreProvider';
import { useQuery } from '@tanstack/react-query';
import { RightArrowIcon, SearchIcon } from '@src/icons/Icons';
import { type ComponentProps } from 'react';

export const HomePageSearchBar = () => {
  const [search, setSearch] = useState<string>('');
  const [focused, setFocused] = useState(false);
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
  const onClickSearchResult = (club: Club) => {
    router.push(`/directory/${club.slug}`);
  };
  useEffect(() => {
    updateSearch(debouncedSearch);
  }, [debouncedSearch, updateSearch]);
  const onSubmit = () => {
    document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="pointer-events-auto relative w-full max-w-sm md:max-w-md lg:max-w-lg">
      <div
        className={`flex min-h-10 w-full flex-row flex-wrap items-center gap-x-2 gap-y-2 rounded-lg border border-gray-200 bg-white p-2 focus:outline-hidden`}
      >
        {tags.map((t) => (
          <div
            className="bg-blue-primary flex w-fit flex-row items-center gap-x-0.5 rounded-xl px-2 py-1 text-sm font-bold text-white"
            key={t}
          >
            <div>#</div>
            <div>{t} </div>
            <button type="button" onClick={() => removeTag(t)}>
              X
            </button>
          </div>
        ))}
        <input
          type="text"
          className="grow-1 text-lg"
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit();
            }
          }}
          value={search}
          placeholder="Search for clubs or tags"
        />
        <button type="button" onClick={onSubmit}>
          <SearchIcon />
        </button>
      </div>
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

export const SearchBar = (props: SearchBarProps) => {
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
export default SearchBar;
