import React from 'react';
import { twMerge } from 'tailwind-merge';
import uniqueId from 'lodash/uniqueId';

import FormButton from '../FormButton';
import { PropsOf, AsProps, MutuallyExclude } from '../types';

interface MutualStates {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string[] | string;
  name?: string;
}

const Context = React.createContext<MutualStates>({});

export type FieldInputProps<BaseElement> = AsProps<BaseElement> &
  Omit<PropsOf<BaseElement>, 'type' | 'onChange' | 'name'>;

const DEFAULT_BASE = FormButton;
function CheckboxBaseOption<
  BaseElement extends React.ElementType = typeof DEFAULT_BASE
>(props: FieldInputProps<BaseElement>) {
  const { as, value: propsValue, ...rest } = props;
  const { onChange, value, name } = React.useContext(Context);
  return React.createElement(as || DEFAULT_BASE, {
    onChange,
    checked: Array.isArray(value)
      ? value.includes(propsValue)
      : value === propsValue,
    color:
      !Array.isArray(value) && value && value !== propsValue
        ? 'secondary'
        : 'primary',
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

export interface CoreCheckboxBaseProps<T extends string | string[]> {
  options: Option[];
  children: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: T;
  name?: string;
  className?: string;
}
const defaultProps = {
  name: uniqueId('checkbox-'),
};
export type CheckboxBaseProps<T extends string | string[]> = MutuallyExclude<
  CoreCheckboxBaseProps<T> & typeof defaultProps,
  'options' | 'children'
>;
function CheckboxBase<T extends string | string[]>(
  props: CheckboxBaseProps<T>
) {
  const { options, value, onChange, children, name = '', className } = props;
  const context = React.useMemo(
    () => ({
      name,
      onChange,
      value,
    }),
    [name, onChange, value]
  );
  return (
    <Context.Provider value={context}>
      <div className={twMerge('grid grid-cols-2 gap-2 mb-2', className)}>
        {children ||
          options?.map(opt => (
            <CheckboxBaseOption value={opt.value} key={opt.value}>
              {opt.label}
            </CheckboxBaseOption>
          ))}
      </div>
    </Context.Provider>
  );
}
CheckboxBase.Option = CheckboxBaseOption;
export default CheckboxBase;
