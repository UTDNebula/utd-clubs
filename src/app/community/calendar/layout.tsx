import '@syncfusion/ej2-react-schedule/styles/material.css';
import type { ReactNode } from 'react';
import SyncfusionWrapper from '@src/lib/SyncfusionWrapper';

export default function CalendarLayout({ children }: { children: ReactNode }) {
  return <SyncfusionWrapper>{children}</SyncfusionWrapper>;
}
