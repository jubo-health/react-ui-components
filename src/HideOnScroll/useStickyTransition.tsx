import React from 'react';

interface UseStickyTransition {
  interpolateFn: (n: number) => string;
  transitionClass: string;
  styleKey: 'transform' | 'animationDelay';
}

const defaultInputs: UseStickyTransition = {
  interpolateFn: (ratio: number) => `translateY(${-ratio * 100}%)`,
  transitionClass: 'transition-transform',
  styleKey: 'transform',
};

const calcParams = (inputs: UseStickyTransition = defaultInputs) => ({
  ...inputs,
  hideStyle: inputs.interpolateFn(1),
  showStyle: inputs.interpolateFn(0),
  revealStyle: inputs.styleKey === 'transform' ? inputs.interpolateFn(0) : inputs.interpolateFn(1),
});

const useStickyTransition = (inputs?: UseStickyTransition) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const lastY = React.useRef(0);
  const anchor = React.useRef(0);
  const params = React.useRef(calcParams(inputs || defaultInputs));

  const onScroll = React.useCallback((e: React.UIEvent<HTMLElement>) => {
    if (ref.current) {
      const {
        interpolateFn, transitionClass, styleKey, hideStyle, showStyle, revealStyle,
      } = params.current;
      const completeHide = ref.current.style[styleKey] === hideStyle;
      const completeShow = !ref.current.style[styleKey]
        || ref.current.style[styleKey] === showStyle;
      const dy = e.currentTarget.scrollTop - lastY.current;
      const dh = e.currentTarget.scrollTop - anchor.current;

      if ((!completeHide && dy > 0) || dh < ref.current.offsetHeight) {
        const moveOutPropotion = dh / ref.current.offsetHeight;
        if (moveOutPropotion >= 1) {
          ref.current.style[styleKey] = interpolateFn(1);
          anchor.current = 0;
        } else {
          ref.current.style[styleKey] = interpolateFn(moveOutPropotion > 0 ? moveOutPropotion : 0);
        }
      }

      if (dy < 0) {
        if (completeShow) {
          anchor.current = e.currentTarget.scrollTop;
        } else if (completeHide && dy < -60) {
          ref.current.classList.add(transitionClass);
          ref.current.style[styleKey] = revealStyle;
        }
      } else if (
        e.currentTarget.scrollTop + e.currentTarget.clientHeight
        === e.currentTarget.scrollHeight
      ) {
        anchor.current = e.currentTarget.scrollTop;
        ref.current.classList.add(transitionClass);
        ref.current.style[styleKey] = revealStyle;
      }
      lastY.current = e.currentTarget.scrollTop;
    }
  }, []);

  const onTransitionEnd = React.useCallback(() => {
    const { transitionClass } = params.current;
    if (ref.current) ref.current.classList.remove(transitionClass);
  }, []);

  const onAnimationEnd = React.useCallback(() => {
    const { transitionClass } = params.current;
    if (ref.current?.classList.contains(transitionClass) && ref.current) {
      ref.current.style.animation = 'none';
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ref.current.offsetHeight; // trigger reflow
      ref.current.style.animation = '';
      ref.current.style.animationDelay = '-1s';
      ref.current.classList.remove(transitionClass);
    }
  }, []);

  return {
    onScroll,
    onAnimationEnd,
    onTransitionEnd,
    ref,
  };
};

export default useStickyTransition;
