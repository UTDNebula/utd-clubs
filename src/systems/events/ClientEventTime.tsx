'use client';

import { TZDateMini } from '@date-fns/tz';
import { format, isSameWeek, isSameYear} from 'date-fns';

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

  const tzStartTime = new TZDateMini(startTime, 'America/Chicago');
  const tzEndTime = new TZDateMini(endTime, 'America/Chicago');
  const tzCurrentTime = TZDateMini.tz('America/Chicago');

  const minutes = (tzEndTime.getTime() - tzStartTime.getTime()) / 60_000;
  const days = Number((minutes / 1440).toFixed(1));
  const hours = Number((minutes / 60).toFixed(1));
  const mins = Math.round(minutes);

  const duration =
    minutes >= 1440
      ? `${days} ${days === 1
        ? 'day' 
        : 'days'}`
      : minutes >= 60
        ? `${hours} ${hours === 1
          ? 'hr' 
          : 'hrs'}`
        : `${mins} ${mins === 1
          ? 'min' 
          : 'mins'}`;

  return (
    <>
      {isSameWeek(tzStartTime, tzCurrentTime) ? (
        <> {format(tzStartTime, "'This' EEEE")}</>
      ) : (
        <> {format(tzStartTime, 'E, MMM d')}</>
      )}
      {isSameYear(tzStartTime, tzCurrentTime)
        ? null
        : format(tzStartTime, ' (yyyy)')}
      {format(tzStartTime, ' \u2022 h:mmaaa \u2022 ')}
      {duration}
    </>
  );
};

export default ClientEventTime;
