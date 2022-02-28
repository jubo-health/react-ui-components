import React from 'react';
import clsx from 'clsx';

export interface HideOnScrollProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode;
  className?: string;
}

// const HideOnScroll = React.forwardRef<HTMLDivElement, HideOnScrollProps>(

// );

// HideOnScroll.defaultProps = {};

export const useHideOnScroll = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const lastY = React.useRef(0);
  const anchor = React.useRef(0);
  const [showAnimation, setShowAnimation] = React.useState(false);

  const onScroll = React.useCallback((e: React.UIEvent<HTMLElement>) => {
    if (ref.current) {
      const fullHide = ref.current.style.animationDelay === '0s';
      const fullShow = !ref.current.style.animationDelay || ref.current.style.animationDelay === '-1s';
      const dy = e.currentTarget.scrollTop - lastY.current;
      const dh = e.currentTarget.scrollTop - anchor.current;

      if ((!fullHide && dy > 0) || dh < ref.current.offsetHeight) {
        const moveOutPropotion = dh / ref.current.offsetHeight;
        if (moveOutPropotion < 1) {
          ref.current.style.animationDelay = `${moveOutPropotion <= 0 ? -1 : moveOutPropotion - 1}s`;
        } else {
          ref.current.style.animationDelay = '0s';
          anchor.current = 0;
        }
      }
      if (dy < 0) {
        if (fullShow) {
          anchor.current = e.currentTarget.scrollTop;
        } else if (fullHide && dy < -70) {
          setShowAnimation(true);
          ref.current.style.animationDelay = '0s';
        }
      } else if (
        fullHide
        && e.currentTarget.scrollTop + e.currentTarget.clientHeight
        === e.currentTarget.scrollHeight
      ) {
        setShowAnimation(true);
        ref.current.style.animationDelay = '0s';
      }
      lastY.current = e.currentTarget.scrollTop;
    }
  }, []);

  const onAnimationEnd = React.useCallback(() => {
    if (showAnimation && ref.current) {
      ref.current.style.animation = 'none';
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ref.current.offsetHeight; // trigger reflow
      ref.current.style.animation = '';
      ref.current.style.animationDelay = '-1s';
      setShowAnimation(false);
    }
  }, [showAnimation]);

  return {
    onScroll,
    HideOnScroll: (props: HideOnScrollProps) => {
      const { children, className, ...rest } = props;
      return (
        <div
          ref={ref}
          className={clsx(
            'animate-[1s_linear_-1s_1_reverse_forwards_paused_scroll-out]',
            'sticky top-0',
            showAnimation && 'animate-[75ms_ease-in-out_0s_1_reverse_forwards_running_scroll-out]',
            className,
          )}
          onAnimationEnd={onAnimationEnd}
          {...rest}
        >
          {children}
        </div>
      );
    },
  };
};

// export default HideOnScroll;
