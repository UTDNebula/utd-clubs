'use client';

import { ReactNode, useState } from 'react';
import { LoginModalContext } from './context';
import { useAttachGlobalLoginModalFunctions } from './global';
import LoginModal from './LoginModal';
import { closeLoginModalFn, openLoginModalFn } from './types';

type LoginModalProviderProps = {
  children: ReactNode;
};

/**
 * Wrapper component that provides context for {@link LoginModalContext} and adds a {@link LoginModal} component.
 */
export const LoginModalProvider = ({ children }: LoginModalProviderProps) => {
  const [open, setOpen] = useState(false);
  const [callbackURL, setCallbackURL] = useState<string | undefined>(undefined);
  const [onClose, setOnClose] = useState<() => void>();

  const openLoginModal: openLoginModalFn = (options) => {
    setOpen(true);
    if (options) {
      const { callbackURL, onClose } = options;
      if (callbackURL) setCallbackURL(callbackURL);
      if (onClose) setOnClose(() => onClose); // Function must be nested to avoid React confusion with setState
    }
  };

  const closeLoginModal: closeLoginModalFn = () => {
    setOpen(false);
    onClose?.();
    setCallbackURL(undefined);
    setOnClose(undefined);
  };

  useAttachGlobalLoginModalFunctions({ openLoginModal, closeLoginModal });

  return (
    <LoginModalContext.Provider
      value={{ inProvider: true, open, openLoginModal, closeLoginModal }}
    >
      {children}
      <LoginModal
        open={open}
        onClose={closeLoginModal}
        callbackURL={callbackURL}
      />
    </LoginModalContext.Provider>
  );
};
