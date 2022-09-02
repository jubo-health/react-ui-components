import React from 'react';
import { twMerge } from 'tailwind-merge';

import FormButton from '../FormButton';
import { PropsOf, AsProps, MutuallyExclude } from '../types';

interface MutualStates {
  ref?: React.ForwardedRef<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Context = React.createContext<MutualStates>({});

export type FieldInputProps<BaseElement> = AsProps<BaseElement> &
  PropsOf<BaseElement>;

const DEFAULT_BASE = FormButton;
function RadioOption<
  BaseElement extends React.ElementType = typeof DEFAULT_BASE
>(props: FieldInputProps<BaseElement>) {
  const { as, ...rest } = props;
  return React.createElement(as || DEFAULT_BASE, { type: 'radio', ...rest });
}

interface Option {
  value: string;
  label: string;
  sublabel?: string;
}

interface RadioGroupProps {
  options: Option[];
  children: React.ReactNode;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
}

const RadioGroup = Object.assign(
  React.forwardRef<
    HTMLInputElement,
    MutuallyExclude<RadioGroupProps, 'options' | 'children'>
  >((props, ref) => {
    const { options, onChange, children, name, ...rest } = props;
    const { current: value } = React.useRef({
      ref,
      onChange,
    });

    return (
      <Context.Provider value={value}>
        <div>
          {children ||
            options?.map(opt => (
              <FormButton
                ref={ref}
                onChange={onChange}
                type='radio'
                name={name}
                value={opt.value}
                {...rest}
              >
                {opt.label}
              </FormButton>
            ))}
        </div>
      </Context.Provider>
    );
  }),
  {
    Option: RadioOption,
  }
);

export default RadioGroup;
