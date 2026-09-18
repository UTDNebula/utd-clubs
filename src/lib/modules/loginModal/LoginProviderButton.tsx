'use client';

import Button from '@mui/material/Button';
import { setSnackbar, SnackbarPresets } from '@/lib/modules/snackbar';
import { authClient } from '@/lib/utils/auth-client';
import LoginProviderIcons from './icons';
import { LoginProviders } from './types';
import Tooltip from '@mui/material/Tooltip';

const loginProviderNames = {
  google: 'Google',
  discord: 'Discord',
} as const satisfies Record<LoginProviders, string>;

export type LoginProviderButtonProps = {
  provider: LoginProviders;
  callbackURL?: string;
  disabled?: boolean;
};

export default function LoginProviderButton({
  provider,
  callbackURL,
  disabled,
}: LoginProviderButtonProps) {
  return (
    <Tooltip
      title={
        <>
          {`${loginProviderNames[provider]} oAuth is unavailable`}
          <br />
          Missing environment variables?
        </>
      }
      disableFocusListener={!disabled}
      disableHoverListener={!disabled}
      disableTouchListener={!disabled}
      disableInteractive
    >
      {/* This span is required to ensure tooltip shows when the button is disabled */}
      <span>
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
                  setSnackbar(
                    SnackbarPresets.errorWithMessage(ctx.error.message),
                  );
                },
              },
            );
          }}
          className={`min-w-max bg-white pr-5 pl-3 whitespace-nowrap text-slate-800 normal-case outline-1 outline-transparent transition-colors ${disabled ? 'duration-150' : 'duration-500'} not-active:outline-neutral-300 hover:bg-neutral-100 disabled:bg-neutral-200 disabled:text-neutral-600 disabled:outline-0 dark:bg-neutral-700 dark:text-slate-200 dark:not-active:outline-neutral-600 dark:hover:bg-neutral-600 dark:disabled:bg-neutral-900 dark:disabled:text-neutral-400`}
          startIcon={
            <span className="scale-125">{LoginProviderIcons[provider]}</span>
          }
          disabled={disabled}
        >
          Continue with {loginProviderNames[provider]}
        </Button>
      </span>
    </Tooltip>
  );
}
