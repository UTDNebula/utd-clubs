'use client';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AuthIcons from '@src/icons/AuthIcons';
import { authClient } from '@src/utils/auth-client';

const providerNames = {
  google: 'Google',
  discord: 'Discord',
} as const;

const ProviderButton = ({
  provider,
  callbackUrl,
}: {
  provider: 'google' | 'discord';
  callbackUrl?: string;
}) => (
  <Button
    variant="contained"
    size="large"
    onClick={() => {
      void authClient.signIn.social({
        provider: provider,
        callbackURL: callbackUrl ?? window.location.href,
      });
    }}
    className="bg-white dark:bg-haiti normal-case whitespace-nowrap min-w-max"
    startIcon={AuthIcons[provider]}
  >
    <Typography
      className={`text-base font-extrabold md:text-xs text-slate-800 dark:text-slate-200`}
    >
      <span className="min-w-fit">Sign in with {providerNames[provider]}</span>
    </Typography>
  </Button>
);

export default ProviderButton;
