import React from 'react';

import { PropsOf, AsProps } from '../types';

interface MutualStates {}

const Context = React.createContext<MutualStates>({});

export type FieldInputProps<BaseElement> = AsProps<BaseElement> &
  PropsOf<BaseElement>;

const DEFAULT_BASE = 'div';
function ComponentWithAs<
  BaseElement extends React.ElementType = typeof DEFAULT_BASE
>(props: FieldInputProps<BaseElement>) {
  const { as, ...rest } = props;
  return React.createElement(as || DEFAULT_BASE, rest);
}
