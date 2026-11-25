export { createFilterOptions } from '@mui/material/Autocomplete';

const noop = () => null;
const proxy = new Proxy(noop, {
  get(_, prop) {
    if (prop === '__esModule') return true;
    return proxy;
  },
  apply: () => null,
});

export default proxy;

export const createTheme = () => ({});
export const styled = () => () => null;
export const useTheme = () => ({});
export const alpha = () => '';
export const keyframes = () => '';
