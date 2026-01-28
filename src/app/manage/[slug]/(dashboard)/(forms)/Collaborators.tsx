'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import type z from 'zod';
import Panel from '@src/components/common/Panel';
import CollaboratorListItem from '@src/components/manage/CollaboratorListItem';
import { UserSearchBar } from '@src/components/searchBar/UserSearchBar';
import type {
  SelectClub,
  SelectUserMetadataToClubsWithUserMetadataWithUser,
} from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';
import { editOfficerSchema } from '@src/utils/formSchemas';
import { setSnackbar, SnackbarPresets } from '@src/utils/Snackbar';

type FormData = z.infer<typeof editOfficerSchema>;

function typedDefaultValues(
  officers: SelectUserMetadataToClubsWithUserMetadataWithUser[],
  role: 'Officer' | 'President' | 'Admin',
  userId: string | undefined,
): FormData['officers'] {
  return officers.map((officer) => ({
    userId: officer.userId,
    name:
      officer.userMetadata?.firstName + ' ' + officer.userMetadata?.lastName,
    email: officer.userMetadata?.user?.email ?? '',
    // Can remove if self or President
    canRemove:
      role === 'President' || role === 'Admin' || officer.userId === userId,
    canTogglePresident: role === 'President' || role === 'Admin',
    position: officer.memberType as 'President' | 'Officer',
  }));
}

type CollaboratorsProps = {
  club: SelectClub;
  officers: SelectUserMetadataToClubsWithUserMetadataWithUser[];
  role: 'Officer' | 'President' | 'Admin';
  userId?: string;
};

const Collaborators = ({
  club,
  officers,
  role,
  userId,
}: CollaboratorsProps) => {
  const api = useTRPC();
  const editOfficers = useMutation(
    (role === 'Admin'
      ? api.admin.updateOfficers
      : api.club.edit.officers
    ).mutationOptions({
      onSuccess: () => {
        setSnackbar(SnackbarPresets.savedName('club collaborators'));
      },
      onError: (error) => {
        setSnackbar(SnackbarPresets.errorMessage(error.message));
      },
    }),
  );

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
      if (role !== 'Admin' && (!self || role !== self.position)) {
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
      <Panel
        heading="Collaborators"
        description={
          <>
            <p>
              Users in this list can edit {role === 'Admin' ? 'a' : 'your'}{' '}
              organization&apos;s information and events.
            </p>
            <p>Admins in this list can manage other collaborators.</p>
            <p>
              To add someone as a collaborator, they must have a UTD Clubs
              account.
            </p>
          </>
        }
      >
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
                    email: user.email,
                    position: 'Officer',
                    canRemove: role === 'President' || role === 'Admin',
                    canTogglePresident:
                      role === 'President' || role === 'Admin',
                    new: true,
                  });
                }}
              />
            </div>
          )}
        </form.Field>
        <div className="flex flex-wrap justify-end items-center gap-2">
          <form.AppForm>
            <form.ResetButton
              onClick={() => {
                setDeletedIds([]);
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

export default Collaborators;
