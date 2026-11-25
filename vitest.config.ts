import path from 'path';
import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';

dotenv.config();

function fromHere(...paths: string[]) {
  return path.resolve(import.meta.dirname, ...paths);
}

export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: fromHere('./src') },
      {
        find: '@nebula-library',
        replacement: fromHere('./src/nebula-library'),
      },
    ],
  },
  test: {
    globals: true,
    setupFiles: ['./tests/helpers/mocks/db.ts'],
    typecheck: {
      enabled: true,
      tsconfig: './tsconfig.test.json',
    },
    exclude: ['node_modules', 'src/nebula-library'],
    server: {
      deps: {
        inline: [/@nebula-library/],
        external: [/node_modules/],
      },
    },
  },
});
