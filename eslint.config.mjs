import { FlatCompat } from '@eslint/eslintrc';
import { globalIgnores } from 'eslint/config';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  globalIgnores(['node_modules', '.next', '.out', 'next-env.d.ts']),
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
