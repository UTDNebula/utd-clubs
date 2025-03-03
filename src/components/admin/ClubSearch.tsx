'use client';

import { api } from '@src/trpc/react';
import { useState } from 'react';
import { type SelectClub } from '@src/server/db/models';
import useDebounce from '@src/utils/useDebounce';
import { SearchResults, SearchResultsItem } from '../searchBar/SearchResults';
import SearchBar from '../searchBar';

type Props = {
  setClub: ({ id, name }: { id: string; name: string }) => void;
};

export default function ClubSearch({ setClub }: Props) {
  const [search, setSearch] = useState<string>('');
  const [focused, setFocused] = useState(false);
  const debouncedFocused = useDebounce(focused, 300);
  const debouncedSearch = useDebounce(search, 300);
  const { data } = api.club.byName.useQuery(
    { name: search },
    { enabled: !!search },
  );

  const onClickSearchResult = (club: SelectClub) => {
    setClub({ id: club.id, name: club.name });
    setSearch('');
  };
  return (
    <div className="relative mr-3 w-full max-w-xs md:max-w-sm lg:max-w-md">
      <SearchBar
        placeholder="Search for Clubs"
        tabIndex={0}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
}
