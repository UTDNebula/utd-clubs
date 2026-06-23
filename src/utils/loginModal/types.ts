/**
 * Catchable error for when {@linkcode useLoginModalContext()} isn't used in a child component of a {@linkcode LoginModalProvider}.
 */
export class NoLoginModalProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoLoginModalProviderError';
  }
}

export type useLoginModalOptions = {
  onNoProvider?: (e?: NoLoginModalProviderError) => void;
};

export type LoginProviders = 'google' | 'discord';

export type openLoginModalOptions = {
  /**
   * URL to navigate to after logging in
   */
  callbackURL?: string;
  /**
   * Callback for when login modal is closed
   */
  onClose?: () => void;
};

export type openLoginModalFn = (options?: openLoginModalOptions) => void;

export type closeLoginModalFn = () => void;
