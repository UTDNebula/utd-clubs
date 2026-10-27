'use client';

import {
  differenceInSeconds,
} from 'date-fns';
import { useEffect, useState, type ReactNode } from 'react';
import { type SelectEvent } from '@/server/db/models';

type EventDurationAlertProps = {
  event: SelectEvent;
};

type BaseProps = { children: ReactNode; className?: string };
const Base = ({ children, className }: BaseProps) => {
  return (
    <div
      className={`w-fit rounded-[.3125rem] px-2.5 py-1.25 text-center text-xs font-extrabold text-white ${
        className ?? ''
      }`}
    >
      {children}
    </div>
  );
};

//All-day events start at 12:00:00am and end at 11:59:00pm on the same day --> 86340 seconds
//Multi-day events end on a different date than the start date

const EventDurationAlert = ({ event }: EventDurationAlertProps) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const start = event.startTime;
  const end = event.endTime;
  const secDiff = differenceInSeconds(end, start);

  if(secDiff == 86340){
    return(
      <Base className="bg-black/70">All-Day</Base>);
  } else if(secDiff > 86340){
    return(
      <Base className="bg-black/70">Multi-Day</Base>);
  } 
};
export default EventDurationAlert;
