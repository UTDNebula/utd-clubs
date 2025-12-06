'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z, { ZodError } from 'zod';
import Form from '@src/components/club/manage/form/Form';
import FormButtons from '@src/components/club/manage/form/FormButtons';
import FormFieldSet from '@src/components/club/manage/form/FormFieldSet';
import type { SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { editClubSchema } from '@src/utils/formSchemas';

type DetailsProps = {
  club: SelectClub;
};

type FormData = z.infer<typeof editClubSchema>;

type Errors = {
  errors: string[];
  properties?: {
    [key in keyof FormData]?: {
      errors?: string[];
    };
  };
};

function nullClubDataToUndefined(club: SelectClub) {
  return {
    ...club,
    ...{
      profileImage: club.profileImage ?? undefined,
      bannerImage: club.bannerImage ?? undefined,
      foundingDate: club.foundingDate ?? undefined,
    },
  };
}

const Details = ({ club }: DetailsProps) => {
  const methods = useForm<FormData>({
    resolver: zodResolver(editClubSchema),
    defaultValues: nullClubDataToUndefined(club),
    mode: 'onTouched',
  });

  const api = useTRPC();
  const editData = useMutation(
    api.club.edit.data.mutationOptions({
      onSuccess: (updated) => {
        if (typeof updated !== 'undefined') {
          methods.reset(nullClubDataToUndefined(updated));
        }
      },
    }),
  );

  const [errors, setErrors] = useState<Errors>({ errors: [] });

  const submitForm = methods.handleSubmit((data) => {
    if (!editData.isPending) {
      editData.mutate(data);
    }
  });

  const nameFieldErrors = errors.properties?.name?.errors;
  const foundingDateFieldErrors = errors.properties?.foundingDate?.errors;
  const descriptionFieldErrors = errors.properties?.description?.errors;

  return (
    <Form
      methods={methods}
      onSubmit={(e) => {
        e.preventDefault();
        submitForm().catch((err: ZodError) => {
          setErrors(z.treeifyError(err));
        });
      }}
    >
      <FormFieldSet legend="Edit Details">
        <div className="m-2 flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            <Controller
              control={methods.control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  label="Name"
                  className="grow [&>.MuiInputBase-root]:bg-white"
                  size="small"
                  error={nameFieldErrors && nameFieldErrors.length > 0}
                  helperText={nameFieldErrors?.join('. ')}
                />
              )}
            />
            <Controller
              control={methods.control}
              name="foundingDate"
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  onChange={onChange}
                  value={value ?? null}
                  label="Date Founded"
                  className="[&>.MuiInputBase-root]:bg-white"
                  slotProps={{
                    actionBar: {
                      actions: ['accept'],
                    },
                    textField: {
                      size: 'small',
                      error:
                        foundingDateFieldErrors &&
                        foundingDateFieldErrors.length > 0,
                      helperText: foundingDateFieldErrors?.join('. '),
                    },
                  }}
                />
              )}
            />
          </div>
          <Controller
            control={methods.control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                label="Description"
                className="[&>.MuiInputBase-root]:bg-white"
                multiline
                minRows={4}
                error={
                  descriptionFieldErrors && descriptionFieldErrors.length > 0
                }
                helperText={descriptionFieldErrors?.join('. ')}
              />
            )}
          />
        </div>
        <FormButtons
          isPending={editData.isPending}
          onClickDiscard={() => {
            setErrors({ errors: [] });
            methods.reset();
          }}
        />
      </FormFieldSet>
    </Form>
  );
};

export default Details;
