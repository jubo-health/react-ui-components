import React from 'react';
import { twMerge } from 'tailwind-merge';
import uniqueId from 'lodash/uniqueId';

import FormButton from '../FormButton';
import { PropsOf, AsProps, MutuallyExclude } from '../types';

interface MutualStates {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value: string[];
  name?: string;
}

const Context = React.createContext<MutualStates>({ value: [] });

export type FieldInputProps<BaseElement> = AsProps<BaseElement> &
  Omit<PropsOf<BaseElement>, 'type' | 'onChange' | 'name'>;

const DEFAULT_BASE = FormButton;
function CheckboxOption<
  BaseElement extends React.ElementType = typeof DEFAULT_BASE
>(props: FieldInputProps<BaseElement>) {
  const { as, value: propsValue, ...rest } = props;
  const { onChange, value, name } = React.useContext(Context);
  return React.createElement(as || DEFAULT_BASE, {
    onChange,
    checked: value.includes(propsValue),
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

interface CheckboxProps {
  options: Option[];
  children: React.ReactNode;
  onChange: (
    state: string[],
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLInputElement>
  ) => void;
  value: string[];
  name?: string;
  className?: string;
}
const defaultProps = {
  name: uniqueId('radio-'),
} as CheckboxProps;
function Checkbox(
  props: MutuallyExclude<
    CheckboxProps & typeof defaultProps,
    'options' | 'children'
  >
) {
  const { options, value, onChange, children, name = '', className } = props;
  const context = React.useMemo(
    () => ({
      name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const index = value.findIndex(v => v === e.target.value);
        onChange(
          index > -1
            ? [...value.slice(0, index), ...value.slice(index + 1)]
            : [...value, e.target.value],
          e
        );
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
            <CheckboxOption value={opt.value} key={opt.value}>
              {opt.label}
            </CheckboxOption>
          ))}
      </div>
    </Context.Provider>
  );
}
Checkbox.Option = CheckboxOption;
export default Checkbox;
