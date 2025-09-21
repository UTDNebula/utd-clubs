'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SelectClub as Club } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import SearchBar from '.';
import useDebounce from '@src/utils/useDebounce';
import { SearchResults, SearchResultsItem } from './SearchResults';
import { useSearchStore } from '@src/utils/SearchStoreProvider';
import { useQuery } from '@tanstack/react-query';

export const HomePageSearchBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>('');
  const [focused, setFocused] = useState(false);
  const debouncedFocused = useDebounce(focused, 300);
  const debouncedSearch = useDebounce(search, 300);
  const updateSearch = useSearchStore((state) => state.setSearch);
  const api = useTRPC();
  const { data } = useQuery(
    api.club.byName.queryOptions(
      { name: debouncedSearch },
      { enabled: !!debouncedSearch },
    ),
  );
  const onClickSearchResult = (club: Club) => {
    router.push(`/directory/${club.slug}`);
  };
  useEffect(() => {
    updateSearch(debouncedSearch);
  }, [debouncedSearch, updateSearch]);
  return (
    <div className="relative mr-3 w-full max-w-xs text-shadow-[0_0_4px_rgb(0_0_0_/_0.4)] md:max-w-sm lg:max-w-md">
      <SearchBar
        placeholder="Search for Clubs"
        tabIndex={0}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        submitButton
        submitLogic={() =>
          document
            .getElementById('content')
            ?.scrollIntoView({ behavior: 'smooth' })
        }
      />
      {debouncedSearch && debouncedFocused && data && data.length > 0 && (
        <SearchResults
          searchResults={data.map((item) => (
            <SearchResultsItem
              key={item.id}
              onClick={() => {
                onClickSearchResult(item);
              }}
            >
              {item.name}
            </SearchResultsItem>
          ))}
        />
      )}
    </div>
  );
};
