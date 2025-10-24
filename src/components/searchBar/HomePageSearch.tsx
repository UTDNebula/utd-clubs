'use client';
import type { SelectClub as Club } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { useSearchStore } from '@src/utils/SearchStoreProvider';
import useDebounce from '@src/utils/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef,useState } from 'react';

import SearchBar from '.';
import { SearchResults, SearchResultsItem } from './SearchResults';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const originalOffset = useRef<number>(0);

  useEffect(() => {
    updateSearch(debouncedSearch);
  }, [debouncedSearch, updateSearch]);

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
      className={`text-shadow-... mr-3 w-full max-w-xs transition-all md:max-w-sm lg:max-w-md ${
        isSticky ? 'fixed top-0 z-50 justify-center' : 'relative'
      }`}
    >
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
