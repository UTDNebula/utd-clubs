'use client';
import { AccountIcon } from '@src/icons/Icons';
import { signIn } from 'next-auth/react';

export default function SignInButton() {
  return (
    <button
      onClick={() => {
        void signIn();
      }}
      className="rounded-full bg-white p-2.5 shadow-md drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]"
    >
      <AccountIcon />
    </button>
  );
}
