'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert'; // Added for error display
import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { type z } from 'zod';
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

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
    keyName: 'fieldId',
  });

  const router = useRouter();
  const api = useTRPC();

  const editContacts = useMutation(
    api.club.edit.contacts.mutationOptions({
      onSuccess: () => {
        router.refresh();
        setDeletedIds([]);
        methods.reset({ contacts: methods.getValues().contacts });
      },
      onError: (error) => {
        console.error('Error editing contacts:', error);
      },
    }),
  );

  // Available platforms
  const currentContacts = watch('contacts') || [];
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

  const submitForm = handleSubmit((data) => {
    console.log('Submitting:', JSON.stringify(data));

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
        const isDirty = dirtyFields.contacts?.[index];
        if (isDirty) {
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

  console.log(errors);

  return (
    <Form methods={methods} onSubmit={submitForm}>
      <FormFieldSet legend="Edit Contacts">
        {/* Error Display */}
        {editContacts.isError && (
          <Alert severity="error" className="mb-4">
            {editContacts.error.message ||
              'An error occurred while saving contacts.'}
          </Alert>
        )}

        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <ContactListItem
              key={field.fieldId}
              control={control}
              index={index}
              remove={() => removeItem(index)}
              errors={errors}
              platform={field.platform}
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

        <FormButtons isPending={editContacts.isPending} />
      </FormFieldSet>
    </Form>
  );
};

export default Contacts;
