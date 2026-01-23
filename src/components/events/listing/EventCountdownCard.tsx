'use client';

import { formatDistanceStrict } from 'date-fns';
import { useEffect, useState } from 'react';
import Panel from '@src/components/common/Panel';

const calculateTimeRemaining = (now: number, eventStartTime: number) => {
  const timeUntilStart = eventStartTime - now;

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
    days: timeUntilStartInDays,
    hours: timeUntilStartInHours,
    minutes: timeUntilStartInMinutes,
    seconds: timeUntilStartInSeconds,
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
  const eventEndTime = endTime.getTime();

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [eventStartTime, eventEndTime]);

  const timeRemaining = calculateTimeRemaining(now, eventStartTime);
  const endsIn = formatDistanceStrict(eventEndTime, now, {
    addSuffix: true,
  });
  const ended = formatDistanceStrict(endTime, now, {
    addSuffix: true,
  });

  if (now > eventStartTime) {
    if (now < eventEndTime) {
      return (
        <Panel id={id} smallPadding className="text-center">
          <p className="font-display text-2xl">Happening Now</p>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Ends {endsIn}
          </p>
        </Panel>
      );
    }
    return (
      <Panel id={id} smallPadding className="text-center">
        <p className="font-display text-2xl">Event Over</p>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Ended {ended}
        </p>
      </Panel>
    );
  }

  return (
    <Panel id={id} smallPadding heading="Event Starts In">
      <div className="grid grid-flow-col auto-cols-fr gap-2 w-fit text-center mx-auto">
        {timeRemaining.days !== 0 && (
          <div className="flex flex-col">
            <p className="font-display text-2xl">
              {timeRemaining.days.toString().padStart(2, '0')}
            </p>
            <p className="text-[0.625rem] font-medium text-slate-600 dark:text-slate-400">
              Days
            </p>
          </div>
        )}
        {(timeRemaining.days !== 0 || timeRemaining.hours !== 0) && (
          <div className="flex flex-col">
            <p className="font-display text-2xl">
              {timeRemaining.hours.toString().padStart(2, '0')}
            </p>
            <p className="text-[0.625rem] font-medium text-slate-600 dark:text-slate-400">
              Hours
            </p>
          </div>
        )}
        {(timeRemaining.days !== 0 ||
          timeRemaining.hours !== 0 ||
          timeRemaining.minutes !== 0) && (
          <div className="flex flex-col">
            <p className="font-display text-2xl">
              {timeRemaining.minutes.toString().padStart(2, '0')}
            </p>
            <p className="text-[0.625rem] font-medium text-slate-600 dark:text-slate-400">
              Minutes
            </p>
          </div>
        )}
        <div className="flex flex-col">
          <p className="font-display text-2xl">
            {timeRemaining.seconds.toString().padStart(2, '0')}
          </p>
          <p className="text-[0.625rem] font-medium text-slate-600 dark:text-slate-400">
            Seconds
          </p>
        </div>
      </div>
    </Panel>
  );
}
