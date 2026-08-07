import { headers } from 'next/headers';

export async function signInRoute(route: string) {
  const awaitedHeaders = await headers();
  const host = awaitedHeaders.get('X-Forwarded-Host');
  const proto = awaitedHeaders.get('X-Forwarded-Proto');
  return `/auth?callbackUrl=${encodeURIComponent(
    `${proto}://${host}/${route}`,
  )}`;
}
