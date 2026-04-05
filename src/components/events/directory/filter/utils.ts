import { FetchStatus } from '@tanstack/react-query';
import { create } from 'zustand';
import { PanelProps } from '@src/components/common/Panel';
import { EventParamsSchema } from '@src/utils/eventFilter';
import { ParamSetter } from '@src/utils/searchParams';

export type EventDirectoryStates = {
  pending: boolean;
  count: number;
  pageCount: number;
  fetchStatus: FetchStatus;
};

type EventsTitleStoreState = {
  selectedCount: number | undefined;
  totalCount: number | undefined;
};

type EventsTitleStoreAction = {
  setSelectedCount: (selectedCount: number | undefined) => void;
  setTotalCount: (totalCount: number | undefined) => void;
};

export const useEventsTitleStore = create<
  EventsTitleStoreState & EventsTitleStoreAction
>((set) => ({
  selectedCount: undefined,
  totalCount: undefined,
  setSelectedCount: (selectedCount: number | undefined) =>
    set({ selectedCount }),
  setTotalCount: (totalCount: number | undefined) => set({ totalCount }),
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

/**
 * Set search params in the URL without using Next.js's Router
 */
export const navigateWithParams = (
  pathname: string,
  params: URLSearchParams,
) => {
  // Manually replace page URL to avoid triggering re-renders with Next.js's hooks
  window.history.replaceState(
    null,
    '',
    `${pathname}${params.size > 0 ? '?' : ''}${params.toString().replace(/=(?=&|$)/g, '')}`,
  );

  // Manually indicate the page's URL has changed, which will update Next.js's hooks
  window.dispatchEvent(new PopStateEvent('popstate'));
};

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
