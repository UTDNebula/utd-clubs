'use client';

import { ReactNode, useState } from 'react';
import LoginModal from './LoginModal';
import { LoginModalContext } from './context';

type LoginModalProviderProps = {
  children: ReactNode;
};

/**
 * Wrapper component that provides context for {@link LoginModalContext} and adds a {@link LoginModal} component.
 */
export const LoginModalProvider = ({ children }: LoginModalProviderProps) => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <LoginModalContext.Provider
      value={{ inProvider: true, showLoginModal, setShowLoginModal }}
    >
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      {children}
    </LoginModalContext.Provider>
  );
};
