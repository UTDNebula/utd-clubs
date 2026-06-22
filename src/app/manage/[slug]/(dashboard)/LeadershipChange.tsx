'use client';

import CheckIcon from '@mui/icons-material/Check';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import { Button, Collapse } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { setSnackbar, SnackbarPresets } from 'src/utils/snackbar';
import Panel from '@src/components/common/Panel';
import Confirmation from '@src/components/Confirmation';
import { useTRPC } from '@src/trpc/react';

const LeadershipChange = ({ clubId }: { clubId: string }) => {
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  const api = useTRPC();
  const setUpdatedAt = useMutation(
    api.club.edit.setUpdatedAt.mutationOptions({
      onSuccess: () => {
        setSnackbar(SnackbarPresets.saved);
        setOpenConfirmation(false);
        setShowPanel(false);
      },
      onError: (error) => {
        setSnackbar(SnackbarPresets.saveFailedWithMessage(error.message));
      },
    }),
  );

  return (
    <>
      <Collapse in={showPanel}>
        <Panel
          className="border border-red-500 bg-red-100 dark:border-red-700 dark:bg-red-950"
          startAdornment={<GppMaybeIcon />}
          heading="Update your collaborators for next semester."
        >
          <div className="flex flex-col gap-4 px-2">
            <p>
              If your organization has had a change in leadership, have your
              successors create an account on UTD Clubs, then add them as admins
              or collaborators{' '}
              <a
                href="#collaborators"
                className="text-royal dark:text-cornflower-300 underline"
              >
                near the bottom of the page
              </a>
              .
            </p>
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="contained"
                className="normal-case"
                startIcon={<CheckIcon />}
                size="large"
                onClick={() => setOpenConfirmation(true)}
              >
                I have added my organization&apos;s new leadership to manage
                this listing
              </Button>
              <Button
                variant="contained"
                className="normal-case"
                startIcon={<CheckIcon />}
                size="large"
                onClick={() => setOpenConfirmation(true)}
              >
                My organization has no leadership changes
              </Button>
            </div>
          </div>
        </Panel>
      </Collapse>
      <Confirmation
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        title="Confirm Collaborators are up to date"
        contentText={
          <>
            Confirm you&apos;ve added everybody in your organization who needs
            access to UTD Clubs next semester.
            <br />
            <br />
            You will not be emailed or reminded to do this again until the end
            of next semester.
          </>
        }
        confirmText="Confirm"
        confirmColor="primary"
        onConfirm={() => setUpdatedAt.mutate({ id: clubId })}
        loading={setUpdatedAt.isPending}
      />
    </>
  );
};

export default LeadershipChange;
