'use client';

import SaveIcon from '@mui/icons-material/Save';
import { Alert, Button, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import FormFieldSet from '@src/components/form/FormFieldSet';
import { useTRPC } from '@src/trpc/react';

export default function TagSwapper() {
  const [oldTag, setOldTag] = useState('');
  const [newTag, setNewTag] = useState('');
  const api = useTRPC();
  const changeTags = useMutation(api.club.changeTags.mutationOptions());

  return (
    <FormFieldSet legend="Rename Tag" className="w-2xl">
      <div className="m-2 flex flex-col gap-4">
        <TextField
          value={oldTag}
          label="Existing Tag"
          size="small"
          onChange={(e) => {
            setOldTag(e.target.value);
          }}
        />
        <TextField
          value={newTag}
          label="New Tag"
          size="small"
          onChange={(e) => {
            setNewTag(e.target.value);
          }}
        />
      </div>
      <Button
        variant="contained"
        className="normal-case self-end"
        startIcon={<SaveIcon />}
        disabled={oldTag === '' || newTag === ''}
        loading={changeTags.isPending}
        loadingPosition="start"
        onClick={() => {
          changeTags.mutate({ oldTag: oldTag, newTag: newTag });
        }}
      >
        Change Tags
      </Button>
      {changeTags.isSuccess && (
        <Alert severity="success">
          Modified the tags for {changeTags.data.affected} clubs.
        </Alert>
      )}
    </FormFieldSet>
  );
}
