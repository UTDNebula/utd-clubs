'use client';
import { api } from '@src/trpc/react';
import { useState } from 'react';

export default function TagSwapper() {
  const [oldTag, setOldTag] = useState('');
  const [newTag, setNewTag] = useState('');
  const mutate = api.club.changeTags.useMutation();
  return (
    <div className="rounded-lg bg-white p-5">
      <div>
        <label htmlFor="oldTag">
          <h2 className="text-lg font-bold">Old tag</h2>
        </label>
        <input
          type="text"
          value={oldTag}
          id="oldTag"
          className="rounded-lg border-2 border-black p-1"
          onChange={(e) => {
            setOldTag(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="newTag">
          <h2 className="text-lg font-bold">New tag</h2>
        </label>
        <input
          type="text"
          value={newTag}
          id="newTag"
          className="rounded-lg border-2 border-black p-1"
          onChange={(e) => {
            setNewTag(e.target.value);
          }}
        />
      </div>
      <div className="mt-2 flex w-full">
        <button
          className="ml-auto rounded-lg bg-blue-primary p-2 text-lg font-bold text-white disabled:opacity-50"
          disabled={mutate.isPending}
          onClick={() => {
            mutate.mutate({ oldTag: oldTag, newTag: newTag });
          }}
        >
          change tags
        </button>
      </div>
      {mutate.isSuccess && (
        <div className="mt-2 font-semibold text-blue-primary">
          Modified the tags for {mutate.data.affected} clubs
        </div>
      )}
    </div>
  );
}
