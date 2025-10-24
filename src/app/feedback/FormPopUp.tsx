import * as Dialog from '@radix-ui/react-dialog';
import { CheckIcon, CloseIcon } from '@src/icons/Icons';
import React from 'react';

type formPopUpProps = {
  onClose: () => void;
  isOpen: boolean;
};

const FormPopUp: React.FC<formPopUpProps> = ({ onClose, isOpen }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-20 bg-black/50" />
        <Dialog.Content className="fixed inset-0 z-20 h-1/3 w-1/2 max-w-(--breakpoint-sm) transform self-center justify-self-center rounded-md bg-white p-10 text-center shadow-lg">
          <Dialog.Title className="mt-4 border-b-2 border-slate-200 pb-4 text-center font-bold text-slate-700 md:text-4xl">
            Form Submitted
          </Dialog.Title>

          <Dialog.Description className="mt-8 md:mt-16 md:font-semibold">
            Thank you for your feedback!
          </Dialog.Description>

          <Dialog.Close
            className="absolute top-0 right-0 z-50 m-2"
            onClick={onClose}
          >
            <CloseIcon />
          </Dialog.Close>

          <div className="absolute inset-0 flex justify-center">
            <div className="absolute -top-16 flex h-24 w-24 transform items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
              <div>
                <CheckIcon fill="white" />
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FormPopUp;
