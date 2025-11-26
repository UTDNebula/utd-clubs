'use client';

import { useState } from 'react';

export default function EventDeleteButton({
  deleteAction,
}: {
  deleteAction: () => Promise<void>;
}) {
  const [status, setStatus] = useState<'idle' | 'deleted'>('idle');

  async function handleClick() {
    const ok = confirm('Are you sure you want to delete this event?');

    if (!ok) return;

    await deleteAction(); // calls your server action
    setStatus('deleted');
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={handleClick}
        className="bg-blue-primary h-10 w-10 rounded-full p-1 shadow-lg transition-colors hover:bg-blue-700 active:bg-blue-800 text-white text-sm"
      >
        X
      </button>

      {status === 'deleted' && (
        <p className="text-xs text-blue-primary mt-2">Event deleted</p>
      )}
    </div>
  );
}
