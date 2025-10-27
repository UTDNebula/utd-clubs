'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SelectEvent as Event } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import useDebounce from '@src/utils/useDebounce';
import SearchBar from '.';
import { SearchResults, SearchResultsItem } from './SearchResults';

export const EventSearchBar = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>('');
  const debouncedSearch = useDebounce(input, 300);
  const [focused, setFocused] = useState(false);
  const debouncedFocused = useDebounce(focused, 300);
  const api = useTRPC();
  const { data } = useQuery(
    api.event.byName.queryOptions(
      { name: debouncedSearch, sortByDate: true },
      { enabled: !!input },
    ),
  );
  const onClickSearchResult = (event: Event) => {
    router.push(`/event/${event.id}`);
  };
  return (
    <div className="relative mr-3 w-full max-w-xs md:max-w-sm lg:max-w-md">
      <SearchBar
        placeholder="Search for Events"
        tabIndex={0}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        submitButton
        submitLogic={() => {
          if (data && data[0]) {
            onClickSearchResult(data[0]);
          }
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
