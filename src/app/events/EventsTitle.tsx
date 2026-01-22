'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { add, format, parseISO, sub } from 'date-fns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type EventsTitleProps = {
  date: string;
};

const EventsTitle = ({ date }: EventsTitleProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function setDate(newValue: Date) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', format(newValue, 'yyyy-MM-dd'));
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 min-h-16 px-4">
      <h1 className="font-display text-2xl font-bold">Events</h1>
      <div className="flex gap-2 items-center">
        <IconButton
          size="large"
          onClick={() => {
            setDate(sub(parseISO(date), { days: 1 }));
          }}
        >
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>
        <DatePicker
          value={parseISO(date)}
          onChange={(newValue, context) => {
            if (context.validationError == null && newValue != null) {
              setDate(newValue);
            }
          }}
          className="[&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-neutral-900"
          slotProps={{
            actionBar: {
              actions: ['today', 'accept'],
            },
          }}
        />
        <IconButton
          size="large"
          onClick={() => {
            setDate(add(parseISO(date), { days: 1 }));
          }}
        >
          <ArrowForwardIcon fontSize="inherit" />
        </IconButton>
      </div>
    </div>
  );
};
export default EventsTitle;
