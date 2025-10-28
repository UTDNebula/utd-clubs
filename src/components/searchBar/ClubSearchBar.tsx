'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SelectClub as Club } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import useDebounce from '@src/utils/useDebounce';
import SearchBar from '.';
import { SearchResults, SearchResultsItem } from './SearchResults';

export const ClubSearchBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>('');
  const [focused, setFocused] = useState(false);
  const debouncedFocused = useDebounce(focused, 300);
  const debouncedSearch = useDebounce(search, 300);
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
  return (
    <div className="relative mr-3 w-full max-w-xs md:max-w-sm lg:max-w-md">
      <SearchBar
        placeholder="Search for Clubs"
        tabIndex={0}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        submitButton
        onClick={() => {
          router.push(`/directory/search?search=${encodeURIComponent(search)}`);
        }}
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
