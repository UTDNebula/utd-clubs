'use client';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import Modal, { ModalProps } from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react';
import ProviderButton from '@src/app/auth/ProviderButtons';
import { authClient } from '@src/utils/auth-client';

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
      className={`z-20 flex w-fit flex-col items-center rounded-lg bg-white p-4 shadow-lg dark:bg-neutral-800 dark:shadow-xl ${className}`}
    >
      <div className="flex h-fit w-full flex-col">
        {closeButton && (
          <div className="self-end sm:absolute">
            <IconButton onClick={onClose} aria-label="close modal">
              <CloseRoundedIcon />
            </IconButton>
          </div>
        )}
        <Typography
          variant="h1"
          className="font-display mt-1 mb-2 grow-1 self-center px-4 text-center text-2xl font-bold text-slate-600 dark:text-slate-400"
        >
          Sign In / Sign Up
        </Typography>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3 p-4 sm:flex-row">
        {providers.map((provider) => (
          <ProviderButton key={provider} provider={provider} />
        ))}
      </div>
      <Typography
        variant="body1"
        className="font-display mt-1 mb-2 grow-1 self-center px-4 text-center text-slate-600 dark:text-slate-400"
      >
        Are you UTD Faculty/Staff?{' '}
        <Link
          href="#"
          className="font-bold"
          onClick={() => {
            void authClient.signIn.social({
              provider: 'microsoft',
              callbackURL: window.location.href,
              newUserCallbackURL: '/get-started',
            });
          }}
        >
          Sign In Here
        </Link>
      </Typography>
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
      className={`flex h-screen items-center justify-center p-4 ${className}`}
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
