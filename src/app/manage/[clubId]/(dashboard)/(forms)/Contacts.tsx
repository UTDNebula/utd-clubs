'use client';

import { Button, Typography } from '@mui/material';
import { useStore } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import z from 'zod';
import ContactListItem from '@src/components/club/manage/ContactListItem';
import FormFieldSet from '@src/components/club/manage/form/FormFieldSet';
import type { SelectClub, SelectContact } from '@src/server/db/models';
import { contactNames, startContacts } from '@src/server/db/schema/contacts';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import { editClubContactSchema } from '@src/utils/formSchemas';

type FormData = z.infer<typeof editClubContactSchema>;

function typedDefaultValues(contacts: SelectContact[]): FormData['contacts'] {
  return contacts.map((contact) => ({
    clubId: contact.clubId,
    platform: contact.platform,
    url: contact.url,
  }));
}

type ContactWithId = FormData['contacts'][number] & { clubId: string };

function hasId(
  contact: FormData['contacts'][number],
): contact is ContactWithId {
  return typeof contact.clubId === 'string';
}

type ContactsProps = {
  club: SelectClub & { contacts: SelectContact[] };
};

const Contacts = ({ club }: ContactsProps) => {
  const api = useTRPC();
  const editContacts = useMutation(api.club.edit.contacts.mutationOptions({}));

  const [defaultValues, setDefaultValues] = useState({
    contacts: typedDefaultValues(club.contacts),
  });

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      // Separate created vs modified
      const created: FormData['contacts'] = [];
      const modified: ContactWithId[] = [];

      value.contacts.forEach((contact, index) => {
        // If it has no ID, it's created
        if (!hasId(contact)) {
          created.push(contact);
          return;
        }
        // If it has an ID, check if it was actually changed
        const isDirty =
          formApi.getFieldMeta(`contacts[${index}].platform`)?.isDirty ||
          formApi.getFieldMeta(`contacts[${index}].url`)?.isDirty;
        if (isDirty) {
          modified.push(contact);
        }
      });
      const updated = await editContacts.mutateAsync({
        clubId: club.id,
        deleted: deletedIds,
        modified: modified,
        created: created,
      });
      setDeletedIds([]);
      const newContacts = typedDefaultValues(updated);
      setDefaultValues({ contacts: newContacts });
      formApi.reset({ contacts: newContacts });
    },
    validators: {
      onChange: editClubContactSchema,
    },
  });

  const [deletedIds, setDeletedIds] = useState<
    FormData['contacts'][number]['platform'][]
  >([]);

  const removeItem = (index: number) => {
    const current = form.getFieldValue('contacts')[index];
    if (current) {
      setDeletedIds((prev) => [...prev, current.platform]);
    }
    updateScrollGradient();
  };

  const currentContacts =
    useStore(form.store, (state) => state.values.contacts) || [];
  const available = startContacts.filter(
    (p) => !currentContacts.map((c) => c.platform).includes(p),
  );

  // Scroll gradients for adding contact item

  const scrollDistanceForGradient = 32;

  const [addContactBeforeOpacity, setAddContactBeforeOpacity] = useState(0);
  const [addContactAfterOpacity, setAddContactAfterOpacity] = useState(1);

  let addContactScrollDistance = 0;
  let addContactScrollDistanceMax = 0;

  const addContactRef = useRef<HTMLDivElement>(null);

  const addContactStyle: { [key: string]: string | number } = {
    '--addContactBeforeOpacity': addContactBeforeOpacity,
    '--addContactAfterOpacity': addContactAfterOpacity,
  };

  const updateScrollGradient = () => {
    addContactScrollDistance = addContactRef.current?.scrollLeft ?? 0;
    addContactScrollDistanceMax =
      (addContactRef.current?.scrollWidth ?? 0) -
      (addContactRef.current?.clientWidth ?? 0);

    setAddContactBeforeOpacity(
      addContactScrollDistance - 1 < addContactScrollDistanceMax
        ? addContactScrollDistance / scrollDistanceForGradient
        : 0,
    );
    setAddContactAfterOpacity(
      addContactScrollDistance < addContactScrollDistanceMax
        ? (addContactScrollDistanceMax - addContactScrollDistance) /
            scrollDistanceForGradient
        : 0,
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FormFieldSet legend="Contact Information" className="min-w-0">
        <form.Field name="contacts">
          {(field) => (
            <div className="flex flex-col gap-2 max-w-full">
              {field.state.value.map((value, index) => (
                <ContactListItem
                  key={value.platform}
                  index={index}
                  form={form}
                  removeItem={removeItem}
                />
              ))}
              {available.length > 0 && (
                <div className="flex gap-2 sm:items-center max-sm:flex-col sm:hover:bg-royal/4 max-sm:bg-royal/4 transition-colors sm:rounded-full max-sm:rounded-lg overflow-clip">
                  <Typography
                    variant="button"
                    className="flex items-center max-sm:justify-center whitespace-nowrap min-w-32 sm:h-14 max-sm:pt-4 max-h-full px-4 text-base text-slate-600 normal-case"
                  >
                    Add Contact...
                  </Typography>
                  <div
                    style={addContactStyle}
                    className={[
                      'relative min-w-0 w-full sm:rounded-full overflow-clip',
                      'before:opacity-[var(--addContactBeforeOpacity)] after:opacity-[var(--addContactAfterOpacity)]',
                      'before:content before:z-10 before:absolute before:top-0 before:left-0 before:h-full before:w-8 before:pointer-events-none',
                      'before:bg-linear-to-r before:from-white/75 before:to-transparent ',
                      'after:content after:z-10 after:absolute after:top-0 after:right-0 after:h-full after:w-8 after:pointer-events-none',
                      'after:bg-linear-to-l after:from-white/75 after:to-transparent after:backdrop-blur-xs after:mask-l-from-0',
                    ].join(' ')}
                  >
                    <div
                      className="relative p-2 flex gap-2 overflow-x-auto no-scrollbar sm:rounded-full overscroll-contain"
                      ref={addContactRef}
                      onScroll={updateScrollGradient}
                      onClick={updateScrollGradient}
                      onWheel={(event) => {
                        if (!event.deltaY) return;
                        event.currentTarget.scrollLeft +=
                          event.deltaX + event.deltaY;
                        event.preventDefault();
                      }}
                    >
                      {available.map((platform) => (
                        <Button
                          key={platform}
                          variant="contained"
                          value={platform}
                          className="normal-case min-w-fit"
                          onClick={() => field.pushValue({ platform, url: '' })}
                        >
                          {contactNames[platform]}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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

export default Contacts;
