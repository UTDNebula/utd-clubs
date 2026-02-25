'use client';

import { registerLicense } from '@syncfusion/ej2-base';
import type { ReactNode } from 'react';

const key = process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY;
if (key) registerLicense(key);

export default function SyncfusionWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
