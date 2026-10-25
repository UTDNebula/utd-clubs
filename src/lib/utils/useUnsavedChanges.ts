import { useEffect } from 'react';

/**
 * This hook prevents the user from leaving or reloading the page if there are unsaved changes
 * Note: If the user clicks on a link on the page, the prompt for unsaved changes will not appear.
 */
export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);
}
