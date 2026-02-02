'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button, Typography } from '@mui/material';
import { useStore } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import z from 'zod';
import Panel from '@src/components/common/Panel';
import { setSnackbar, SnackbarPresets } from '@src/components/global/Snackbar';
import ContactListItem from '@src/components/manage/ContactListItem';
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
  const editContacts = useMutation(
    api.club.edit.contacts.mutationOptions({
      onSuccess: () => {
        setSnackbar(SnackbarPresets.savedName('club contacts'));
      },
      onError: (error) => {
        setSnackbar(SnackbarPresets.errorMessage(error.message));
      },
    }),
  );

  const [defaultValues, setDefaultValues] = useState({
    contacts: typedDefaultValues(club.contacts),
  });

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      // Separate created vs modified
      const created: FormData['contacts'] = [];
      const modified: ContactWithId[] = [];
      const order: FormData['contacts'][number]['platform'][] = [];

      let hasReorder = false;

      value.contacts.forEach((contact, index) => {
        // Extra check for if user reorders, makes a change, then undoes reorder
        if (
          isReordered &&
          contact.platform !== defaultValues.contacts[index]?.platform
        ) {
          hasReorder = true;
        }

        order.push(contact.platform);

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
        order: hasReorder ? order : undefined,
      });
      setDeletedIds([]);
      setIsReordered(false);
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
  };

  const currentContacts =
    useStore(form.store, (state) => state.values.contacts) || [];
  const available = startContacts.filter(
    (p) => !currentContacts.map((c) => c.platform).includes(p),
  );

  // Flag for if user presses a reorder button
  const [isReordered, setIsReordered] = useState(false);

  // Detectors for when user interacts with a grab handle
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleReorderDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Reorder only if moved to a new location
    if (active.id !== over?.id) {
      form.setFieldValue('contacts', (contacts) => {
        const oldIndex = contacts.findIndex(
          (contact) => contact.platform === active.id,
        );
        const newIndex = contacts.findIndex(
          (contact) => contact.platform === over?.id,
        );

        setIsReordered(true);
        return arrayMove(contacts, oldIndex, newIndex);
      });
    }
    setActiveReorderPlatform(null);
  };

  const handleReorderDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveReorderPlatform(active.id);
  };

  // Platform (ID) of the item currently being reordered
  const [activeReorderPlatform, setActiveReorderPlatform] =
    useState<UniqueIdentifier | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Panel heading="Contact Information">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleReorderDragStart}
          onDragEnd={handleReorderDragEnd}
        >
          <SortableContext
            items={currentContacts.map((contact) => contact.platform)}
            strategy={verticalListSortingStrategy}
          >
            <form.Field name="contacts" mode="array">
              {(field) => (
                <div className="flex flex-col gap-2 max-w-full">
                  {field.state.value.map((value, index) => (
                    <ContactListItem
                      key={value.platform}
                      index={index}
                      form={form}
                      removeItem={removeItem}
                      onReorder={() => setIsReordered(true)}
                    />
                  ))}
                  {available.length > 0 && (
                    <div className="flex gap-2 sm:items-center max-sm:flex-col sm:hover:bg-neutral-100 dark:sm:hover:bg-neutral-800 max-sm:bg-neutral-100 dark:max-sm:bg-neutral-800 transition-colors rounded-lg">
                      <Typography
                        variant="button"
                        className="flex shrink-0 items-center max-sm:justify-center whitespace-nowrap min-w-32 sm:h-14 sm:pl-4 max-sm:pt-4 max-h-full text-base text-slate-600 dark:text-slate-400 normal-case"
                      >
                        Add Contact...
                      </Typography>
                      <div className="flex flex-wrap relative p-2 gap-2 overflow-x-auto">
                        {available.map((platform) => (
                          <Button
                            key={platform}
                            variant="contained"
                            value={platform}
                            className="normal-case min-w-fit"
                            onClick={() =>
                              field.pushValue({ platform, url: '' })
                            }
                          >
                            {contactNames[platform]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form.Field>
          </SortableContext>
          {/* List item that sticks to the cursor */}
          <DragOverlay className="opacity-80">
            {activeReorderPlatform ? (
              <ContactListItem
                key={activeReorderPlatform}
                overlayData={form
                  .getFieldValue('contacts')
                  .find(
                    (contact) => contact.platform === activeReorderPlatform,
                  )}
                index={form
                  .getFieldValue('contacts')
                  .findIndex(
                    (contact) => contact.platform === activeReorderPlatform,
                  )}
                form={form}
                removeItem={removeItem}
                onReorder={() => setIsReordered(true)}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
        <div className="flex flex-wrap justify-end items-center gap-2">
          <form.AppForm>
            <form.ResetButton
              onClick={() => {
                setDeletedIds([]);
                setIsReordered(false);
                form.reset();
              }}
            />
          </form.AppForm>
          <form.AppForm>
            <form.SubmitButton />
          </form.AppForm>
        </div>
      </Panel>
    </form>
  );
};

export default Contacts;
