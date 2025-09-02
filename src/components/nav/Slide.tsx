'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { CloseIcon } from '@src/icons/Icons';
import NavMenu from './NavMenu';
import { type personalCats } from '@src/constants/categories';
const NewSidebar = ({
  userCapabilities,
  hamburger,
}: {
  userCapabilities: Array<(typeof personalCats)[number]>;
  hamburger: 'white' | 'black';
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-black-500 pointer-events-auto px-3 py-1">
          <svg
            className={`h-7 w-7 fill-${hamburger}`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left fixed inset-y-0 left-0 z-50 h-full w-3/4 gap-4 border-r bg-slate-100 py-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 sm:max-w-sm">
          <VisuallyHidden>
            <Dialog.Title>Navigation</Dialog.Title>
          </VisuallyHidden>
          <NavMenu userCapabilites={userCapabilities} />
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4">
              <CloseIcon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default NewSidebar;
