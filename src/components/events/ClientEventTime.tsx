'use client';

import { TZDateMini } from '@date-fns/tz';
import { format, isSameDay, isSameYear } from 'date-fns';

type ClientEventTimeProps = {
  startTime: Date;
  endTime: Date;
};

const ClientEventTime = ({ startTime, endTime }: ClientEventTimeProps) => {
  const tzStartTime = new TZDateMini(startTime, 'America/Chicago');
  const tzEndTime = new TZDateMini(endTime, 'America/Chicago');

  return (
    <>
      {isSameYear(tzStartTime, TZDateMini.tz('America/Chicago'))
        ? null
        : format(tzStartTime, 'yyyy ')}
      {format(tzStartTime, 'E, MMM d, p')}
      {isSameDay(tzStartTime, tzEndTime) ? (
        <> - {format(tzEndTime, 'p')}</>
      ) : (
        <> - {format(tzEndTime, 'E, MMM d, p')}</>
      )}
    </>
  );
};

export default ClientEventTime;
