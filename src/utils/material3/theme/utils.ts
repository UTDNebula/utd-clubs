import { Material3RefPaletteTokens } from '../tokens/ref';

/**
 * Helper function to create Material 3 reference palette tokens.
 */
export const createPalette = <
  TParentPalette extends Material3RefPaletteTokens | undefined = undefined,
>(
  /** Object of reference palette tokens. */
  palette: TParentPalette extends Material3RefPaletteTokens
    ? Partial<Material3RefPaletteTokens>
    : Material3RefPaletteTokens,
  /** Pre-filled palette to extend, if you don't wish to provide values for every token. */
  parentPalette?: TParentPalette,
): Material3RefPaletteTokens => {
  if (parentPalette) {
    return { ...parentPalette, ...palette };
  } else {
    // ParentPalette is undefined, so palette is not partial
    return palette as Material3RefPaletteTokens;
  }
};
