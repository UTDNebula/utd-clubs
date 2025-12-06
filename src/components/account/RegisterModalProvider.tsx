'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';
import RegisterModal from './RegisterModal';

/**
 * Catchable error for when {@linkcode useRegisterModalContext()} isn't used in a child component of a {@link RegisterModalProvider \<RegisterModalProvider\>}.
 */
export class NoRegisterModalProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoRegisterModalProviderError';
  }
}

interface RegisterModalContextInterface {
  inProvider: boolean;
  showRegisterModal: boolean;
  setShowRegisterModal: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Context for displaying the Register Modal
 */
export const RegisterModalContext =
  createContext<RegisterModalContextInterface>({
    inProvider: false,
    showRegisterModal: false,
    setShowRegisterModal: () => {},
  });

/**
 * Wrapper function for `useContext(RegisterModalContext)` that safely throws a {@linkcode NoRegisterModalProviderError} if it is used outside of a {@link RegisterModalProvider \<RegisterModalProvider\>}.
 */
export function useRegisterModalContext() {
  const context = useContext(RegisterModalContext);
  if (context.inProvider == false) {
    throw new NoRegisterModalProviderError(
      'useRegisterModalContext was not used within a RegisterModalProvider.\n\nYou should catch this error and handle it!\nSincerely, a UTD Clubs dev',
    );
  }
  return context;
}

type RegisterModalProviderProps = {
  children: ReactNode;
};

/**
 * Wrapper component that provides context for {@link RegisterModalContext} and adds a {@link RegisterModal} component.
 */
export const RegisterModalProvider = ({
  children,
}: RegisterModalProviderProps) => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <RegisterModalContext.Provider
      value={{ inProvider: true, showRegisterModal, setShowRegisterModal }}
    >
      <RegisterModal
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
      {children}
    </RegisterModalContext.Provider>
  );
};
