'use client';

import { registerLicense } from '@syncfusion/ej2-base';
import { useEffect, type ReactNode } from 'react';

export default function SyncfusionWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY) {
      registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY);
    }
  }, []);

  return <>{children}</>;
}
