'use client';
import { type SelectEvent } from '@src/server/db/models';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';
import { type ReactNode } from 'react';
import { useState, useEffect } from 'react';

type EventTimeAlertProps = {
  event: SelectEvent;
};

type BaseProps = { children: ReactNode; className?: string };
const Base = ({ children, className }: BaseProps) => {
  return (
    <div
      className={` w-fit rounded-[.3125rem] bg-opacity-70 px-2.5 py-1.25 text-center text-xs font-extrabold text-white ${
        className ?? ''
      }`}
    >
      {children}
    </div>
  );
};

const EventTimeAlert = ({ event }: EventTimeAlertProps) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const start = event.startTime;
  const hourDiff = differenceInHours(start, now);

  if (event.startTime.getTime() < now) {
    if (event.endTime.getTime() < now) {
      return <Base className="bg-red-600">over :(</Base>;
    } else {
      return <Base className="bg-green-600">NOW</Base>;
    }
  } else {
    if (differenceInDays(start, now) < 1) {
      if (hourDiff < 1) {
        return (
          <Base className="bg-red-600">
            {differenceInMinutes(start, now)} minutes
          </Base>
        );
      } else if (hourDiff < 4) {
        return <Base className="bg-yellow-600">{hourDiff} hours</Base>;
      } else {
        return <Base className="bg-black">{hourDiff} hours</Base>;
      }
    } else {
      return (
        <Base className="bg-black">{differenceInDays(start, now)} days</Base>
      );
    }
  }
};
export default EventTimeAlert;
