'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Confirmation from '@src/components/Confirmation';
import { authClient } from '@src/utils/auth-client';

export default function DeleteButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        className="normal-case"
        onClick={() => setOpen(true)}
      >
        Delete Account
      </Button>
      <Confirmation
        open={open}
        onClose={() => setOpen(false)}
        contentText={
          <>
            This will permenantly delete your account. <br />
            All your account data will be cleared and removed from the platform.
          </>
        }
        onConfirm={async () => {
          await authClient.deleteUser();
          router.push('/');
        }}
      />
    </>
  );
}
