'use client';
import { api } from '@src/trpc/react';
import { useState } from 'react';

export default function TagSwapper() {
  const [oldTag, setOldTag] = useState('');
  const [newTag, setNewTag] = useState('');
  const mutate = api.club.changeTags.useMutation();
  return (
    <div>
      <div>
        <h2>Old tag</h2>
        <input
          type="text"
          value={oldTag}
          onChange={(e) => {
            setOldTag(e.target.value);
          }}
        />
      </div>
      <div>
        <h2>New tag</h2>
        <input
          type="text"
          value={newTag}
          onChange={(e) => {
            setNewTag(e.target.value);
          }}
        />
      </div>
      <button
        onClick={() => {
          mutate.mutate({ oldTag: oldTag, newTag: newTag });
        }}
      >
        change tags
      </button>
    </div>
  );
}
