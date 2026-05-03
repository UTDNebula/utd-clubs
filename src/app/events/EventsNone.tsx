'use client';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from '@mui/material';
import { add, format, parseISO } from 'date-fns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type EventsNoneProps = {
  date: string;
};

const EventsNone = ({ date }: EventsNoneProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function setDate(newValue: Date) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', format(newValue, 'yyyy-MM-dd'));
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <p className="font-bold text-slate-500">No events for {date}.</p>
      <Button
        variant="contained"
        className="normal-case"
        size="large"
        endIcon={<ArrowForwardIcon />}
        onClick={() => {
          setDate(add(parseISO(date), { days: 1 }));
        }}
      >
        Check Next Day
      </Button>
    </div>
  );
};
export default EventsNone;
