'use client';

import { format, isSameDay, isSameYear } from 'date-fns';

type ClientEventTimeProps = {
  startTime: Date;
  endTime: Date;
};

const ClientEventTime = ({ startTime, endTime }: ClientEventTimeProps) => {
  return (
    <>
      {isSameYear(startTime, new Date()) ? null : format(startTime, 'yyyy ')}
      {format(startTime, 'E, MMM d, p')}
      {isSameDay(startTime, endTime) ? (
        <> - {format(endTime, 'p')}</>
      ) : (
        <> - {format(endTime, 'E, MMM d, p')}</>
      )}
    </>
  );
};

export default ClientEventTime;
