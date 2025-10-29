'use client';

import React, { useEffect, useState } from "react";
import { LeftArrowIcon } from "src/icons/Icons";
import ProviderButton from "@src/app/auth/ProviderButtons";
import { getProviders, type ClientSafeProvider } from "next-auth/react";

type RegisterModalProps = {
  open: boolean;
  onClose: () => void;
};

const RegisterModal: React.FC<RegisterModalProps> = ({ open, onClose }) => {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  useEffect(() => {
    async function loadProviders() {
      const prov = await getProviders();
      setProviders(prov ?? null);
    }
    void loadProviders();
  }, []);

  if (!open) return null;

  return (
    <main className="fixed inset-0 z-50">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* centered dialog */}
      <div className="relative inset-0 flex items-center justify-center min-h-screen p-4">
        <div className="relative z-20 w-full max-w-xl rounded-lg bg-[#f5f5f5] p-6 shadow-lg">
          {/* back button (overrides default behavior by calling onClose) */}
          <div className="absolute left-4 top-4">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded px-2 py-1 text-sm font-medium text-slate-600 hover:text-slate-800 z-30"
              aria-label="Back"
              type="button">
              <LeftArrowIcon fill="fill-[#4D5E80]" />
            </button>
          </div>

          {/* <div className="flex flex-col items-start gap-6 pl-12 sm:pl-16"> */}
          <div className="flex flex-col items-center gap-6">
            <h1
              className="text-left text-2xl font-bold font-[Roboto,Arial,sans-serif] text-[#4D5E80]">
              Sign In / Sign Up
            </h1>

            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
              {Object.values(providers ?? {}).map((provider: ClientSafeProvider) => (
                <ProviderButton key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterModal;
