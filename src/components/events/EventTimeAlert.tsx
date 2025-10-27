'use client';

import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';
import { useEffect, useState, type ReactNode } from 'react';
import { type SelectEvent } from '@src/server/db/models';

type EventTimeAlertProps = {
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
      return <Base className="bg-red-600/70">over :(</Base>;
    } else {
      return <Base className="bg-green-600/70">NOW</Base>;
    }
  } else {
    if (differenceInDays(start, now) < 1) {
      if (hourDiff < 1) {
        return (
          <Base className="bg-red-600/70">
            {differenceInMinutes(start, now)} minutes
          </Base>
        );
      } else if (hourDiff < 4) {
        return <Base className="bg-yellow-600/70">{hourDiff} hours</Base>;
      } else {
        return <Base className="bg-black/70">{hourDiff} hours</Base>;
      }
    } else {
      return (
        <Base className="bg-black/70">{differenceInDays(start, now)} days</Base>
      );
    }
  }
};
export default EventTimeAlert;
