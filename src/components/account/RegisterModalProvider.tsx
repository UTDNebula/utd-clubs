'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

export class NoRegisterModalProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoRegisterModalProviderError'; // Set a custom name for the error
  }
}

interface RegisterModalContextInterface {
  inProvider: boolean;
  showRegisterModal: boolean;
  // setShowRegisterModal: (value: boolean) => void;
  setShowRegisterModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RegisterModalContext =
  createContext<RegisterModalContextInterface>({
    inProvider: false,
    showRegisterModal: false,
    setShowRegisterModal: () => {},
  });

export const useRegisterModalContext = () => {
  const context = useContext(RegisterModalContext);
  if (context.inProvider == false) {
    throw new NoRegisterModalProviderError(
      'useRegisterModalContext was not used within a RegisterModalProvider.\n\nYou should catch this error and handle it!\nSincerely, a UTD Clubs dev',
    );
  }
  return context;
};

type RegisterModalProvider = {
  children: ReactNode;
};

export const RegisterModalProvider = ({ children }: RegisterModalProvider) => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <RegisterModalContext.Provider
      value={{ inProvider: true, showRegisterModal, setShowRegisterModal }}
    >
      {children}
    </RegisterModalContext.Provider>
  );
};
