import { FetchStatus } from '@tanstack/react-query';
import { PanelProps } from '@src/components/common/Panel';
import { EventParamsSchema } from '@src/utils/eventFilter';
import { FilterSearchParams } from './FilterSearchParams';

export type EventDirectoryStates = {
  pending: boolean;
  pageCount: number;
  fetchStatus: FetchStatus;
};

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
 * Client-side function to enable toggling the visibility of the following floating action buttons (FABs):
 * - Sentry feedback button
 * - Tanstack Devtools
 * - Next.js Dev Tools
 */
export function hideFABs(hidden: boolean) {
  const newDisplayValue = hidden ? 'none' : '';

  const sentryFeedback = document.getElementById('sentry-feedback');
  if (sentryFeedback) sentryFeedback.style.display = newDisplayValue;

  const tanstackDevtools = document.querySelector<HTMLElement>(
    '[data-testid="tanstack_devtools"]',
  );
  if (tanstackDevtools) tanstackDevtools.style.display = newDisplayValue;

  const nextDevtools = document.querySelector<HTMLElement>(
    '[data-nextjs-dev-overlay="true"]',
  );
  if (nextDevtools) nextDevtools.style.display = hidden ? 'none' : 'block';
}

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

/**
 * Modifies the URL search params based off {@linkcode setParamsFn} and navigates to it
 * @param setParamsFn Function to that accepts a mutable params parameter and modifies it
 * @param pathname Optional pathname to override the default, which uses `window.location.pathname`
 */
export const setParams = (
  setParamsFn: (params: FilterSearchParams<EventParamsSchema>) => void,
  pathname: string = window.location.pathname,
) => {
  function unsetPage(name: string) {
    // IMPORTANT: This condition avoids infinite recursion
    if (name !== 'page' && params.get('page') !== String(1))
      params.delete('page');
  }

  const params = new FilterSearchParams<EventParamsSchema>(
    window.location.search,
    {
      onAppend(name, value) {
        console.log(`APPEND ${name} WITH '${value}'`);
        unsetPage(name);
      },
      onDelete(name, value) {
        console.log(`DELETE ${name}${value ? ` IF '${value}'` : ''}`);
        unsetPage(name);
      },
      onSet(name, value) {
        console.log(`SET ${name} TO '${value}'`);
        unsetPage(name);
      },
    },
  );
  setParamsFn(params);
  navigateWithParams(pathname, params);
};
