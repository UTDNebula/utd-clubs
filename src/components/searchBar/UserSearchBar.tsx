'use client';
import { useTRPC } from '@src/trpc/react';
import useDebounce from '@src/utils/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import SearchBar from '.';
import { SearchResults, SearchResultsItem } from './SearchResults';

type UserSearchBarProps = {
  passUser: (user: { id: string; name: string }) => void;
};
export const UserSearchBar = ({ passUser }: UserSearchBarProps) => {
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const debouncedFocused = useDebounce(focused, 300);
  const debouncedSearch = useDebounce(search, 300);
  const api = useTRPC();
  const userQuery = useQuery(
    api.userMetadata.searchByName.queryOptions(
      {
        name: debouncedSearch,
      },
      { enabled: !!debouncedSearch },
    ),
  );
  const formattedData = userQuery.isSuccess
    ? userQuery.data.map((val) => {
        return { name: val.firstName + ' ' + val.lastName, ...val };
      })
    : [];
  return (
    <>
      <div className="relative mr-3 w-full max-w-xs md:max-w-sm lg:max-w-md">
        <SearchBar
          placeholder="Search for Someone"
          tabIndex={0}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          submitLogic={() => {
            if (formattedData && formattedData[0]) {
              const user = formattedData[0];
              passUser({ id: user.id, name: user.name });
              setSearch('');
            }
          }}
        />
        {debouncedSearch &&
          debouncedFocused &&
          userQuery.data &&
          userQuery.data.length > 0 && (
            <SearchResults
              searchResults={formattedData.map((item) => (
                <SearchResultsItem
                  key={item.id}
                  onClick={() => {
                    passUser({ id: item.id, name: item.name });
                    setSearch('');
                  }}
                >
                  {item.name}
                </SearchResultsItem>
              ))}
            />
          )}
      </div>
    </>
  );
};
