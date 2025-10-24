'use client';

import 'react-day-picker/dist/style.css';

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { LeftArrowIcon, RightArrowIcon } from '@src/icons/Icons';
import { type eventParamsSchema } from '@src/utils/eventFilter';
import { type useSyncedSearchParamsDispatch } from '@src/utils/useSyncedSearchParams';
import { addDays, subDays } from 'date-fns';
import { useEffect } from 'react';
import { DayPicker, useInput } from 'react-day-picker';

type DateBrowserProps = {
  filterState: eventParamsSchema;
  setParams: useSyncedSearchParamsDispatch<eventParamsSchema>;
};
const DateBrowser = ({ filterState, setParams }: DateBrowserProps) => {
  const { inputProps, dayPickerProps, setSelected } = useInput({
    defaultSelected: filterState.date,
  });
  useEffect(() => {
    if (dayPickerProps.selected != undefined) {
      setParams({ date: dayPickerProps.selected });
    }
  }, [dayPickerProps.selected]);
  return (
    <div className="flex w-full flex-row justify-between rounded-3xl bg-white px-5 py-2.5 align-middle shadow-md md:w-fit">
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <button
        onClick={() => {
          setSelected(subDays(dayPickerProps.selected!, 1));
        }}
        aria-label="back one day"
        type="submit"
      >
        <div>
          <LeftArrowIcon fill="fill-black" />
        </div>
      </button>
      <Popover defaultOpen={false}>
        <PopoverTrigger>
          <input
            name="date"
            {...inputProps}
            readOnly
            className="focus:outline-none"
          />
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent className="flex items-center rounded-lg bg-white p-2 shadow-md">
            <DayPicker mode="default" {...dayPickerProps} />
            <PopoverClose className="text-blue-primary h-5 w-5" />
          </PopoverContent>
        </PopoverPortal>
      </Popover>
      <button
        onClick={() => {
          setSelected(addDays(dayPickerProps.selected!, 1));
        }}
        aria-label="forward one day"
        type="submit"
      >
        <div>
          <RightArrowIcon fill="fill-black" />
        </div>
      </button>
    </div>
  );
};
export default DateBrowser;
