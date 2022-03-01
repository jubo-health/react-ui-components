import React from 'react';

interface UseStickyScroll {
  interpolateFn: (n: number) => string;
  transitionClass: string;
  styleKey: 'transform' | 'animationDelay';
  hideStyle: string;
  showStyle: string;
  revealStyle: string;
}

const useStickyScroll = (inputs: UseStickyScroll) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const lastY = React.useRef(0);
  const anchor = React.useRef(0);

  const onScroll = React.useCallback((e: React.UIEvent<HTMLElement>) => {
    if (ref.current) {
      const {
        interpolateFn, transitionClass, styleKey, hideStyle, showStyle, revealStyle,
      } = inputs;
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
        >= e.currentTarget.scrollHeight
      ) {
        anchor.current = e.currentTarget.scrollTop;
        ref.current.classList.add(transitionClass);
        ref.current.style[styleKey] = revealStyle;
      }
      lastY.current = e.currentTarget.scrollTop;
    }
  }, [inputs]);

  return {
    onScroll,
    ref,
  };
};

interface UseStickyTransition {
  interpolateFn?: (n: number) => string;
  transitionClass?: string;
}
const calcTransitionParams = (inputs: UseStickyTransition = {}): UseStickyScroll => {
  const interpolateFn = inputs.interpolateFn || ((ratio: number) => `translateY(${-ratio * 100}%)`);
  return {
    interpolateFn,
    transitionClass: inputs.transitionClass || 'transition-transform',
    hideStyle: interpolateFn(1),
    showStyle: interpolateFn(0),
    revealStyle: interpolateFn(0),
    styleKey: 'transform',
  };
};
export const useStickyTransition = (inputs?: UseStickyTransition) => {
  const params = React.useRef(calcTransitionParams(inputs));
  const { ref, onScroll } = useStickyScroll(params.current);

  const onTransitionEnd = React.useCallback(() => {
    if (ref.current) ref.current.classList.remove(params.current.transitionClass);
  }, [ref]);

  return React.useMemo(() => ({
    onScroll,
    onTransitionEnd,
    ref,
  }), [onScroll, onTransitionEnd, ref]);
};

interface UseStickyAnimation {
  interpolateFn?: (n: number) => string;
  transitionClass?: string;
}
const calcAnimationParams = (inputs: UseStickyAnimation = {}): UseStickyScroll => {
  const interpolateFn = inputs.interpolateFn || ((ratio: number) => `${ratio - 1}s`);
  return {
    interpolateFn,
    transitionClass: inputs.transitionClass || 'animate-[750ms_ease-in-out_0s_1_reverse_forwards_running_scroll-out]',
    hideStyle: interpolateFn(1),
    showStyle: interpolateFn(0),
    revealStyle: interpolateFn(1),
    styleKey: 'animationDelay',
  };
};
/**
 * animation version WIP
 * @param inputs
 * @returns
 */
export const useStickyAnimation = (inputs?: UseStickyAnimation) => {
  const params = React.useRef(calcAnimationParams(inputs));
  const { ref, onScroll } = useStickyScroll(params.current);

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
  }, [ref]);

  return React.useMemo(() => ({
    onScroll,
    onAnimationEnd,
    ref,
  }), [onAnimationEnd, onScroll, ref]);
};
