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

  const onScroll = React.useCallback((e: React.UIEvent<HTMLElement>) => {
    if (ref.current) {
      const fullHide = ref.current.style.transform === 'translateY(-100%)';
      const fullShow = !ref.current.style.transform || ref.current.style.transform === 'translateY(0%)';
      const dy = e.currentTarget.scrollTop - lastY.current;
      const dh = e.currentTarget.scrollTop - anchor.current;

      if ((!fullHide && dy > 0) || dh < ref.current.offsetHeight) {
        const moveOutPropotion = dh / ref.current.offsetHeight;
        if (moveOutPropotion < 1) {
          ref.current.style.transform = `translateY(${moveOutPropotion <= 0 ? 0 : -moveOutPropotion * 100}%)`;
        } else {
          ref.current.style.transform = 'translateY(-100%)';
          anchor.current = 0;
        }
      }
      if (dy < 0) {
        if (fullShow) {
          anchor.current = e.currentTarget.scrollTop;
        } else if (fullHide && dy < -70) {
          ref.current.classList.add('transition-transform');
          ref.current.style.transform = 'translateY(0%)';
        }
      } else if (
        fullHide
        && e.currentTarget.scrollTop + e.currentTarget.clientHeight
        === e.currentTarget.scrollHeight
      ) {
        ref.current.classList.add('transition-transform');
        ref.current.style.transform = 'translateY(0%)';
      }
      lastY.current = e.currentTarget.scrollTop;
    }
  }, []);

  const onAnimationEnd = React.useCallback(() => {
    if (ref.current) ref.current.classList.remove('transition-transform');
  }, []);

  return {
    onScroll,
    HideOnScroll: (props: HideOnScrollProps) => {
      const { children, className, ...rest } = props;
      return (
        <div
          ref={ref}
          className={clsx(
            'sticky top-0',
            className,
          )}
          onTransitionEnd={onAnimationEnd}
          {...rest}
        >
          {children}
        </div>
      );
    },
  };
};

// export default HideOnScroll;
