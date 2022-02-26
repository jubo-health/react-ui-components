import React from 'react';
import clsx from 'clsx';

export type HideOnScrollProps = {
  children?: React.ReactNode;
  className?: string;
};

const HideOnScroll = React.forwardRef<HTMLDivElement, HideOnScrollProps>(
  (props: HideOnScrollProps, ref) => {
    const { children, className } = props;
    return (
      <div ref={ref} className={clsx('bg-gray-400', className)}>
        {children}
      </div>
    );
  }
);

HideOnScroll.defaultProps = {};

export default HideOnScroll;
