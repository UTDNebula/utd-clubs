'use client';

import { format, isSameDay } from 'date-fns';

type ClientEventTimeProps = {
  startTime: Date;
  endTime: Date;
};

const ClientEventTime: React.FC<ClientEventTimeProps> = ({
  startTime,
  endTime,
}) => {
  return (
    <>
      {format(startTime, 'E, MMM d, p')}
      {isSameDay(startTime, endTime) ? (
        <> - {format(endTime, 'p')}</>
      ) : (
        <> - {format(endTime, 'E, MMM d, p')}</>
      )}
    </>
  );
};
//export it
export default ClientEventTime;
