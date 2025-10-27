import { createStore } from 'zustand/vanilla';

export type SearchState = {
  search: string;
  tags: string[];
};

export type SearchAction = {
  setSearch: (search: SearchState['search']) => void;
  setTags: (tags: SearchState['tags']) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
};
export const defaultInitState: SearchState = {
  search: '',
  tags: [],
};
export type SearchStore = SearchState & SearchAction;
export const createSearchStore = (
  initState: SearchState = defaultInitState,
) => {
  return createStore<SearchStore>((set) => ({
    ...initState,
    setSearch: (search: string) => set(() => ({ search: search })),
    addTag: (tag: string) =>
      set(({ tags }) => ({ tags: tags.includes(tag) ? tags : [...tags, tag] })),
    removeTag: (tag: string) =>
      set(({ tags }) => ({ tags: [...tags.filter((t) => t != tag)] })),
    setTags: (tags: string[]) => set(() => ({ tags: tags })),
  }));
};
