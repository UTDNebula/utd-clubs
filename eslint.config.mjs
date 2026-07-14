import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/nebula-library/**',
  ]),
  // Allow HTML <img> elements in Next.JS generated image metadata files
  {
    files: ['src/**/{opengraph,twitter}-image.{js,jsx,ts,tsx}'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  // Enforce shorter path alias '@nebula-library/*' instead of '@src/nebula-library/*'
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@src/nebula-library', '@src/nebula-library/*'],
              message:
                "Please use the shorter path alias '@nebula-library/*' instead of '@src/nebula-library/*'.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
