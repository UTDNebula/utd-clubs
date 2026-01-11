'use client';

import { TZDateMini } from '@date-fns/tz';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useStore } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useUploadToUploadURL } from 'src/utils/uploadImage';
import Panel, { PanelSkeleton } from '@src/components/form/Panel';
import FormImage from '@src/components/manage/form/FormImage';
import { type SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { type RouterOutputs } from '@src/trpc/shared';
import { useAppForm } from '@src/utils/form';
import { eventFormSchema } from '@src/utils/formSchemas';
import EventCard, { EventCardSkeleton } from './EventCard';

type EventFormProps =
  | {
      mode?: 'create';
      club: SelectClub;
      event?: undefined;
    }
  | {
      mode: 'edit';
      club: SelectClub;
      event: RouterOutputs['event']['byId'];
    };

interface EventDetails {
  clubId: string;
  name: string;
  location: string;
  description: string;
  startTime: Date;
  endTime: Date;
  image: File | null;
}

const EventForm = ({ mode = 'create', club, event }: EventFormProps) => {
  const api = useTRPC();
  const createMutation = useMutation(api.event.create.mutationOptions());
  const updateMutation = useMutation(api.event.update.mutationOptions());
  const uploadImage = useUploadToUploadURL();
  const router = useRouter();

  const defaultValues = useMemo(() => {
    if (mode === 'edit' && event) {
      const defValues: EventDetails = {
        clubId: event.clubId,
        name: event.name,
        location: event.location,
        description: event.description,
        startTime: event.startTime,
        endTime: event.endTime,
        image: null,
      };

      return defValues;
    }

    // New Date only once to prevent call stack exceeded
    const defaultStartTime = TZDateMini.tz('America/Chicago');
    defaultStartTime.setHours(defaultStartTime.getHours() + 1);
    defaultStartTime.setMinutes(0);
    const defaultEndTime = TZDateMini.tz('America/Chicago');
    defaultEndTime.setHours(defaultEndTime.getHours() + 2);
    defaultEndTime.setMinutes(0);

    const defValues: EventDetails = {
      clubId: club.id,
      name: '',
      location: '',
      description: '',
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      image: null,
    };

    return defValues;
  }, [mode, event, club.id]);

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      if (mode === 'edit' && event) {
        // Image
        let imageUrl = null;
        const iImageIsDirty = !formApi.getFieldMeta('image')?.isDefaultValue;
        if (iImageIsDirty) {
          if (value.image === null) {
            imageUrl = null;
          } else {
            const url = await uploadImage.mutateAsync({
              file: value.image,
              fileName: `${club.id}-event-${event.id}`,
            });
            imageUrl = url ?? null;
          }
        }

        return updateMutation.mutateAsync(
          {
            id: event.id,
            ...value,
            image: imageUrl,
          },
          {
            onSuccess: () => router.push(`/events/${event.id}`),
          },
        );
      }

      // Create
      return createMutation.mutateAsync(
        {
          ...value,
        },
        {
          onSuccess: async (newId) => {
            // Uplaod image after we have an ID
            const iImageIsDirty =
              !formApi.getFieldMeta('image')?.isDefaultValue;
            if (!iImageIsDirty) {
              router.push(`/events/${newId}`);
              return;
            }

            const url = await uploadImage.mutateAsync({
              file: value.image,
              fileName: `${club.id}-event-${newId}`,
            });
            const imageUrl = url ?? null;
            updateMutation.mutate(
              {
                id: newId,
                ...value,
                image: imageUrl,
              },
              {
                onSuccess: () => {
                  router.push(`/events/${newId}`);
                },
              },
            );
          },
        },
      );
    },
    validators: {
      onChange: eventFormSchema,
    },
  });

  const formValues = useStore(form.store, (state) => state.values);
  const previewUrl = formValues.image
    ? URL.createObjectURL(formValues.image)
    : (event?.image ?? null);

  return (
    <div className="flex w-full flex-wrap justify-start gap-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="grow flex flex-col gap-4 max-w-full"
      >
        <Panel>
          <div className="flex flex-col gap-4">
            <form.Field name="image">
              {(field) => (
                <FormImage
                  label="Event Image"
                  value={field.state.value}
                  fallbackUrl={event?.image ?? undefined}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    field.handleChange(file);
                  }}
                />
              )}
            </form.Field>
            <form.Field name="name">
              {(field) => (
                <TextField
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="[&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-neutral-900"
                  size="small"
                  error={!field.state.meta.isValid}
                  helperText={
                    !field.state.meta.isValid
                      ? field.state.meta.errors
                          .map((err) => err?.message)
                          .join('. ') + '.'
                      : undefined
                  }
                  label="Name"
                />
              )}
            </form.Field>
            <form.Field name="location">
              {(field) => (
                <TextField
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="[&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-neutral-900"
                  size="small"
                  error={!field.state.meta.isValid}
                  helperText={
                    !field.state.meta.isValid
                      ? field.state.meta.errors
                          .map((err) => err?.message)
                          .join('. ') + '.'
                      : undefined
                  }
                  label="Location"
                />
              )}
            </form.Field>
            <form.Field name="description">
              {(field) => (
                <TextField
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                  }}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  label="Description"
                  className="[&>.MuiInputBase-root]:bg-white dark:[&>.MuiInputBase-root]:bg-neutral-900"
                  multiline
                  minRows={4}
                  error={!field.state.meta.isValid}
                  helperText={
                    !field.state.meta.isValid ? (
                      field.state.meta.errors
                        .map((err) => err?.message)
                        .join('. ') + '.'
                    ) : (
                      <span>
                        We support{' '}
                        <a
                          href="https://www.markdownguide.org/basic-syntax/"
                          rel="noreferrer"
                          target="_blank"
                          className="text-royal underline"
                        >
                          Markdown
                        </a>
                        !
                      </span>
                    )
                  }
                />
              )}
            </form.Field>
            <div className="flex flex-wrap gap-4">
              <form.Field name="startTime">
                {(field) => (
                  <DateTimePicker
                    onChange={(value) => value && field.handleChange(value)}
                    value={field.state.value}
                    label="Start"
                    className="grow [&>.MuiPickersInputBase-root]:bg-white dark:[&>.MuiPickersInputBase-root]:bg-neutral-900"
                    slotProps={{
                      actionBar: {
                        actions: ['accept'],
                      },
                      textField: {
                        size: 'small',
                        error: !field.state.meta.isValid,
                        helperText: !field.state.meta.isValid
                          ? field.state.meta.errors
                              .map((err) => err?.message)
                              .join('. ') + '.'
                          : undefined,
                      },
                    }}
                  />
                )}
              </form.Field>
              <form.Field name="endTime">
                {(field) => (
                  <DateTimePicker
                    onChange={(value) => value && field.handleChange(value)}
                    value={field.state.value}
                    label="End"
                    className="grow [&>.MuiPickersInputBase-root]:bg-white dark:[&>.MuiPickersInputBase-root]:bg-neutral-900"
                    slotProps={{
                      actionBar: {
                        actions: ['accept'],
                      },
                      textField: {
                        size: 'small',
                        error: !field.state.meta.isValid,
                        helperText: !field.state.meta.isValid
                          ? field.state.meta.errors
                              .map((err) => err?.message)
                              .join('. ') + '.'
                          : undefined,
                      },
                    }}
                  />
                )}
              </form.Field>
            </div>
          </div>
          <div className="flex flex-wrap justify-end items-center gap-2">
            <form.AppForm>
              <form.FormResetButton />
            </form.AppForm>
            <form.AppForm>
              <form.FormSubmitButton />
            </form.AppForm>
          </div>
        </Panel>
      </form>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Preview</h2>
        <EventCard
          event={{
            id: '',
            ...formValues,
            image: previewUrl,
            club,
            updatedAt: new Date(),
            createdAt: new Date(),
            recurrence: '',
            recurenceId: '',
            google: false,
            etag: '',
          }}
          view="preview"
        />
      </div>
    </div>
  );
};

export default EventForm;

export const EventFormSkeleton = () => {
  return (
    <div className="flex w-full flex-wrap justify-start gap-10">
      <div className="grow flex flex-col gap-4 max-w-full">
        <PanelSkeleton />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Preview</h2>
        <EventCardSkeleton />
      </div>
    </div>
  );
};
