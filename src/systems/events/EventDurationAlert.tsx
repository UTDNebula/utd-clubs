'use client';

import { type ReactNode } from 'react';
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
  const start = event.startTime;
  const end = event.endTime;
  const allDayStart = start.getHours() == 0 
    && start.getMinutes() === 0 
    && start.getSeconds() === 0
    && start.getMilliseconds() === 0;

  const allDayEnd = end.getHours() === 23
    && end.getMinutes() === 59
    && end.getSeconds() === 0
    && end.getMilliseconds() === 0;

  const notSameDate = start.getDate() != end.getDate()
    || start.getMonth() != end.getMonth()
    || start.getFullYear() != end.getFullYear();


  if(allDayStart && allDayEnd && !notSameDate){
    return(
      <Base className="bg-black/70">All-Day</Base>);
  }else if(notSameDate){
    return(
      <Base className="bg-black/70">Multi-Day</Base>);
  }

};
export default EventDurationAlert;
