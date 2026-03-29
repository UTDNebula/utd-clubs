'use client';

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Panel from '@src/components/common/Panel';
import { setSnackbar, SnackbarPresets } from '@src/components/global/Snackbar';
import type { SelectClub } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';

type MemberSettingsProps = {
  club: SelectClub;
};

const policyLabels: Record<string, string> = {
  open: 'Anyone can join',
  request: 'Request to join',
  closed: 'No new members',
};

export default function MemberSettings({ club }: MemberSettingsProps) {
  const api = useTRPC();
  const [policy, setPolicy] = useState(club.membershipPolicy);

  const updatePolicy = useMutation(
    api.club.updateMembershipPolicy.mutationOptions({
      onSuccess: () => {
        setSnackbar({
          message: 'Membership policy updated!',
          type: 'success',
          autoHideDuration: true,
          fitContent: true,
          closeOn: ['timeout', 'escapeKeyDown', 'dismiss'],
        });
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

  const hasChanges = policy !== club.membershipPolicy;

  return (
    <Panel heading="Member Settings">
      <div className="flex flex-col gap-4 ml-2">
        <FormControl className="max-w-xs">
          <InputLabel id="membership-policy-label">
            Membership Policy
          </InputLabel>
          <Select
            labelId="membership-policy-label"
            value={policy}
            label="Membership Policy"
            onChange={(e) =>
              setPolicy(e.target.value as 'open' | 'request' | 'closed')
            }
          >
            {Object.entries(policyLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div>
          <Button
            variant="contained"
            className="normal-case"
            disabled={!hasChanges || updatePolicy.isPending}
            loading={updatePolicy.isPending}
            onClick={() => updatePolicy.mutate({ clubId: club.id, policy })}
          >
            Save
          </Button>
        </div>
      </div>
    </Panel>
  );
}
