import { DependencyList, useEffect, useRef } from "react";
interface UsePollingProps {
  callback: () => void;
  delay: number;
  dependencies?: DependencyList;
}

const usePolling = ({ callback, delay }: UsePollingProps): void => {
  const savedCallback = useRef<() => void>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current!();
    };
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return undefined;
  }, [delay]);
};

export default usePolling;
