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
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useStore } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import z from 'zod';
import Panel from '@src/components/common/Panel';
import MembershipFormListItem from '@src/components/manage/MembershipFormListItem';
import type { SelectClub, SelectMembershipForm } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import { editListedMembershipFormSchema } from '@src/utils/formSchemas';

type FormData = z.infer<typeof editListedMembershipFormSchema>;

function typedDefaultValues(
  listedForms: SelectMembershipForm[],
): FormData['membershipForms'] {
  return listedForms.map((form) => ({
    id: form.id,
    name: form.name,
    url: form.url,
  }));
}

type MembershipFormWithId = FormData['membershipForms'][number] & {
  id: string;
};

function hasId(
  membershipForm: FormData['membershipForms'][number],
): membershipForm is MembershipFormWithId {
  return (
    typeof membershipForm.id === 'string' &&
    !membershipForm.id.startsWith('new')
  );
}

type MembershipFormProps = {
  club: SelectClub;
  listedMembershipForms: SelectMembershipForm[];
};

const MembershipForms = ({
  club,
  listedMembershipForms,
}: MembershipFormProps) => {
  const api = useTRPC();
  const editForms = useMutation(
    api.club.edit.membershipForms.mutationOptions({}),
  );

  const [defaultValues, setDefaultValues] = useState({
    membershipForms: typedDefaultValues(listedMembershipForms),
  });

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      // Separate created vs modified
      const created: FormData['membershipForms'] = [];
      const modified: MembershipFormWithId[] = [];
      const order: NonNullable<FormData['membershipForms'][number]['id']>[] =
        [];

      let hasReorder = false;

      value.membershipForms.forEach((form, index) => {
        // Extra check for if user reorders, makes a change, then undoes reorder
        if (
          isReordered &&
          form.id !== defaultValues.membershipForms[index]?.id
        ) {
          hasReorder = true;
        }

        if (form.id) order.push(form.id);

        // If it has no ID or the ID starts with "new", it's created
        if (!hasId(form)) {
          created.push(form);
          return;
        }
        // If it has an ID, check if it was actually changed
        const isDirty =
          formApi.getFieldMeta(`membershipForms[${index}].name`)?.isDirty ||
          formApi.getFieldMeta(`membershipForms[${index}].url`)?.isDirty;
        if (isDirty) {
          modified.push(form);
        }
      });
      const updated = await editForms.mutateAsync({
        clubId: club.id,
        deleted: deletedIds,
        modified: modified,
        created: created,
        order: hasReorder ? order : undefined,
      });
      setDeletedIds([]);
      setIsReordered(false);
      const newMembershipForms = typedDefaultValues(updated);
      setDefaultValues({ membershipForms: newMembershipForms });
      formApi.reset({ membershipForms: newMembershipForms });
    },
    validators: {
      onChange: editListedMembershipFormSchema,
    },
  });

  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const removeItem = (index: number) => {
    const current = form.getFieldValue('membershipForms')[index];
    const id = current?.id;
    if (current && id && !id.startsWith('new')) {
      setDeletedIds((prev) => [...prev, id]);
    }
  };

  const currentMembershipForms =
    useStore(form.store, (state) => state.values.membershipForms) || [];

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
      form.setFieldValue('membershipForms', (forms) => {
        const oldIndex = forms.findIndex((form) => form.id === active.id);
        const newIndex = forms.findIndex((form) => form.id === over?.id);

        setIsReordered(true);
        return arrayMove(forms, oldIndex, newIndex);
      });
    }
    setActiveReorderId(null);
  };

  const handleReorderDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveReorderId(active.id);
  };

  // ID of the item currently being reordered
  const [activeReorderId, setActiveReorderId] =
    useState<UniqueIdentifier | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Panel
        heading="Membership Forms"
        description={
          <>
            <p>
              Link forms that students can fill out to join your organization.
            </p>
          </>
        }
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleReorderDragStart}
          onDragEnd={handleReorderDragEnd}
        >
          <SortableContext
            // `membershipForms.id` is non-null asserted because items will always have an ID:
            //   - Items from the server will have a Nano ID
            //   - New items created by the client will have a temporary ID, as seen on line 221
            items={currentMembershipForms.map((form) => form.id!)}
            strategy={verticalListSortingStrategy}
          >
            <form.Field name="membershipForms">
              {(field) => (
                <div className="flex flex-col gap-2">
                  {field.state.value.map((value, index) => (
                    <MembershipFormListItem
                      key={value.id}
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
                      field.pushValue({
                        name: '',
                        url: '',
                        // Temporary ID used for drag-and-drop sorting purposes.
                        // Will be replaced with a Nano ID by the server.
                        // This temporary ID must be detectable by `hasId()` on line 48.
                        id: `new-${currentMembershipForms.length}`,
                      });
                    }}
                  >
                    Add Membership Form
                  </Button>
                </div>
              )}
            </form.Field>
          </SortableContext>
          {/* List item that sticks to the cursor */}
          <DragOverlay className="opacity-80">
            {activeReorderId ? (
              <MembershipFormListItem
                key={activeReorderId}
                overlayData={form
                  .getFieldValue('membershipForms')
                  .find(
                    (membershipForm) => membershipForm.id === activeReorderId,
                  )}
                index={form
                  .getFieldValue('membershipForms')
                  .findIndex(
                    (membershipForm) => membershipForm.id === activeReorderId,
                  )}
                form={form}
                removeItem={removeItem}
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

export default MembershipForms;
