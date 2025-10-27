'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { SelectClub as Club } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import useDebounce from '@src/utils/useDebounce';
import SearchBar from '.';
import { SearchResults, SearchResultsItem } from './SearchResults';

type EventClubSearchBarProps = {
  addClub: (value: string) => void;
};
export const EventClubSearchBar = ({ addClub }: EventClubSearchBarProps) => {
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const debouncedFocused = useDebounce(focused, 300);
  const debouncedSearch = useDebounce(search, 300);
  const api = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(
    api.club.byName.queryOptions(
      { name: debouncedSearch },
      {
        enabled: !!debouncedSearch,
      },
    ),
  );
  const submit = (club: Club) => {
    void queryClient.prefetchQuery(api.club.byId.queryOptions({ id: club.id }));
    addClub(club.id);
    setSearch('');
  };
  return (
    <div className="relative mr-3 w-full max-w-xs md:max-w-sm lg:max-w-md">
      <SearchBar
        placeholder="Select a club"
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        submitButton
        submitLogic={() => {
          if (data && data[0]) {
            submit(data[0]);
          }
        }}
      />
      {debouncedSearch && debouncedFocused && data && data.length > 0 && (
        <SearchResults
          searchResults={data.map((item) => (
            <SearchResultsItem
              key={item.id}
              onClick={() => {
                submit(item);
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
