'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z, type ZodError } from 'zod';
import ContactListItem from '@src/components/club/manage/ContactListItem';
import Form from '@src/components/club/manage/form/Form';
import {
  FormButtons,
  FormFieldSet,
} from '@src/components/club/manage/FormComponents';
import type { SelectClub, SelectContact } from '@src/server/db/models';
import { startContacts } from '@src/server/db/schema/contacts';
import { useTRPC } from '@src/trpc/react';
import { editClubContactSchema } from '@src/utils/formSchemas';

type ContactsProps = {
  club: SelectClub & { contacts: SelectContact[] };
};

type FormData = z.infer<typeof editClubContactSchema>;

type Errors = {
  errors: string[];
  properties?: {
    contacts?: { items?: { properties?: { url?: { errors?: string[] } } }[] };
  };
};

const Contacts = ({ club }: ContactsProps) => {
  const [deletedIds, setDeletedIds] = useState<
    FormData['contacts'][number]['platform'][]
  >([]);

  const methods = useForm<FormData>({
    resolver: zodResolver(editClubContactSchema),
    defaultValues: {
      contacts: club.contacts,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'contacts',
    keyName: 'fieldId',
  });

  const api = useTRPC();
  const editContacts = useMutation(
    api.club.edit.contacts.mutationOptions({
      onSuccess: (updated) => {
        methods.reset({ contacts: updated });
        setDeletedIds([]);
        setErrors({ errors: [] });
      },
    }),
  );

  // Available platforms
  const currentContacts = methods.watch('contacts') || [];
  const available = startContacts.filter(
    (p) => !currentContacts.map((c) => c.platform).includes(p),
  );

  // Remove by index
  const removeItem = (index: number) => {
    const contact = currentContacts[index];
    if (contact) {
      setDeletedIds((prev) => [...prev, contact.platform]);
    }
    remove(index);
  };

  const [errors, setErrors] = useState<Errors>({ errors: [] });

  const submitForm = methods.handleSubmit((data) => {
    // Separate created vs modified
    const created: FormData['contacts'] = [];
    const modified: SelectContact[] = [];

    data.contacts.forEach((contact, index) => {
      // If it has no ID, it's created
      if (typeof contact.clubId === 'undefined') {
        created.push(contact);
      }
      // If it has an ID, check if it was actually changed
      else {
        const isDirty = methods.formState.dirtyFields.contacts?.[index];
        const isAnyDirty = isDirty && Object.values(isDirty).some((v) => v);
        if (isAnyDirty) {
          modified.push(contact as SelectContact);
        }
      }
    });

    if (!editContacts.isPending) {
      editContacts.mutate({
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
      <FormFieldSet legend="Edit Contact Information">
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <ContactListItem
              key={field.fieldId}
              control={methods.control}
              remove={removeItem}
              platform={field.platform}
              index={index}
              errors={errors}
              available={available}
            />
          ))}
        </div>

        {available.length > 0 && (
          <Button
            className="normal-case mb-2"
            startIcon={<AddIcon />}
            size="large"
            onClick={() => {
              // Default to the first available platform
              if (available[0]) {
                append({ platform: available[0], url: '' });
              }
            }}
          >
            Add Contact
          </Button>
        )}

        <FormButtons
          isPending={editContacts.isPending}
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

export default Contacts;
