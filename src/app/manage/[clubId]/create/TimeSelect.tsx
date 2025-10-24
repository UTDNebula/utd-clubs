'use client';
import type { createEventSchema } from '@src/utils/formSchemas';
import type {
  Control,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { z } from 'zod';

interface Props {
  setValue: UseFormSetValue<z.infer<typeof createEventSchema>>;
  getValues: UseFormGetValues<z.infer<typeof createEventSchema>>;
  watchStartTime: Date;
  control: Control<z.infer<typeof createEventSchema>>;
}

const TimeSelect = ({
  setValue,
  getValues,
  watchStartTime,
  control,
}: Props) => {
  return (
    <>
      <div className="event-duration flex gap-32">
        <div className="flex flex-1 flex-col justify-end">
          <h1 className="mb-2 block font-bold">Duration</h1>
          <label htmlFor="startTime" className="mb-2 text-xs font-bold">
            Start Time
          </label>
          <Controller
            control={control}
            name="startTime"
            render={({ field: { value, ref, onChange } }) => (
              <input
                ref={ref}
                type="datetime-local"
                value={
                  value
                    ? new Date(
                        value.getTime() - value.getTimezoneOffset() * 60 * 1000,
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ''
                }
                onChange={(e) => {
                  if (
                    !getValues('endTime') ||
                    new Date(e.currentTarget.value) > getValues('endTime')
                  ) {
                    // Add 1 hr to new start time
                    setValue(
                      'endTime',
                      new Date(
                        new Date(e.currentTarget.value).getTime() +
                          60 * 60 * 1000,
                      ),
                    );
                  }
                  onChange(new Date(e.currentTarget.value));
                }}
                className="block w-full rounded-md bg-white p-2 text-xs text-[#7D8FB3] outline-hidden"
              />
            )}
            rules={{
              required: true,
            }}
          />
        </div>
        <div className="flex flex-1 flex-col justify-end">
          <label htmlFor="endTime" className="mb-2 text-xs font-bold">
            End Time
          </label>
          <Controller
            control={control}
            name="endTime"
            render={({ field: { value, ref, onChange } }) => (
              <input
                ref={ref}
                type="datetime-local"
                min={
                  watchStartTime
                    ? new Date(
                        new Date(watchStartTime).getTime() -
                          new Date(watchStartTime).getTimezoneOffset() *
                            60 *
                            1000,
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ''
                }
                value={
                  value
                    ? new Date(
                        value.getTime() - value.getTimezoneOffset() * 60 * 1000,
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ''
                }
                onChange={(e) => onChange(new Date(e.currentTarget.value))}
                className="block w-full rounded-md bg-white p-2 text-xs text-[#7D8FB3] outline-hidden"
              />
            )}
            rules={{
              required: true,
            }}
          />
        </div>
      </div>
    </>
  );
};
export default TimeSelect;
