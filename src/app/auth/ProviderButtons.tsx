'use client';

import { type FC } from 'react';
import AuthIcons from '@src/icons/AuthIcons';
import { authClient } from '@src/utils/auth-client';

const colors: Record<string, string> = {
  Google: 'text-red-500',
  Discord: 'text-blue-700',
};

const providerNames = {
  google: 'Google',
  discord: 'Discord',
} as const;

const ProviderButton: FC<{
  provider: 'google' | 'discord';
  callbackUrl?: string;
}> = ({ provider, callbackUrl }) => (
  <button
    type="button"
    onClick={() => {
      void authClient.signIn.social({
        provider: provider,
        callbackURL: callbackUrl,
      });
    }}
    className="box-content flex w-min flex-row items-center space-x-4 rounded-3xl bg-white py-2.5 pr-6 pl-5 shadow-xs shadow-slate-700 md:w-fit"
  >
    <div>{AuthIcons[provider]}</div>
    <h2
      className={`text-base font-extrabold md:text-xs ${colors[providerNames[provider]]}`}
    >
      {providerNames[provider]}
    </h2>
  </button>
);

export default ProviderButton;
