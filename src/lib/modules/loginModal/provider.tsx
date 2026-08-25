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
  const [explanationText, setExplanationText] = useState<string | undefined>(
    undefined,
  );

  const openLoginModal: openLoginModalFn = (options) => {
    setOpen(true);
    if (options) {
      const { callbackURL, onClose, explanationText } = options;
      if (callbackURL) setCallbackURL(callbackURL);
      if (onClose) setOnClose(() => onClose); // Function must be nested to avoid React confusion with setState
      if (explanationText) setExplanationText(explanationText);
    }
  };

  const closeLoginModal: closeLoginModalFn = () => {
    setOpen(false);
    onClose?.();
    setCallbackURL(undefined);
    setOnClose(undefined);
    setExplanationText(undefined);
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
        explanationText={explanationText}
      />
    </LoginModalContext.Provider>
  );
};
