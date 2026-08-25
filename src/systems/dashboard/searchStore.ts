import { createStore } from 'zustand/vanilla';

export type SearchState = {
  search: string;
  tags: string[];
  shouldFocus: boolean;
  shouldScrollDown: boolean;
  isFetching: boolean;
};

export type SearchAction = {
  setSearch: (search: SearchState['search']) => void;
  setTags: (tags: SearchState['tags']) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setShouldFocus: (val: boolean) => void;
  setIsFetching: (val: boolean) => void;
};

function setSearchQueryParam(search: string) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (search) {
    url.searchParams.set('search', search);
  } else {
    url.searchParams.delete('search');
  }
  window.history.replaceState({}, '', url.toString());
}

function setTagsQueryParam(tags: string[]) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (tags.length) {
    url.searchParams.set('tags', tags.join(','));
  } else {
    url.searchParams.delete('tags');
  }
  window.history.replaceState({}, '', url.toString());
}

export const defaultInitState: SearchState = {
  search: '',
  tags: [],
  shouldFocus: false,
  shouldScrollDown: false,
  isFetching: false,
};

export type SearchStore = SearchState & SearchAction;

export const createSearchStore = (
  initState: SearchState = defaultInitState,
) => {
  return createStore<SearchStore>((set, get) => ({
    ...initState,
    setSearch: (search: string) => {
      set(() => ({ search }));
      setSearchQueryParam(search);
    },
    addTag: (tag: string) => {
      set(({ tags }) => ({ tags: tags.includes(tag) ? tags : [...tags, tag] }));
      setTagsQueryParam(get().tags);
    },
    removeTag: (tag: string) => {
      set(({ tags }) => ({ tags: [...tags.filter((t) => t != tag)] }));
      setTagsQueryParam(get().tags);
    },
    setTags: (tags: string[]) => {
      set(() => ({ tags: tags }));
      setTagsQueryParam(tags);
    },
    setShouldFocus: (val: boolean) => set(() => ({ shouldFocus: val })),
    setIsFetching: (val: boolean) => set(() => ({ isFetching: val })),
  }));
};
