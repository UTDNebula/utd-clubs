import { headers } from 'next/headers';

export async function signInRoute(route: string) {
  const host = (await headers()).get('X-Forwarded-Host');
  const proto = (await headers()).get('X-Forwarded-Proto');
  return `/auth?callbackUrl=${encodeURIComponent(
    `${proto}://${host}/${route}`,
  )}`;
}
