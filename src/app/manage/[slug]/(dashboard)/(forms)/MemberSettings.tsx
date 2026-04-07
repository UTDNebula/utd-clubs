'use client';

import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import Panel from '@src/components/common/Panel';
import { setSnackbar, SnackbarPresets } from '@src/components/global/Snackbar';
import type { SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { useAppForm } from '@src/utils/form';

type MemberSettingsProps = {
  club: SelectClub;
};

const memberSettingsSchema = z.object({
  policy: z.enum(['open', 'request', 'closed']),
});

const policyOptions = [
  { value: 'open', label: 'Anyone can join' },
  { value: 'request', label: 'Request to join' },
  { value: 'closed', label: 'No new members' },
];

const policyDescriptions: Record<string, string> = {
  open: 'Any follower can become a member instantly with no approval required.',
  request:
    'Followers can submit a request to join. Officers must approve or deny each request before membership is granted.',
  closed:
    'New memberships are not accepted. Existing members are unaffected, but followers cannot join or request to join.',
};

export default function MemberSettings({ club }: MemberSettingsProps) {
  const api = useTRPC();

  const updatePolicy = useMutation(
    api.club.edit.updateMembershipPolicy.mutationOptions({
      onSuccess: () => {
        setSnackbar(SnackbarPresets.savedName('membership policy'));
      },
      onError: (error) => {
        setSnackbar(
          SnackbarPresets.errorCustomMessage(
            'Failed to update membership policy',
            error.message,
          ),
        );
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      policy: club.membershipPolicy,
    },
    validators: {
      onChange: memberSettingsSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await updatePolicy.mutateAsync({ clubId: club.id, policy: value.policy });
      formApi.reset({ policy: value.policy });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Panel
        heading="Member Settings"
        description={
          <p>
            Control how new members can join your club. This setting affects
            what options followers see when viewing your club page.
          </p>
        }
      >
        <div className="flex flex-col gap-4 m-2 mt-0">
          <form.AppField name="policy">
            {(field) => (
              <div className="flex flex-col gap-1">
                <field.Select
                  label="Membership Policy"
                  options={policyOptions}
                />
                <p className="text-sm text-neutral-500 dark:text-neutral-400 ml-1">
                  {policyDescriptions[field.state.value]}
                </p>
              </div>
            )}
          </form.AppField>
        </div>
        <div className="flex flex-wrap justify-end items-center gap-2">
          <form.AppForm>
            <form.ResetButton />
          </form.AppForm>
          <form.AppForm>
            <form.SubmitButton />
          </form.AppForm>
        </div>
      </Panel>
    </form>
  );
}
