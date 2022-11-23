import React from 'react';
import { twMerge } from 'tailwind-merge';
import uniqueId from 'lodash/uniqueId';

import FormButton from '../FormButton';
import { PropsOf, AsProps, MutuallyExclude } from '../types';

interface MutualStates {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string | null;
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
  const { onChange, value, name } = React.useContext(Context);
  return React.createElement(as || DEFAULT_BASE, {
    // origin type with checkbox to ensure 'unselect' would be triggered
    type: 'checkbox',
    onChange,
    checked: value === propsValue,
    color: value && value !== propsValue ? 'secondary' : 'primary',
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

interface RadioProps {
  options: Option[];
  children: React.ReactNode;
  onChange: (
    state: string | null,
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLInputElement>
  ) => void;
  value: string | null;
  name?: string;
  className?: string;
}
const defaultProps = {
  name: uniqueId('radio-'),
} as RadioProps;
function Radio(
  props: MutuallyExclude<
    RadioProps & typeof defaultProps,
    'options' | 'children'
  >
) {
  const { options, value, onChange, children, name = '', className } = props;
  const context = React.useMemo(
    () => ({
      name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.currentTarget.value;
        onChange(v === value ? null : v, e);
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
