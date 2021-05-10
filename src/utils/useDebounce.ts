import { useEffect, useRef } from 'react';

export const useDebouncedCallback = <T extends unknown[]>(
  callback: (...args: T) => void,
  wait: number
) => {
  const argsRef = useRef<T>();
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  function cleanup() {
    if(timeout.current) {
      clearTimeout(timeout.current);
    }
  }

  useEffect(() => cleanup, []);

  return function debouncedCallback(
    ...args: T
  ) {
    argsRef.current = args;

    cleanup();

    timeout.current = setTimeout(() => {
      if(argsRef.current) {
        callback(...argsRef.current);
      }
    }, wait);
  };
};