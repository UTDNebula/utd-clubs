import { createContext, useContext } from 'react';

/**
 * Catchable error for when {@linkcode useLoginModalContext()} isn't used in a child component of a {@linkcode LoginModalProvider}.
 */
export class NoLoginModalProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoLoginModalProviderError';
  }
}

export interface LoginModalContextType {
  inProvider: boolean;
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginModalContextDefault: LoginModalContextType = {
  inProvider: false,
  showLoginModal: false,
  setShowLoginModal: () => {
    console.warn('Login modal context not initialized');
  },
};

export const LoginModalContext = createContext<LoginModalContextType>(
  LoginModalContextDefault,
);

/**
 * Wrapper function for `useContext(LoginModalContext)` that safely throws a {@linkcode NoLoginModalProviderError} if it is used outside of a {@linkcode LoginModalProvider}.
 */
export function useLoginModalContext() {
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
 * If not used in a {@linkcode LoginModalProvider}, will run the callback function in {@linkcode onError}.
 */
export function useLoginModal(
  onError?: (e?: NoLoginModalProviderError) => void,
) {
  try {
    const context = useLoginModalContext();
    return context;
  } catch (e) {
    if (e instanceof NoLoginModalProviderError) {
      if (onError) {
        onError(e);
      }
    } else {
      throw e;
    }
  }
  return LoginModalContextDefault;
}
