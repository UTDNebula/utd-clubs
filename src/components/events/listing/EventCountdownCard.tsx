'use client';

import { formatDistanceStrict } from 'date-fns';
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

type EventCountdownCardProps = {
  startTime: Date;
  endTime: Date;
  id?: string;
};

export default function EventCountdownCard({
  startTime,
  endTime,
  id,
}: EventCountdownCardProps) {
  const eventStartTime = startTime.getTime();
  const eventEndTime = startTime.getTime();

  const now = Date.now();

  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(eventStartTime),
  );
  const [endsIn, setEndsIn] = useState(
    formatDistanceStrict(eventEndTime, now, {
      addSuffix: true,
    }),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTimeRemaining(calculateTimeRemaining(eventStartTime));
      setEndsIn(
        formatDistanceStrict(eventEndTime, now, {
          addSuffix: true,
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [eventStartTime, eventEndTime]);

  if (now > eventStartTime) {
    if (now < eventEndTime) {
      return (
        <Panel id={id} smallPadding className="text-center">
          <p className="font-display text-2xl">Happening Now</p>
          <p className="text-sm font-medium text-slate-500">Ends {endsIn}</p>
        </Panel>
      );
    }
    return (
      <Panel id={id} smallPadding className="text-center">
        <p className="font-display text-2xl">Event Over</p>
        <p className="text-sm font-medium text-slate-500">
          Ended{' '}
          {formatDistanceStrict(endTime, now, {
            addSuffix: true,
          })}
        </p>
      </Panel>
    );
  }

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
