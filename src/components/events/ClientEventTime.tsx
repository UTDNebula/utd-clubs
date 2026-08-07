'use client';

import { TZDateMini } from '@date-fns/tz';
import { format, isSameDay, isSameYear } from 'date-fns';

function isInvalidDateStrict(date: Date) {
  return date instanceof Date && Number.isNaN(date.getTime());
}

type ClientEventTimeProps = {
  startTime: Date;
  endTime: Date;
};

const ClientEventTime = ({ startTime, endTime }: ClientEventTimeProps) => {
  if (isInvalidDateStrict(startTime) || isInvalidDateStrict(endTime)) {
    return null;
  }

  const timeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Chicago';
  const tzStartTime = new TZDateMini(startTime, timeZone);
  const tzEndTime = new TZDateMini(endTime, timeZone);

  return (
    <>
      {isSameYear(tzStartTime, TZDateMini.tz(timeZone))
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
