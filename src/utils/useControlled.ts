import React from 'react';

interface UseControlled<T> {
  state?: T;
  default: T;
}

export default function useControlled<T>({
  default: defaultState,
  state: outerState,
}: UseControlled<T>): [T, (v: React.SetStateAction<T>) => void] {
  const { current: isControlled } = React.useRef(outerState !== undefined);
  const [state, setState] = React.useState<T>(defaultState);
  const resultSetState = React.useCallback(
    (v: React.SetStateAction<T>) => {
      if (!isControlled) {
        setState(v);
      }
    },
    [isControlled]
  );
  return [(isControlled ? outerState : state) as T, resultSetState];
}
