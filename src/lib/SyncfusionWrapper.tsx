'use client';

import { registerLicense } from '@syncfusion/ej2-base';
import { useEffect, type ReactNode } from 'react';

const key = process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY;
if (key) registerLicense(key);

const THEME_LINK_ID = 'syncfusion-theme';
const LIGHT_CSS_HREF = '/syncfusion/material.css';
const DARK_CSS_HREF = '/syncfusion/material-dark.css';

function setThemeLink(href: string) {
  let link = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.id = THEME_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  if (link.getAttribute('href') !== href) {
    link.href = href;
  }
}

export default function SyncfusionWrapper({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (isDark: boolean) => {
      setThemeLink(isDark ? DARK_CSS_HREF : LIGHT_CSS_HREF);
    };

    applyTheme(mq.matches);

    const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
    mq.addEventListener('change', listener);

    return () => {
      mq.removeEventListener('change', listener);
    };
  }, []);

  return <>{children}</>;
}
