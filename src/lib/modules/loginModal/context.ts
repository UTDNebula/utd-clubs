'use client';

import { createContext, useContext } from 'react';
import {
  closeLoginModalFn,
  NoLoginModalProviderError,
  openLoginModalFn,
  useLoginModalOptions,
} from './types';

export interface LoginModalContextType {
  inProvider: boolean;
  open: boolean;
  openLoginModal: openLoginModalFn;
  closeLoginModal: closeLoginModalFn;
}

const LoginModalContextFunctionsDefault = () => {
  console.warn('Login modal context not initialized');
};

export const LoginModalContextDefault: LoginModalContextType = {
  inProvider: false,
  open: false,
  openLoginModal: LoginModalContextFunctionsDefault,
  closeLoginModal: LoginModalContextFunctionsDefault,
};

export const LoginModalContext = createContext<LoginModalContextType>(
  LoginModalContextDefault,
);

/**
 * Wrapper function for `useContext(LoginModalContext)` that throws a {@linkcode NoLoginModalProviderError} if it is used outside of a {@linkcode LoginModalProvider}.
 */
export function useLoginModalContext(): LoginModalContextType {
  const context = useContext(LoginModalContext);
  if (context.inProvider == false) {
    throw new NoLoginModalProviderError(
      'useLoginModalContext was not used within a LoginModalProvider',
    );
  }
  return context;
}

/**
 * Hook that grants access to the login modal system.
 *
 * If not used in a {@linkcode LoginModalProvider}, will run the callback function in {@linkcode useLoginModalOptions.onNoProvider | onNoProvider}.
 */
export function useLoginModal(
  options?: useLoginModalOptions,
): LoginModalContextType {
  try {
    return useLoginModalContext();
  } catch (e) {
    if (e instanceof NoLoginModalProviderError) {
      options?.onNoProvider?.(e);
    } else {
      throw e;
    }
  }
  return LoginModalContextDefault;
}
