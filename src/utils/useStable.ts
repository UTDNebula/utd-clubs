/**
 * @see https://medium.com/@gfox1984/implementing-the-usestable-value-hook-with-react-query-045999cf5c38
 */

import { replaceEqualDeep } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

/**
 * Stabilizes a variable (i.e. ensures a variable's reference doesn't change if
 * an object's or array's values are deeply equivalent). Useful for memoizing
 * non-stable objects, arrays, or other non-primitive types.
 */
export function useStable<T>(value: T) {
  const ref = useRef(value);
  // Thanks for the tip ESLint, but we're actually trying to avoid re-renders here
  // eslint-disable-next-line react-hooks/refs
  const stable = replaceEqualDeep(ref.current, value);
  useEffect(() => {
    ref.current = stable;
  }, [stable]);
  return stable;
}
