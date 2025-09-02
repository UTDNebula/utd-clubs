'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { type SelectClub } from '@src/server/db/models';

type Props = {
  club: SelectClub;
};
export default function ClubDescription({ club }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md bg-slate-300 px-3 py-2 font-medium text-blue-500 transition-colors hover:bg-slate-400 hover:text-blue-700 focus:ring-3 focus:ring-blue-300 focus:outline-hidden">
        View Details
      </Dialog.Trigger>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
      <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-xl">
        <Dialog.Title className="mb-4 text-xl font-semibold text-gray-800">
          {club.name}
        </Dialog.Title>
        <Dialog.Description className="mb-4 max-h-96 overflow-y-auto text-sm text-gray-600">
          {club.description.split('\n').map((line, i) => (
            <p key={i} className="mb-2">
              {line}
            </p>
          ))}
        </Dialog.Description>
        <div className="mb-4 flex max-h-[70vh] flex-wrap gap-2 overflow-scroll">
          <span className="font-medium text-gray-700">Tags:</span>
          {club.tags.map((tag) => (
            <div
              key={tag}
              className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700"
            >
              {tag}
            </div>
          ))}
        </div>
        <Dialog.Close className="rounded-md bg-blue-500 px-4 py-2 text-center text-white transition-colors hover:bg-blue-600 focus:ring-3 focus:ring-blue-300 focus:outline-hidden">
          Close
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
}
