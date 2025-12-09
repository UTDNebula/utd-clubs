/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 80,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  bracketSameLine: false,
  endOfLine: 'auto',
  plugins: [
    'prettier-plugin-tailwindcss',
    '@ianvs/prettier-plugin-sort-imports',
  ],
  importOrder: [
    '<BUILTIN_MODULES>', // Node.js built-in modules
    '<THIRD_PARTY_MODULES>', // Imports not matched by other special words or groups.
    '^(@src)(/.*)$',
    '^[.]', // relative imports
  ],
};

export default config;
