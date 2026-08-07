import { useSyncExternalStore } from 'react';

/**
 * Hook to return whether the page is finished mounting on the client.
 * Use for conditional components and props instead of
 * `typeof window !== 'undefined'`, which may cause hydration errors.
 *
 * @returns
 * - `false` during SSR and initial client-side renders
 * - `true` during subsequent client-side renders (once React has loaded)
 */
export function useIsMounted(): boolean {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return isMounted;
}
