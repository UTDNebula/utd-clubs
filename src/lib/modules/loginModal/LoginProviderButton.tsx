'use client';

import Button from '@mui/material/Button';
import { authClient } from '@/lib/utils/auth-client';
import { setSnackbar, SnackbarPresets } from '@/lib/modules/snackbar';
import LoginProviderIcons from './icons';
import { LoginProviders } from './types';

const loginProviderNames = {
  google: 'Google',
  discord: 'Discord',
} as const satisfies Record<LoginProviders, string>;

export type LoginProviderButtonProps = {
  provider: LoginProviders;
  callbackURL?: string;
};

export default function LoginProviderButton({
  provider,
  callbackURL,
}: LoginProviderButtonProps) {
  return (
    <Button
      variant="contained"
      size="large"
      onClick={() => {
        void authClient.signIn.social(
          {
            provider: provider,
            callbackURL: callbackURL ?? window.location.href,
            newUserCallbackURL: '/get-started',
          },
          {
            onError: (ctx) => {
              setSnackbar(SnackbarPresets.errorWithMessage(ctx.error.message));
            },
          },
        );
      }}
      className="min-w-max bg-white pr-5 pl-3 whitespace-nowrap text-slate-800 normal-case outline-1 outline-transparent transition-[outline-color] duration-500 not-active:outline-neutral-300 hover:bg-neutral-100 dark:bg-neutral-700 dark:text-slate-200 dark:not-active:outline-neutral-600 dark:hover:bg-neutral-600"
      startIcon={
        <span className="scale-125">{LoginProviderIcons[provider]}</span>
      }
    >
      Continue with {loginProviderNames[provider]}
    </Button>
  );
}
