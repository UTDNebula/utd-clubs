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
