'use client';

import { useEffect, useState, type ReactNode } from 'react';
import DateBrowser from '@src/components/events/DateBrowser';
import { type eventParamsSchema } from '@src/utils/eventFilter';
import useSyncedSearchParams from '@src/utils/useSyncedSearchParams';

type Props = {
  children: ReactNode;
  searchParams: eventParamsSchema;
};

const EventView = ({ children, searchParams }: Props) => {
  const [params, setParams] = useSyncedSearchParams(searchParams, '/events');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full px-6">
      <div className="flex flex-col pt-4 md:flex-row md:items-end md:pr-7.5 md:pb-12">
        <h1 className="h-min align-middle text-2xl font-bold text-[#4D5E80]">
          Events
        </h1>
        <div className="relative z-0 mt-2.5 flex flex-row justify-center gap-x-16 md:mt-0 md:ml-auto">
          {isMobile ? (
            <input
              type="date"
              value={
                params.date
                  ? new Date(params.date).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) => setParams({ date: new Date(e.target.value) })}
              className="rounded-md border px-3 py-2"
            />
          ) : (
            <DateBrowser filterState={params} setParams={setParams} />
          )}
        </div>
      </div>
      <div className="container flex w-full flex-col overflow-x-clip sm:flex-row sm:space-x-7.5">
        <div
          data-view={'list'}
          className={
            'md:items-normal group flex w-full flex-col items-center space-y-7.5 pt-10'
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
};
export default EventView;
