'use client';

import TagIcon from '@mui/icons-material/Tag';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { type SelectClub, type SelectContact } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { useSearchStore } from '@src/utils/SearchStoreProvider';
import useDebounce from '@src/utils/useDebounce';

export const ClubTagEdit = ({ club }: { club: SelectClub }) => {
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 300);
  // const updateSearch = useSearchStore((state) => state.setSearch);
  // const tags = useSearchStore((state) => state.tags);
  // const setTags = useSearchStore((state) => state.setTags);
  const api = useTRPC();
  const { data } = useQuery({
    placeholderData: (previousData, _previousQuery) => previousData,
    ...api.club.tagSearch.queryOptions(
      { search: debouncedSearch },
      { enabled: !!debouncedSearch },
    )
  });

  const { data: distinctTags } = useQuery(
    api.club.distinctTags.queryOptions(),
  );
  // const editData = useMutation(
  //   api.club.edit.data.mutationOptions({
  //     onSuccess: () => {
  //       router.refresh();
  //     },
  //   }),
  // );
  // const id = club.id;
  // const tags = club.tags;

  // api.club.tagSearch

  //
  // useEffect(() => {
  //   updateSearch(debouncedSearch);
  // }, [debouncedSearch, updateSearch]);

  const onSubmit = () => {
    // document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
    // Add club here
    // console.log(club.tags);
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


  // TODO: minor bug, when typing a brand new tag, each letter does a search, and theres no results during that time
  // const filter = createFilterOptions<SelectClub>();
  return (
    <div
      ref={containerRef}
      className={`text-shadow-[0_0_4px_rgb(0_0_0_/_0.4)] mr-3 w-full max-w-xs transition-all md:max-w-sm lg:max-w-md ${
        isSticky ? 'fixed top-0 z-50 justify-center' : 'relative'
      }`}
      suppressHydrationWarning
    >
      <Autocomplete
        freeSolo
        multiple
        handleHomeEndKeys
        aria-label="search"
        renderInput={(params) => (
          <TextField
            variant="outlined"
            placeholder="Search tags or add custom"
            className="[&>.MuiInputBase-root]:bg-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // e.preventDefault();
                // e.stopPropagation();
                onSubmit();
              }
            }}
            {...params}
          />
        )}

        // value={tags}
        defaultValue={club.tags}
        renderValue={(value, getItemProps) => {
          return value.map((option: string, index: number) => {
            const { key, ...itemProps } = getItemProps({ index });
            return (
              <Chip
                key={key}
                icon={<TagIcon color="inherit" />}
                label={option}
                color="primary"
                {...itemProps}
              />
            );
          });
        }}
        // options={distinctTags ?? []}
        options={data?.tags.map((t) => t.tag) ?? distinctTags ?? []}
        filterOptions={(options, params) => {

          if (params.inputValue !== '' && options.length == 0) {
            options.push(`Add "${params.inputValue}" tag`);
          }

          return options
          // if () {
          // }
          // return o.filter((t) => data?.tags.map((t) => t.tag).includes(t))
        }}
        // filterOptions={(o) => o}
        inputValue={search}
        onInputChange={(_e, value) => {
          setSearch(value);
        }}
        onChange={(_e, value) => {
          // setTags(value);

        }}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <li key={key} {...otherProps}>
              <Typography variant="body1">{option}</Typography>
            </li>
          );
        }}
      />
    </div>
  );
};
// type SearchBarProps = Omit<ComponentProps<'input'>, 'type'> & {
//   submitButton?: boolean;
//   submitLogic?: () => void;
// };
