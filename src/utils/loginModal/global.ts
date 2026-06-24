import { useEffect } from 'react';
import {
  closeLoginModalFn,
  LoginModalFunctions,
  openLoginModalFn,
} from './types';

const globalLoginModalFunctionsDefault = () => {
  console.warn('Global login modal functions not initialized');
};

const globalLoginModalFunctionsUnmounted = () => {
  console.warn('Login modal provider unmounted');
};

/**
 * Mutable global login modal functions
 */
export const globalLoginModalFunctions: LoginModalFunctions = {
  openLoginModal: globalLoginModalFunctionsDefault,
  closeLoginModal: globalLoginModalFunctionsDefault,
};

export const openLoginModal: openLoginModalFn = (...args) =>
  globalLoginModalFunctions.openLoginModal(...args);

export const closeLoginModal: closeLoginModalFn = (...args) =>
  globalLoginModalFunctions.closeLoginModal(...args);

/**
 * Internal hook to attach the login modal provider's functions to the global exported functions.
 */
export function useAttachGlobalLoginModalFunctions(
  functions: LoginModalFunctions,
) {
  useEffect(() => {
    globalLoginModalFunctions.openLoginModal = functions.openLoginModal;
    globalLoginModalFunctions.closeLoginModal = functions.closeLoginModal;

    return () => {
      globalLoginModalFunctions.openLoginModal =
        globalLoginModalFunctionsUnmounted;
      globalLoginModalFunctions.closeLoginModal =
        globalLoginModalFunctionsUnmounted;
    };
  });
}
