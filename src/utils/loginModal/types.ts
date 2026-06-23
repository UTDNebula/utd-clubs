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
