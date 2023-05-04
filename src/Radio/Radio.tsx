import React from 'react';

import CheckboxBase, { CheckboxBaseProps } from '../base/CheckboxBase';

type RadioProps = CheckboxBaseProps<string> & {
  onChange?: (
    state: string | null,
    event?: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

function Radio(props: RadioProps) {
  const { value, onChange, name = '', ...rest } = props;
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.currentTarget.value;
      if (onChange) onChange(v === value ? null : v, e);
    },
    [onChange, value]
  );
  return (
    <CheckboxBase onChange={handleChange} value={value} name={name} {...rest} />
  );
}
Radio.Option = CheckboxBase.Option;
export default Radio;
