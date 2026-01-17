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
  return typeof officer.id === 'string' && !officer.id.startsWith('new');
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
      const order: NonNullable<FormData['officers'][number]['id']>[] = [];

      let hasReorder = false;

      value.officers.forEach((officer, index) => {
        // Extra check for if user reorders, makes a change, then undoes reorder
        if (isReordered && officer.id !== defaultValues.officers[index]?.id) {
          hasReorder = true;
        }

        if (officer.id) order.push(officer.id);

        // If it has no ID or the ID starts with "new", it's created
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
        order: hasReorder ? order : undefined,
      });
      setDeletedIds([]);
      setIsReordered(false);
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

  const currentOfficers =
    useStore(form.store, (state) => state.values.officers) || [];

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
      form.setFieldValue('officers', (officers) => {
        const oldIndex = officers.findIndex(
          (officer) => officer.id === active.id,
        );
        const newIndex = officers.findIndex(
          (officer) => officer.id === over?.id,
        );

        setIsReordered(true);
        return arrayMove(officers, oldIndex, newIndex);
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
      <Panel heading="Listed Officers">
        <div className="ml-2 mb-4 text-slate-600 dark:text-slate-400 text-sm">
          <p>
            People&apos;s names on this list will appear on your public
            organization listing.
          </p>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleReorderDragStart}
          onDragEnd={handleReorderDragEnd}
        >
          <SortableContext
            // `officer.id` is non-null asserted because items will always have an ID:
            //   - Items from the server will have a Nano ID
            //   - New items created by the client will have a temporary ID, as seen on line 221
            items={currentOfficers.map((officer) => officer.id!)}
            strategy={verticalListSortingStrategy}
          >
            <form.Field name="officers">
              {(field) => (
                <div className="flex flex-col gap-2">
                  {field.state.value.map((value, index) => (
                    <OfficerListItem
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
                        position: 'Officer',
                        // Temporary ID used for drag-and-drop sorting purposes.
                        // Will be replaced with a Nano ID by the server.
                        // This temporary ID must be detectable by `hasId()` on line 48.
                        id: `new-${currentOfficers.length}`,
                      });
                    }}
                  >
                    Add Listed Officer
                  </Button>
                </div>
              )}
            </form.Field>
          </SortableContext>
          {/* List item that sticks to the cursor */}
          <DragOverlay className="opacity-80">
            {activeReorderId ? (
              <OfficerListItem
                key={activeReorderId}
                overlayData={form
                  .getFieldValue('officers')
                  .find((officer) => officer.id === activeReorderId)}
                index={form
                  .getFieldValue('officers')
                  .findIndex((officer) => officer.id === activeReorderId)}
                form={form}
                removeItem={removeItem}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
        <div className="flex flex-wrap justify-end items-center gap-2">
          <form.AppForm>
            <form.FormResetButton
              onClick={() => {
                setDeletedIds([]);
                setIsReordered(false);
                form.reset();
              }}
            />
          </form.AppForm>
          <form.AppForm>
            <form.FormSubmitButton />
          </form.AppForm>
        </div>
      </Panel>
    </form>
  );
};

export default Officers;
