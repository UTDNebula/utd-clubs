'use client';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import z from 'zod';
import FormFieldSet from '@src/components/form/FormFieldSet';
import OfficerListItem from '@src/components/manage/OfficerListItem';
import type { SelectClub, SelectOfficer } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import { editListedOfficerSchema } from '@src/utils/formSchemas';

type FormData = z.infer<typeof editListedOfficerSchema>;

function typedDefaultValues(
  listedOfficers: SelectOfficer[],
): FormData['officers'] {
  return listedOfficers.map((officer) => ({
    id: officer.id,
    name: officer.name,
    position: officer.position,
  }));
}

type OfficerWithId = FormData['officers'][number] & { id: string };

function hasId(
  officer: FormData['officers'][number],
): officer is OfficerWithId {
  return typeof officer.id === 'string';
}

type OfficersProps = {
  club: SelectClub;
  listedOfficers: SelectOfficer[];
};

const Officers = ({ club, listedOfficers }: OfficersProps) => {
  const api = useTRPC();
  const editOfficers = useMutation(
    api.club.edit.listedOfficers.mutationOptions({}),
  );

  const [defaultValues, setDefaultValues] = useState({
    officers: typedDefaultValues(listedOfficers),
  });

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      // Separate created vs modified
      const created: FormData['officers'] = [];
      const modified: OfficerWithId[] = [];

      value.officers.forEach((officer, index) => {
        // If it has no ID, it's created
        if (!hasId(officer)) {
          created.push(officer);
          return;
        }
        // If it has an ID, check if it was actually changed
        const isDirty =
          formApi.getFieldMeta(`officers[${index}].name`)?.isDirty ||
          formApi.getFieldMeta(`officers[${index}].position`)?.isDirty;
        if (isDirty) {
          modified.push(officer);
        }
      });
      const updated = await editOfficers.mutateAsync({
        clubId: club.id,
        deleted: deletedIds,
        modified: modified,
        created: created,
      });
      setDeletedIds([]);
      const newOfficers = typedDefaultValues(updated);
      setDefaultValues({ officers: newOfficers });
      formApi.reset({ officers: newOfficers });
    },
    validators: {
      onChange: editListedOfficerSchema,
    },
  });

  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const removeItem = (index: number) => {
    const current = form.getFieldValue('officers')[index];
    const id = current?.id;
    if (current && id) {
      setDeletedIds((prev) => [...prev, id]);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FormFieldSet legend="Listed Officers">
        <div className="ml-2 mb-4 text-slate-600 text-sm">
          <p>
            People&apos;s names on this list will appear on your public
            organization listing.
          </p>
        </div>
        <form.Field name="officers">
          {(field) => (
            <div className="flex flex-col gap-2">
              {field.state.value.map((value, index) => (
                <OfficerListItem
                  key={index}
                  index={index}
                  form={form}
                  removeItem={removeItem}
                />
              ))}
              <Button
                className="normal-case mb-2"
                startIcon={<AddIcon />}
                size="large"
                onClick={() => {
                  field.pushValue({ name: '', position: 'Officer' });
                }}
              >
                Add Listed Officer
              </Button>
            </div>
          )}
        </form.Field>
        <div className="flex flex-wrap justify-end items-center gap-2">
          <form.AppForm>
            <form.FormResetButton />
          </form.AppForm>
          <form.AppForm>
            <form.FormSubmitButton />
          </form.AppForm>
        </div>
      </FormFieldSet>
    </form>
  );
};

export default Officers;
