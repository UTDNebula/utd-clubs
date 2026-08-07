/**
 * @file Provides a modal that prompts the user to sign in or sign up
 *
 * To use, call {@linkcode openLoginModal} from any component that is a child of {@linkcode LoginModalProvider}
 *
 * @example <caption>Basic usage (using hook)</caption>
 * const { openLoginModal } = useLoginModal();
 * openLoginModal();
 *
 * @example <caption>Using global function</caption>
 * openLoginModal();
 */

export { useLoginModal } from './context';
export { default as LoginModal, LoginModalContents } from './LoginModal';
export { LoginModalProvider } from './provider';
export { openLoginModal, closeLoginModal } from './global';
export { NoLoginModalProviderError } from './types';
export { default as LoginProviderIcons } from './icons';
