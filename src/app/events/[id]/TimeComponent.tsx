'use client';

import { TZDateMini } from '@date-fns/tz';
import { format } from 'date-fns';

type Props = {
  date: string;
};

const TimeComponent = (props: Props) => {
  const date = new TZDateMini(props.date, 'America/Chicago');
  const dateString = format(date, 'EEE, LLLL d, yyyy, hh:mm');

  return (
    <p className="text-sm text-white text-shadow-[0_0_4px_rgb(0_0_0_/_0.4)] dark:text-shadow-[0_0_4px_rgb(255_255_255_/_0.4)]">
      {dateString}
    </p>
  );
};

export default TimeComponent;
