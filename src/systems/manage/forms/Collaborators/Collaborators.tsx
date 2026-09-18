'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import type z from 'zod';
import Panel from '@nebula-library/components/Panel';
import { setSnackbar, SnackbarPresets } from '@/lib/modules/snackbar';
import { useAppForm } from '@/lib/utils/form';
import type {
  SelectClub,
  SelectUserMetadataToClubsWithUserMetadataWithUser,
} from '@/server/db/models';
import { UserSearchBar } from '@/systems/manage/UserSearchBar';
import { useTRPC } from '@/trpc/react';
import CollaboratorListItem from './CollaboratorListItem';
import { editOfficerSchema } from './schema';

type FormData = z.infer<typeof editOfficerSchema>;

function typedDefaultValues(
  officers: SelectUserMetadataToClubsWithUserMetadataWithUser[],
  role: 'Collaborator' | 'Admin',
  userId: string | undefined,
): FormData['collaborators'] {
  return officers.map((officer) => ({
    userId: officer.userId,
    name:
      officer.userMetadata?.firstName + ' ' + officer.userMetadata?.lastName,
    email: officer.userMetadata?.user?.email ?? '',
    // Can remove if self or Admin
    canRemove:
      role === 'Admin' || role === 'Collaborator' || officer.userId === userId,
    canTogglePresident: role === 'Admin' || role === 'Collaborator',
    position: officer.memberType as 'Admin' | 'Collaborator',
  }));
}
  
type CollaboratorsProps = {
  club: SelectClub;
  officers: SelectUserMetadataToClubsWithUserMetadataWithUser[];
  role: 'Collaborator' | 'Admin';
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
      : api.club.manage.officers
    ).mutationOptions({
      onSuccess: () => {
        setSnackbar(SnackbarPresets.savedName('club collaborators'));
      },
      onError: (error) => {
        setSnackbar(SnackbarPresets.saveFailedWithMessage(error.message));
      },
    }),
  );

  const [defaultValues, setDefaultValues] = useState({
    collaborators: typedDefaultValues(officers, role, userId),
  });

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value, formApi }) => {
      // Separate created vs modified
      const created: FormData['collaborators'] = [];
      const modified: FormData['collaborators'] = [];

      value.collaborators.forEach((collaborator, index) => {
        // If it has no ID, it's created
        if (collaborator.new) {
          created.push(collaborator);
          return;
        }
        // If it has an ID, check if it was actually changed
        const isDirty = formApi.getFieldMeta(
          `collaborators[${index}].position`,
        )?.isDirty;
        if (isDirty) {
          modified.push(collaborator);
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
      setDefaultValues({ collaborators: newOfficers });
      formApi.reset({ collaborators: newOfficers });
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
    const current = form.getFieldValue('collaborators')[index];
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
        id="collaborators"
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
        <form.Field name="collaborators">
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
                    position: 'Collaborator',
                    canRemove: role === 'Admin',
                    canTogglePresident:
                      role === 'Admin',
                    new: true,
                  });
                }}
              />
            </div>
          )}
        </form.Field>
        <div className="flex flex-wrap items-center justify-end gap-2">
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
