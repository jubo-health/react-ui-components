import React from 'react';
import clsx from 'clsx';

import { useStickyTransition } from './hooks';

interface StickyTransition {
  onScroll: (e: React.UIEvent<HTMLElement, UIEvent>) => void;
  onTransitionEnd: () => void;
  ref: React.RefObject<HTMLDivElement>;
}
const TransitionContext = React.createContext<StickyTransition>({
  onScroll: (e: any) => {},
  onTransitionEnd: () => { },
  ref: { current: null },
});

interface TransitionScollerType extends React.ComponentProps<'div'> {
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}
const TransitionScoller = (props: TransitionScollerType) => {
  const { className, onScroll, ...rest } = props;
  const value = useStickyTransition();

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    value.onScroll(e);
    if (onScroll) onScroll(e);
  }, [onScroll, value]);

  return (
    <TransitionContext.Provider value={value}>
      <div className={clsx('relative overflow-auto', className)} onScroll={handleScroll} {...rest} />
    </TransitionContext.Provider>
  );
};

interface TransitionType extends React.ComponentProps<'div'> {
  onTransitionEnd?: () => void;
}
const Transition = (props: TransitionType) => {
  const { className, onTransitionEnd, ...rest } = props;
  const context = React.useContext(TransitionContext);
  const handleTransitionEnd = React.useCallback(() => {
    context.onTransitionEnd();
    onTransitionEnd?.();
  }, [context, onTransitionEnd]);
  return (
    <div
      ref={context.ref}
      className={clsx('sticky top-0 bg-white', className)}
      onTransitionEnd={handleTransitionEnd}
      {...rest}
    />
  );
};

TransitionScoller.Transition = Transition;
export default TransitionScoller;
