import { headers, type UnsafeUnwrappedHeaders } from 'next/headers';

export function signInRoute(route: string) {
  const host = (headers() as unknown as UnsafeUnwrappedHeaders).get(
    'X-Forwarded-Host',
  );
  const proto = (headers() as unknown as UnsafeUnwrappedHeaders).get(
    'X-Forwarded-Proto',
  );
  return `/auth?callbackUrl=${encodeURIComponent(
    `${proto}://${host}/${route}`,
  )}`;
}
