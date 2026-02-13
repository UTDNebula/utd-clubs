'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { authClient } from '@src/utils/auth-client';

export const GoogleReauthHandler = () => {
  const shouldRedirect = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    if (shouldRedirect.current) return;
    shouldRedirect.current = true;

    const triggerReauth = async () => {
      const res = await authClient.signIn.social({
        provider: 'google',
        callbackURL: pathname,
        disableRedirect: true, // so we can catch and modify the url
      });

      // intercept url and append the force-consent params
      if (res.data?.url) {
        const url = new URL(res.data.url);
        // forces Google to show the "Allow" screen again to get refresh_token
        url.searchParams.set('prompt', 'consent');
        url.searchParams.set('access_type', 'offline');

        // manually go to consent screen
        window.location.href = url.toString();
      }
    };

    triggerReauth();
  }, [pathname]);

  // render nothing otherwise
  return null;
};
