import path from 'path';
import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';

dotenv.config();

if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  console.log('✅ Using TEST_DATABASE_URL environment variable for tests');
} else {
  console.log('⚠️ Using DATABASE_URL environment variable for tests');
}

function fromHere(...paths: string[]) {
  return path.resolve(import.meta.dirname, ...paths);
}

export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: fromHere('./src') },
      { find: '@public', replacement: fromHere('./public') },
      { find: '@tests', replacement: fromHere('./tests') },
      {
        find: '@nebula-library',
        replacement: fromHere('./src/nebula-library'),
      },
      {
        find: /^@mui\/(?!material\/Autocomplete).*/,
        replacement: fromHere('./tests/helpers/mui-stub.ts'),
      },
    ],
  },
  test: {
    globals: true,
    setupFiles: ['./tests/helpers/db.ts', './tests/helpers/next.ts'],
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
