'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { UploadIcon } from '@src/icons/Icons';
import { type SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { type RouterOutputs } from '@src/trpc/shared';
import { createEventSchema } from '@src/utils/formSchemas';
import EventCardPreview from './EventCardPreview';
import TimeSelect from './TimeSelect';

const EventForm = ({
  mode = 'create',
  clubId,
  officerClubs,
  event,
}: {
  mode?: 'create' | 'edit';
  clubId: string;
  officerClubs: SelectClub[];
  event?: RouterOutputs['event']['findByFilters']['events'][number];
}) => {
  const { register, handleSubmit, watch, setValue, getValues, control } =
    useForm<z.infer<typeof createEventSchema>>({
      resolver: zodResolver(createEventSchema),
      defaultValues: mode === 'edit' && event
        ? {
            clubId: event.clubId,
            name: event.name,
            location: event.location,
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
          }
        : {
            clubId: clubId,
      },
      mode: 'onSubmit',
    });
  const router = useRouter();
  const [watchDescription, watchStartTime] = watch([
    'description',
    'startTime',
  ]);
  const [loading, setLoading] = useState(false);
  const [eventPreview, setEventPreview] = useState(
    mode === 'edit' && event
      ? event
      : ({
          name: '',
          clubId,
          description: '',
          location: '',
          liked: false,
          id: '',
          startTime: new Date(Date.now()),
          endTime: new Date(Date.now()),
          club: officerClubs.filter((v) => v.id == clubId)[0]!,
        })
  );
  useEffect(() => {
    const subscription = watch((data, info) => {
      const { name, clubId, description, location, startTime, endTime } = data;
      const club = officerClubs.find((val) => val.id == data.clubId);
      if (club) {
        setEventPreview({
          name: name || '',
          clubId: clubId || '',
          description: description || '',
          location: location || '',
          liked: false,
          id: '',
          startTime:
            startTime?.toString() === '' || startTime === undefined
              ? new Date(Date.now())
              : new Date(startTime),
          endTime:
            endTime?.toString() === '' ||
            endTime?.toString() === 'Invalid Date' ||
            !endTime
              ? new Date(Date.now())
              : new Date(endTime),
          club,
        });
      }
      if (info.name === "clubId" && mode === 'create') {
        router.replace(`/manage/${data.clubId}/create`);
      }
    });
    return () => subscription.unsubscribe();
  }, [router, watch, officerClubs]);

  const api = useTRPC();
  const createMutation = useMutation(api.event.create.mutationOptions());
  const updateMutation = useMutation(api.event.update.mutationOptions());

  const mutation = mode === "edit" && event
    ? updateMutation
    : createMutation;

  const onSubmit = handleSubmit((data) => {
    if (mutation.isPending || loading) return;
    
    setLoading(true);
    
    const payload =
      mode === 'edit' && event
        ? { id: event.id, ...data }
        : data;

    mutation.mutate(payload as any, {
      onSuccess: (newId) => {
        const targetId = mode === 'edit' ? event?.id : (newId as string);
        router.push(`/event/${targetId}`);
        },
        onError: () => {
          setLoading(false);
        },
      });
  });

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="flex w-full flex-row flex-wrap justify-start gap-10 overflow-x-clip pb-4 text-[#4D5E80]"
    >
      <div className="form-fields flex max-w-[830px] min-w-[320px] flex-1 flex-col gap-10">
        <div className="create-dropdown flex max-w-full flex-row justify-start gap-1 py-2 text-2xl font-bold whitespace-nowrap">
          <span>
            {mode === 'edit' ? 'Edit Club Event' : 'Create Club Event'}{' '}
            <span className="text-[#3361FF]">for</span>
          </span>
          <div className="flex-1">
            <select
              {...register('clubId')}
              defaultValue={clubId}
              disabled={mode === 'edit'}
              className="w-full overflow-hidden bg-inherit text-ellipsis whitespace-nowrap text-[#3361FF] outline-hidden disabled:cursor-not-allowed"
            >
              {officerClubs.map((club) => {
                return (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="event-pic w-full">
          <h1 className="mb-4 font-bold">Event Picture</h1>
          <p className="upload-label mb-11 text-xs font-bold">
            Drag or choose file to upload
          </p>
          <div className="upload-box flex h-48 w-full flex-col items-center justify-center gap-6 rounded-md bg-[#E9EAEF] opacity-50">
            <UploadIcon />
            <p className="text-xs font-bold">JPEG, PNG, or SVG</p>
          </div>
        </div>
        <div className="event-details flex w-full flex-col gap-4">
          <h1 className="font-bold">Event Details</h1>
          <div className="event-name">
            <label className="mb-2 block text-xs font-bold" htmlFor="name">
              Event Name
            </label>
            <input
              type="text"
              className="w-full rounded-md p-2 text-xs shadow-xs outline-hidden placeholder:text-[#7D8FB3]"
              placeholder="Event name"
              {...register('name')}
            />
          </div>
          <div className="event-location">
            <label className="mb-2 block text-xs font-bold" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              className="w-full rounded-md p-2 text-xs shadow-xs outline-hidden placeholder:text-[#7D8FB3]"
              placeholder="123 Fun Street"
              {...register('location')}
            />
          </div>
          <div className="event-description">
            <div className="desc-header flex w-full justify-between">
              <label
                className="mb-2 block text-xs font-bold"
                htmlFor="description"
              >
                Description
              </label>
              <p className="text-xs">
                {watchDescription && watchDescription.length} of 1000 Characters
                used
              </p>
            </div>
            <textarea
              {...register('description')}
              className="w-full rounded-md p-2 text-xs shadow-xs outline-hidden placeholder:text-[#7D8FB3]"
              placeholder="Event description"
            />
          </div>
        </div>
        <TimeSelect
          setValue={setValue}
          getValues={getValues}
          watchStartTime={watchStartTime}
          control={control}
        />
        <input
          type="submit"
          value={mode === 'edit' ? 'Save Changes' : 'Create'}
          className={`bg-[#3361FF] ${loading ? 'opacity-40' : ''} rounded-md py-6 text-xs font-black text-white hover:cursor-pointer`}
        />
      </div>
      <div className="form-preview flex w-64 flex-col gap-14">
        <h1 className="text-lg font-bold">Preview</h1>
        {eventPreview && <EventCardPreview event={eventPreview} />}
      </div>
    </form>
  );
};
export default EventForm;
