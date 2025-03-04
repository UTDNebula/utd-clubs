import { useEffect, useState } from 'react';

export default function useDebounce<T>(value: T, debounceTime: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceTime);
    return () => {
      clearTimeout(handler);
    };
  }, [value, debounceTime]);
  return debouncedValue;
}
