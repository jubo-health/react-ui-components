import React from 'react';

import CheckboxBase, { CheckboxBaseProps } from '../base/CheckboxBase';

type CheckboxProps = CheckboxBaseProps<string[]> & {
  onChange?: (
    state: string[],
    event?: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

function Checkbox(props: CheckboxProps) {
  const { value = [], onChange, name = '', ...rest } = props;
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const index = value.findIndex(v => v === e.target.value);
      if (onChange)
        onChange(
          index > -1
            ? [...value.slice(0, index), ...value.slice(index + 1)]
            : [...value, e.target.value],
          e
        );
    },
    [onChange, value]
  );
  return (
    <CheckboxBase onChange={handleChange} value={value} name={name} {...rest} />
  );
}
Checkbox.Option = CheckboxBase.Option;
export default Checkbox;
