'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SelectClub as Club } from '@src/server/db/models';
import { api } from '@src/trpc/react';
import { DebouncedSearchBar } from './DebouncedSearchBar';

export const ClubSearchBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>('');
  const { data } = api.club.byName.useQuery(
    { name: search },
    { enabled: !!search },
  );
  const onClickSearchResult = (club: Club) => {
    router.push(`/directory/${club.id}`);
  };
  return (
    <DebouncedSearchBar
      placeholder="Search for Clubs"
      setSearch={setSearch}
      searchResults={data || []}
      onClick={onClickSearchResult}
      submitButton
      submitLogic={() => {
        router.push(`/directory/search?search=${encodeURIComponent(search)}`);
      }}
    />
  );
};
