'use client';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AuthIcons from '@src/utils/LoginModal/icons';
import { authClient } from '@src/utils/auth-client';
import { LoginProviders } from './types';

const loginProviderNames = {
  google: 'Google',
  discord: 'Discord',
} as const satisfies Record<LoginProviders, string>;

export type LoginProviderButtonProps = {
  provider: LoginProviders;
  callbackUrl?: string;
};

export default function LoginProviderButton({
  provider,
  callbackUrl,
}: LoginProviderButtonProps) {
  return (
    <Button
      variant="contained"
      size="large"
      onClick={() => {
        void authClient.signIn.social({
          provider: provider,
          callbackURL: callbackUrl ?? window.location.href,
          newUserCallbackURL: '/get-started',
        });
      }}
      className="min-w-max bg-white whitespace-nowrap normal-case hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-600"
      startIcon={AuthIcons[provider]}
    >
      <Typography
        className={`text-base font-extrabold text-slate-800 md:text-xs dark:text-slate-200`}
      >
        <span className="min-w-fit">
          Sign in with {loginProviderNames[provider]}
        </span>
      </Typography>
    </Button>
  );
}
