'use client';

import { registerLicense } from '@syncfusion/ej2-base';
import { useEffect, type ReactNode } from 'react';

const key = process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY;
if (key) registerLicense(key);

const DARK_LINK_ID = 'syncfusion-dark-theme';
const DARK_CSS_HREF = '/syncfusion/material-dark.css';

export default function SyncfusionWrapper({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const applyTheme = (isDark: boolean) => {
      const existing = document.getElementById(DARK_LINK_ID);
      if (isDark && !existing) {
        const link = document.createElement('link');
        link.id = DARK_LINK_ID;
        link.rel = 'stylesheet';
        link.href = DARK_CSS_HREF;
        document.head.appendChild(link);
      } else if (!isDark && existing) {
        existing.remove();
      }
    };

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(mq.matches);

    const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
    mq.addEventListener('change', listener);

    return () => mq.removeEventListener('change', listener);
  }, []);

  return <>{children}</>;
}
