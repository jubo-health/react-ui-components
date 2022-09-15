import React from 'react';

function useControl<T>({
  defaultValue,
  value: propsValue,
  onChange: propsOnChange,
}: {
  defaultValue: T;
  value?: T;
  onChange?: (state: T, event?: React.FormEvent<HTMLInputElement>) => void;
}): [T, (state: T, event?: React.FormEvent<HTMLInputElement>) => void] {
  const { current: isControlled } = React.useRef(
    typeof propsValue !== 'undefined'
  );
  const [value, setValue] = React.useState<T>(defaultValue);

  const onChange = React.useCallback(
    (state, event) => {
      if (!isControlled) {
        setValue(state);
      }
      if (propsOnChange) {
        propsOnChange(state, event);
      }
    },
    [isControlled, propsOnChange]
  );
  return [isControlled ? (propsValue as T) : value, onChange];
}

export default useControl;
