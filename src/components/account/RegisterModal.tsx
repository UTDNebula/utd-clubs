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
  omitClose?: boolean;
  className?: string;
};
const providers = ['google', 'discord'] as const;

const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  onClose,
  omitClose,
  className,
}) => {
  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={
        'flex justify-center items-center h-screen p-4' + ' ' + className
      }
    >
      <div className="flex flex-col items-center z-20 w-fit rounded-lg bg-gray-100 p-4 shadow-lg">
        <div className="flex flex-col h-fit w-full">
          {!omitClose && (
            <div className="sm:absolute self-end">
              <IconButton onClick={onClose} aria-label="close modal">
                <CloseRoundedIcon />
              </IconButton>
            </div>
          )}
          <Typography
            variant="h1"
            className="font-display text-2xl font-bold text-slate-600 grow-1 self-center text-center px-4 mt-1 mb-2"
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
    </Modal>
  );
};

export default RegisterModal;
