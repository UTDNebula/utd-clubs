'use client';

import { Button, Card, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTRPC } from '@src/trpc/react';

export default function TagSwapper() {
  const [oldTag, setOldTag] = useState('');
  const [newTag, setNewTag] = useState('');
  const api = useTRPC();
  const mutate = useMutation(api.club.changeTags.mutationOptions());

  return (
    <Card className="p-5 flex flex-col gap-2">
      <TextField
        value={oldTag}
        label="Old Tag"
        onChange={(e) => {
          setOldTag(e.target.value);
        }}
      />
      <TextField
        value={newTag}
        label="New Tag"
        onChange={(e) => {
          setNewTag(e.target.value);
        }}
      />
      <Button
        variant="contained"
        className="normal-case self-end"
        disabled={mutate.isPending}
        onClick={() => {
          mutate.mutate({ oldTag: oldTag, newTag: newTag });
        }}
      >
        Change Tags
      </Button>
      {mutate.isSuccess && (
        <div className="text-royal mt-2 font-semibold">
          Modified the tags for {mutate.data.affected} clubs.
        </div>
      )}
    </Card>
  );
}
