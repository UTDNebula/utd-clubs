'use client';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import Modal, { ModalProps } from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import React from 'react';
import ProviderButton from '@src/app/auth/ProviderButtons';

type RegisterModalProps = Omit<ModalProps, 'children'> & {
  open: boolean;
  onClose?: () => void;
  closeButton?: boolean;
  className?: string;
};

const providers = ['google', 'discord'] as const;

export const RegisterModalContents = ({
  className,
  onClose,
  closeButton,
}: Pick<RegisterModalProps, 'className' | 'onClose' | 'closeButton'>) => {
  return (
    <div
      className={`flex flex-col items-center z-20 w-fit rounded-lg bg-neutral-100 dark:bg-neutral-900 p-4 shadow-lg dark:shadow-xl ${className}`}
    >
      <div className="flex flex-col h-fit w-full">
        {closeButton && (
          <div className="sm:absolute self-end">
            <IconButton onClick={onClose} aria-label="close modal">
              <CloseRoundedIcon />
            </IconButton>
          </div>
        )}
        <Typography
          variant="h1"
          className="font-display text-2xl font-bold text-slate-600 dark:text-slate-400 grow-1 self-center text-center px-4 mt-1 mb-2"
        >
          Sign In / Sign Up
        </Typography>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row p-4">
        {providers.map((provider) => (
          <ProviderButton key={provider} provider={provider} />
        ))}
      </div>
    </div>
  );
};

const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  onClose,
  closeButton,
  className,
}) => {
  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={`flex justify-center items-center h-screen p-4 ${className}`}
    >
      {/* This span is required to receive the tabIndex prop, which will let the user quickly navigate the modal using the keyboard */}
      <span>
        <RegisterModalContents
          onClose={onClose}
          closeButton={closeButton ?? true}
        />
      </span>
    </Modal>
  );
};

export default RegisterModal;
