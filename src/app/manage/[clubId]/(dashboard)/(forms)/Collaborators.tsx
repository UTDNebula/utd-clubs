'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import type z from 'zod';
import CollaboratorListItem from '@src/components/club/manage/CollaboratorListItem';
import Form from '@src/components/club/manage/form/Form';
import {
  FormButtons,
  FormFieldSet,
} from '@src/components/club/manage/FormComponents';
import { UserSearchBar } from '@src/components/searchBar/UserSearchBar';
import type {
  SelectClub,
  SelectUserMetadataToClubsWithUserMetadata,
} from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { editOfficerSchema } from '@src/utils/formSchemas';

type CollaboratorsProps = {
  club: SelectClub;
  officers: SelectUserMetadataToClubsWithUserMetadata[];
  role: 'Officer' | 'President';
  userId: string;
};

type FormData = z.infer<typeof editOfficerSchema>;

function mapOfficersToFormData(
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

const Collaborators = ({
  club,
  officers,
  role,
  userId,
}: CollaboratorsProps) => {
  const officersMapped = mapOfficersToFormData(officers, role, userId);

  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const methods = useForm<FormData>({
    resolver: zodResolver(editOfficerSchema),
    defaultValues: { officers: officersMapped },
    mode: 'onTouched',
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'officers',
    keyName: 'fieldId',
  });

  const api = useTRPC();
  const editOfficers = useMutation(
    api.club.edit.officers.mutationOptions({
      onSuccess: (updated) => {
        const mappedOfficers = mapOfficersToFormData(updated, role, userId);
        methods.reset({
          officers: mappedOfficers,
        });
        setDeletedIds([]);
        const self = mappedOfficers.find((o) => o.userId === userId);
        if (!self || role !== self.position) {
          // Reload if own role changed
          window.location.reload();
        }
      },
    }),
  );

  // Remove by index
  const removeItem = (index: number) => {
    const officer = methods.getValues().officers[index];
    if (officer) {
      setDeletedIds((prev) => [...prev, officer.userId]);
    }
    remove(index);
  };

  const submitForm = methods.handleSubmit((data) => {
    // Separate created vs modified
    const created: FormData['officers'] = [];
    const modified: FormData['officers'] = [];

    data.officers.forEach((officer, index) => {
      // If it was marked as new from append call
      if (officer.new) {
        created.push(officer);
      }
      // Otherwise check if it was actually changed
      else {
        const isDirty = methods.formState.dirtyFields.officers?.[index];
        const isAnyDirty = isDirty && Object.values(isDirty).some((v) => v);
        if (isAnyDirty) {
          modified.push(officer);
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
        submitForm();
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
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <CollaboratorListItem
              key={field.fieldId}
              control={methods.control}
              remove={removeItem}
              index={index}
              name={field.name}
              canRemove={field.canRemove}
              canTogglePresident={field.canTogglePresident}
              self={field.userId == userId}
            />
          ))}
        </div>
        <UserSearchBar
          placeholder="Add Collaborator..."
          passUser={(user) => {
            append({
              userId: user.id,
              name: user.name,
              position: 'Officer',
              canRemove: role === 'President',
              canTogglePresident: role === 'President',
              new: true,
            });
          }}
        />
        <FormButtons
          isPending={editOfficers.isPending}
          onClickDiscard={() => {
            setDeletedIds([]);
            methods.reset();
          }}
        />
      </FormFieldSet>
    </Form>
  );
};

export default Collaborators;
