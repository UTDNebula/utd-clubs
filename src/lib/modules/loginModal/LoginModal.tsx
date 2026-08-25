'use client';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import Modal, { ModalProps } from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { setSnackbar, SnackbarPresets } from '@/lib/modules/snackbar';
import { authClient } from '@/lib/utils/auth-client';
import LoginProviderButton from './LoginProviderButton';
import { LoginProviders } from './types';

const loginProviders = [
  'google',
  'discord',
] as const satisfies LoginProviders[];

type LoginModalProps = Omit<ModalProps, 'children'> & {
  open: boolean;
  onClose?: () => void;
  closeButton?: boolean;
  className?: string;
  callbackURL?: string;
};

export const LoginModalContents = ({
  className,
  onClose,
  closeButton,
  callbackURL,
}: Pick<
  LoginModalProps,
  'className' | 'onClose' | 'closeButton' | 'callbackURL'
>) => {
  const handleSignIn = () => {
    void authClient.signIn.social(
      {
        provider: 'microsoft',
        callbackURL: callbackURL ?? window.location.href,
        newUserCallbackURL: '/get-started',
      },
      {
        onError: (ctx) => {
          setSnackbar(SnackbarPresets.errorWithMessage(ctx.error.message));
        },
      },
    );
  };

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
          className="font-display mt-1 mb-2 grow-1 self-center text-center text-2xl font-bold text-balance text-neutral-700 dark:text-neutral-300"
        >
          Sign in or sign up
        </Typography>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3 p-4 sm:flex-row">
        {loginProviders.map((loginProvider) => (
          <LoginProviderButton
            key={loginProvider}
            provider={loginProvider}
            callbackURL={callbackURL}
          />
        ))}
      </div>
      <Typography
        variant="body1"
        className="mt-1 mb-2 grow-1 self-center px-4 text-center text-neutral-600 dark:text-neutral-400"
      >
        Are you UTD Faculty/Staff?{' '}
        <Link
          href="#"
          className="font-bold whitespace-nowrap text-slate-600 underline underline-offset-2 dark:text-slate-400"
          onClick={() => {
            handleSignIn();
          }}
        >
          Sign In Here
        </Link>
      </Typography>
    </div>
  );
};

const LoginModal = ({
  open,
  onClose,
  closeButton,
  className,
  callbackURL,
  ...props
}: LoginModalProps) => {
  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={`flex h-screen items-center justify-center p-4 ${className}`}
      {...props}
    >
      {/* This span is required to receive the tabIndex prop, which will let the user quickly navigate the modal using the keyboard */}
      <span>
        <LoginModalContents
          onClose={onClose}
          closeButton={closeButton ?? true}
          callbackURL={callbackURL}
        />
      </span>
    </Modal>
  );
};

export default LoginModal;
