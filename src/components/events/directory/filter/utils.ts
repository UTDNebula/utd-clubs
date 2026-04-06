import { FetchStatus } from '@tanstack/react-query';
import { create } from 'zustand';
import { PanelProps } from '@src/components/common/Panel';
import { EventParamsSchema } from '@src/utils/eventFilter';
import { ParamSetter } from '@src/utils/searchParams';

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

export type FilterPanelBaseProps = {
  backgroundHover: boolean;
  pathname: string;
};

export type FilterPanelProps<T> = FilterPanelBaseProps & {
  filters: T;
};

/**
 * Factory to create the default panel props for event filter panels
 */
export const panelProps = (backgroundHover: boolean): PanelProps => ({
  smallPadding: true,
  enableCollapsing: { toggleOnHeadingClick: true },
  transparent: backgroundHover ? 'falseOnHover' : true,
});

function unsetPage(params: URLSearchParams, name: string) {
  if (name !== 'page' && params.get('page') !== String(1))
    params.delete('page');
}

const EventParamSetter = new ParamSetter<EventParamsSchema>({
  onAppend(name, value, rawParams) {
    unsetPage(rawParams, name);
  },
  onDelete(name, value, rawParams) {
    unsetPage(rawParams, name);
  },
  onSet(name, value, rawParams) {
    unsetPage(rawParams, name);
  },
});

export const setEventsParams = EventParamSetter.setParams;
