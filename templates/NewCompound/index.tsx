import React from 'react';
import { twMerge } from 'tailwind-merge';

import { PropsOf, AsProps } from '../types';

const DEFAULT_BASE = 'div';

interface NewCompoundProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string;
  children: React.ReactNode;
}

const NewCompoundContext = React.createContext<{ name: string }>({ name: '' });

const NewCompound = (props: NewCompoundProps) => {
  const { className, children, name, ...rest } = props;
  const value = React.useMemo(() => ({ name }), []);
  return (
    <NewCompoundContext.Provider value={value}>
      <div className={twMerge('flex', className)} {...rest}>
        {children}
      </div>
    </NewCompoundContext.Provider>
  );
};

export type ChildComponentProps<BaseElement> = AsProps<BaseElement> &
  PropsOf<BaseElement>;

function ChildComponent<
  BaseElement extends React.ElementType = typeof DEFAULT_BASE
>(props: ChildComponentProps<BaseElement>) {
  const { as, ...rest } = props;
  const { name } = React.useContext(NewCompoundContext);

  return React.createElement(as || DEFAULT_BASE, { name, ...rest });
}

NewCompound.Input = ChildComponent;

export default Form;
