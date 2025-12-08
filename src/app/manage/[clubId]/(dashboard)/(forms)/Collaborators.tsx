'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import type z from 'zod';
import FormFieldSet from '@src/components/form/FormFieldSet';
import CollaboratorListItem from '@src/components/manage/CollaboratorListItem';
import { UserSearchBar } from '@src/components/searchBar/UserSearchBar';
import type {
  SelectClub,
  SelectUserMetadataToClubsWithUserMetadata,
} from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import { editOfficerSchema } from '@src/utils/formSchemas';

type FormData = z.infer<typeof editOfficerSchema>;

function typedDefaultValues(
  officers: SelectUserMetadataToClubsWithUserMetadata[],
  role: 'Officer' | 'President',
  userId: string,
): FormData['officers'] {
  return officers.map((officer) => ({
    userId: officer.userId,
    name:
      officer.userMetadata?.firstName + ' ' + officer.userMetadata?.lastName,
    // Can remove if self or President
    canRemove: role === 'President' || officer.userId === userId,
    canTogglePresident: role === 'President',
    position: officer.memberType as 'President' | 'Officer',
  }));
}

type CollaboratorsProps = {
  club: SelectClub;
  officers: SelectUserMetadataToClubsWithUserMetadata[];
  role: 'Officer' | 'President';
  userId: string;
};

const Collaborators = ({
  club,
  officers,
  role,
  userId,
}: CollaboratorsProps) => {
  const api = useTRPC();
  const editOfficers = useMutation(api.club.edit.officers.mutationOptions({}));

  const [defaultValues, setDefaultValues] = useState({
    officers: typedDefaultValues(officers, role, userId),
  });

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      // Separate created vs modified
      const created: FormData['officers'] = [];
      const modified: FormData['officers'] = [];

      value.officers.forEach((officer, index) => {
        // If it has no ID, it's created
        if (officer.new) {
          created.push(officer);
          return;
        }
        // If it has an ID, check if it was actually changed
        const isDirty = formApi.getFieldMeta(
          `officers[${index}].position`,
        )?.isDirty;
        if (isDirty) {
          modified.push(officer);
        }
      });
      console.log({
        clubId: club.id,
        deleted: deletedIds,
        modified: modified,
        created: created,
      });
      const updated = await editOfficers.mutateAsync({
        clubId: club.id,
        deleted: deletedIds,
        modified: modified,
        created: created,
      });
      setDeletedIds([]);
      const newOfficers = typedDefaultValues(updated, role, userId);
      setDefaultValues({ officers: newOfficers });
      formApi.reset({ officers: newOfficers });
      // Reload if own role changed
      const self = newOfficers.find((o) => o.userId === userId);
      if (!self || role !== self.position) {
        window.location.reload();
      }
    },
    validators: {
      onChange: editOfficerSchema,
    },
  });

  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const removeItem = (index: number) => {
    const current = form.getFieldValue('officers')[index];
    const userId = current?.userId;
    if (current && userId) {
      setDeletedIds((prev) => [...prev, userId]);
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
      <FormFieldSet legend="Collaborators">
        <div className="ml-2 mb-4 text-slate-600 text-sm">
          <p>
            Users in this list can edit your club&apos;s information and events.
          </p>
          <p>Admins in this list can manage other collaborators.</p>
          <p>
            To add someone as a collaborator, they must have a UTD Clubs
            account.
          </p>
        </div>
        <form.Field name="officers">
          {(field) => (
            <div className="flex flex-col gap-2">
              {field.state.value.map((value, index) => (
                <CollaboratorListItem
                  key={value.userId}
                  index={index}
                  form={form}
                  removeItem={removeItem}
                  canRemove={value.canRemove}
                  canTogglePresident={value.canTogglePresident}
                  self={value.userId == userId}
                />
              ))}
              <UserSearchBar
                placeholder="Add Collaborator..."
                passUser={(user) => {
                  field.pushValue({
                    userId: user.id,
                    name: user.name,
                    position: 'Officer',
                    canRemove: role === 'President',
                    canTogglePresident: role === 'President',
                    new: true,
                  });
                }}
              />
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

export default Collaborators;
