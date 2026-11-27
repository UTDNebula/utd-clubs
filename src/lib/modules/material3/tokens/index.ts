import type Material3CompTokens from './comp';
import type Material3RefTokens from './ref';
import type Material3SysTokens from './sys';

export { Material3RefTokens, Material3SysTokens, Material3CompTokens };

export interface Material3TokenClasses {
  ref: Material3RefTokens;
  sys: Material3SysTokens;
  comp: Material3CompTokens;
}

export interface Material3Tokens {
  md: Material3TokenClasses;
}
