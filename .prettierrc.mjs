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
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
