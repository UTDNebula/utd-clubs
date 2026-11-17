import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    globals: true,
    typecheck: {
      enabled: true,
      tsconfig: './tsconfig.test.json',
    },
    exclude: ['node_modules', 'src/nebula-library'],
  },
});
