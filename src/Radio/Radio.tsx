import React from 'react';
import { twMerge } from 'tailwind-merge';
import uniqueId from 'lodash/uniqueId';

import FormButton from '../FormButton';
import { PropsOf, AsProps, MutuallyExclude } from '../types';

interface MutualStates<T = string> {
  onChange?: (
    state: T | null,
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLInputElement>
  ) => void;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  value?: T | null;
  name?: string;
}

const Context = React.createContext<MutualStates>({});

export type FieldInputProps<BaseElement> = AsProps<BaseElement> &
  Omit<PropsOf<BaseElement>, 'type' | 'onChange' | 'name'>;

const DEFAULT_BASE = FormButton;
function RadioOption<
  BaseElement extends React.ElementType = typeof DEFAULT_BASE
>(props: FieldInputProps<BaseElement>) {
  const { as, value: propsValue, ...rest } = props;
  const { onChange, onClick, value, name } = React.useContext(Context);
  const handleChange = React.useCallback(
    e => {
      if (onChange) onChange(e.target.value, e);
    },
    [onChange]
  );
  return React.createElement(as || DEFAULT_BASE, {
    type: 'radio',
    onChange: handleChange,
    onClick,
    checked: value === propsValue,
    value: propsValue,
    name,
    ...rest,
  });
}

interface Option {
  value: string;
  label: string;
  sublabel?: string;
}

interface RadioProps<T = string> {
  options: Option[];
  children: React.ReactNode;
  onChange: (
    state: T | null,
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLInputElement>
  ) => void;
  value: T | null;
  name?: string;
  className?: string;
}
const defaultProps = {
  name: uniqueId('radio-'),
} as RadioProps;
function Radio<T>(
  props: MutuallyExclude<
    RadioProps<T> & typeof defaultProps,
    'options' | 'children'
  >
) {
  const { options, value, onChange, children, name = '', className } = props;
  const context = React.useMemo(
    () => ({
      name,
      onChange,
      onClick: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const v = e.currentTarget.value;
        if (v === value) onChange(null, e);
      },
      value,
    }),
    [name, onChange, value]
  );
  return (
    <Context.Provider value={context}>
      <div className={twMerge('grid grid-cols-2 gap-2', className)}>
        {children ||
          options?.map(opt => (
            <RadioOption value={opt.value} key={opt.value}>
              {opt.label}
            </RadioOption>
          ))}
      </div>
    </Context.Provider>
  );
}
Radio.Option = RadioOption;
export default Radio;
