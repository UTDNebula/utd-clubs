import { PanelProps } from '@src/components/common/Panel';

export type FilterPanelBaseProps = {
  backgroundHover: boolean;
  pathname: string;
};

export type FilterPanelProps<T> = FilterPanelBaseProps & {
  filters: T;
};

export const panelProps = (backgroundHover: boolean): PanelProps => ({
  smallPadding: true,
  enableCollapsing: { toggleOnHeadingClick: true },
  transparent: backgroundHover ? 'falseOnHover' : true,
});

export const navigateWithParams = (
  pathname: string,
  params: URLSearchParams,
) => {
  // Manually replace page URL to avoid triggering re-renders with Next.js's hooks
  window.history.replaceState(
    null,
    '',
    `${pathname}?${params.toString().replace(/=(?=&|$)/g, '')}`,
  );

  // Manually indicate the page's URL has changed, which will update Next.js's hooks
  window.dispatchEvent(new PopStateEvent('popstate'));
};
