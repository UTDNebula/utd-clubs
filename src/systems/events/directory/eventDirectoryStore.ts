import { FetchStatus } from '@tanstack/react-query';
import { create } from 'zustand';

type EventDirectoryStoreState = {
  selectedCount: number | undefined;
  totalCount: number | undefined;
  fetchStatus: FetchStatus;
  pageCount: number;
};

type EventDirectoryStoreAction = {
  setSelectedCount: (selectedCount: number | undefined) => void;
  setTotalCount: (totalCount: number | undefined) => void;
  setFetchStatus: (fetchStatus: FetchStatus) => void;
  setPageCount: (pageCount: number) => void;
};

export const useEventDirectoryStore = create<
  EventDirectoryStoreState & EventDirectoryStoreAction
>((set) => ({
  selectedCount: undefined,
  totalCount: undefined,
  fetchStatus: 'idle',
  pageCount: 1,
  setSelectedCount: (selectedCount: number | undefined) =>
    set({ selectedCount }),
  setTotalCount: (totalCount: number | undefined) => set({ totalCount }),
  setFetchStatus: (fetchStatus: FetchStatus) => set({ fetchStatus }),
  setPageCount: (pageCount: number) => set({ pageCount }),
}));
