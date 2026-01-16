'use client';

import { useEffect, useState } from 'react';
import Panel from '@src/components/common/Panel';

const calculateTimeRemaining = (eventStartTime: number) => {
  const timeUntilStart = eventStartTime - Date.now();

  if (timeUntilStart < 0) {
    return {
      days: '0',
      hours: '0',
      minutes: '0',
      seconds: '0',
    };
  }

  const timeUntilStartInSeconds = Math.floor(
    (timeUntilStart % (1000 * 60)) / 1000,
  );
  const timeUntilStartInMinutes = Math.floor(
    (timeUntilStart % (1000 * 60 * 60)) / (1000 * 60),
  );
  const timeUntilStartInHours = Math.floor(
    (timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const timeUntilStartInDays = Math.floor(
    timeUntilStart / (1000 * 60 * 60 * 24),
  );

  return {
    days: timeUntilStartInDays.toString(),
    hours: timeUntilStartInHours.toString(),
    minutes: timeUntilStartInMinutes.toString(),
    seconds: timeUntilStartInSeconds.toString(),
  };
};

type CountdownTimerProps = {
  startTime: Date;
  id?: string;
};

export default function CountdownTimer({ startTime, id }: CountdownTimerProps) {
  const eventStartTime = startTime.getTime();

  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(eventStartTime),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(eventStartTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [eventStartTime]);

  if (Date.now() > eventStartTime) return null;

  return (
    <Panel id={id} smallPadding heading="Event Starts In">
      <div className="grid grid-cols-4 gap-2 w-fit text-center mx-auto">
        <div className="flex flex-col">
          <p className="font-display text-2xl">{timeRemaining.days}</p>
          <p className="text-[0.625rem] font-medium text-slate-500">Days</p>
        </div>
        <div className="flex flex-col">
          <p className="font-display text-2xl">{timeRemaining.hours}</p>
          <p className="text-[0.625rem] font-medium text-slate-500">Hours</p>
        </div>
        <div className="flex flex-col">
          <p className="font-display text-2xl">{timeRemaining.minutes}</p>
          <p className="text-[0.625rem] font-medium text-slate-500">Minutes</p>
        </div>
        <div className="flex flex-col">
          <p className="font-display text-2xl">{timeRemaining.seconds}</p>
          <p className="text-[0.625rem] font-medium text-slate-500">Seconds</p>
        </div>
      </div>
    </Panel>
  );
}
