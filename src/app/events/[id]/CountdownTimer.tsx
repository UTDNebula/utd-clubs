'use client';

import { useEffect, useState } from 'react';

const calculateTimeRemaining = (eventStartTime: number) => {
  const timeUntilStart = eventStartTime - Date.now();

  if (timeUntilStart < 0)
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };

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
    days: timeUntilStartInDays.toLocaleString('en', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }),
    hours: timeUntilStartInHours.toLocaleString('en', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }),
    minutes: timeUntilStartInMinutes.toLocaleString('en', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }),
    seconds: timeUntilStartInSeconds.toLocaleString('en', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }),
  };
};

const CountdownTimer = ({ startTime }: { startTime: Date }) => {
  const eventStartTime = startTime.getTime();

  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(eventStartTime),
  );

  useEffect(() => {
    if (isLoading) setIsLoading(false);

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(eventStartTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading, eventStartTime]);

  if (isLoading || Date.now() > eventStartTime) return;

  return (
    <>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        Starts in
      </p>
      <div className="mt-5 flex justify-start"></div>
      <div className="flex text-3xl font-medium text-slate-800 dark:text-slate-200">
        <p className="mr-6">{timeRemaining.days}</p>
        <p className="mr-9">{timeRemaining.hours}</p>
        <p className="mr-11">{timeRemaining.minutes}</p>
        <p>{timeRemaining.seconds}</p>
      </div>
      <div className="mt-5 flex justify-start text-sm font-medium text-slate-600 dark:text-slate-400">
        <p className="mr-7">Days</p>
        <p className="mr-6">Hours</p>
        <p className="mr-6">Minutes</p>
        <p>Seconds</p>
      </div>
    </>
  );
};

export default CountdownTimer;
