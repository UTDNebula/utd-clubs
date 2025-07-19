import { useTRPC } from '@src/trpc/react';
import { signOut } from 'next-auth/react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useMutation } from '@tanstack/react-query';

export default function DeleteButton() {
  const api = useTRPC();
  const { mutate } = useMutation(
    api.userMetadata.deleteById.mutationOptions({
      onSuccess: async () => await signOut(),
    }),
  );
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          className="rounded-full bg-red-500 px-4 py-2 text-white transition duration-300 hover:bg-red-700"
        >
          Delete account
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Overlay className="fixed inset-0 bg-black/30" />
      <AlertDialog.Content className="fixed top-1/2 left-1/2 flex h-80 max-h-[85vh] w-[90vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col items-center space-y-8 rounded-3xl bg-white p-12 shadow-sm focus:outline-hidden">
        <AlertDialog.Title className="m-0 text-center text-4xl font-bold">
          Are you sure?
        </AlertDialog.Title>
        <AlertDialog.Description className="text-center text-xl">
          This will clear all your account data and remove it from the platform.
        </AlertDialog.Description>
        <div className="flex items-end justify-center gap-4 pt-5">
          <AlertDialog.Action asChild>
            <button
              type="button"
              className="rounded-full bg-red-500 px-4 py-2 text-white transition duration-300 hover:bg-red-700"
              onClick={() => mutate()}
            >
              Delete
            </button>
          </AlertDialog.Action>
          <AlertDialog.Cancel asChild>
            <button
              type="button"
              className="rounded-full bg-gray-500 px-4 py-2 text-white transition duration-300 hover:bg-gray-700"
            >
              Cancel
            </button>
          </AlertDialog.Cancel>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
