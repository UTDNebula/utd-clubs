'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import z, { ZodError } from 'zod';
import Form from '@src/components/club/manage/form/Form';
import {
  FormButtons,
  FormFieldSet,
} from '@src/components/club/manage/FormComponents';
import OfficerListItem from '@src/components/club/manage/OfficerListItem';
import type { SelectClub, SelectOfficer } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { editListedOfficerSchema } from '@src/utils/formSchemas';

type OfficersProps = {
  club: SelectClub;
  listedOfficers: SelectOfficer[];
};

type FormData = z.infer<typeof editListedOfficerSchema>;

type Errors = {
  errors: string[];
  properties?: {
    officers?: {
      items?: {
        properties?: { [key in 'name' | 'position']?: { errors?: string[] } };
      }[];
    };
  };
};

const Officers = ({ club, listedOfficers }: OfficersProps) => {
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const methods = useForm<FormData>({
    resolver: zodResolver(editListedOfficerSchema),
    defaultValues: {
      officers: listedOfficers,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'officers',
    keyName: 'fieldId',
  });

  const api = useTRPC();
  const editOfficers = useMutation(
    api.club.edit.listedOfficers.mutationOptions({
      onSuccess: (updated) => {
        methods.reset({ officers: updated });
        setDeletedIds([]);
        setErrors({ errors: [] });
      },
    }),
  );

  // Remove by index
  const removeItem = (index: number) => {
    const officer = methods.getValues().officers[index];
    const id = officer?.id;
    if (officer && id) {
      setDeletedIds((prev) => [...prev, id]);
    }
    remove(index);
  };

  const [errors, setErrors] = useState<Errors>({ errors: [] });

  const submitForm = methods.handleSubmit((data) => {
    // Separate created vs modified
    const created: FormData['officers'] = [];
    const modified: SelectOfficer[] = [];

    data.officers.forEach((officer, index) => {
      // If it has no ID, it's created
      if (typeof officer.id === 'undefined') {
        created.push(officer);
      }
      // If it has an ID, check if it was actually changed
      else {
        const isDirty = methods.formState.dirtyFields.officers?.[index];
        const isAnyDirty = isDirty && Object.values(isDirty).some((v) => v);
        if (isAnyDirty) {
          modified.push(officer as SelectOfficer);
        }
      }
    });

    if (!editOfficers.isPending) {
      editOfficers.mutate({
        clubId: club.id,
        deleted: deletedIds,
        modified: modified,
        created: created,
      });
    }
  });

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
      <FormFieldSet legend="Listed Officers">
        <div className="ml-2 mb-4 text-slate-600 text-sm">
          <p>
            People&apos;s names on this list will appear on your public
            organization listing.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <OfficerListItem
              key={field.fieldId}
              control={methods.control}
              remove={removeItem}
              index={index}
              errors={errors}
            />
          ))}
        </div>
        <Button
          className="normal-case mb-2"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => {
            append({ name: '', position: 'Officer' });
          }}
        >
          Add Listed Officer
        </Button>
        <FormButtons
          isPending={editOfficers.isPending}
          onClickDiscard={() => {
            setDeletedIds([]);
            setErrors({ errors: [] });
            methods.reset();
          }}
        />
      </FormFieldSet>
    </Form>
  );
};

export default Officers;
