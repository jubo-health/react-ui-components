import React from 'react';
import clsx from 'clsx';

export interface HideOnScrollProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode;
  className?: string;
}

const HideOnScroll = React.forwardRef<HTMLDivElement, HideOnScrollProps>(
  (props: HideOnScrollProps, ref) => {
    const { children, className, ...rest } = props;
    return (
      <div ref={ref} className={clsx('bg-gray-400', className)} {...rest}>
        {children}
      </div>
    );
  }
);

HideOnScroll.defaultProps = {};

export default HideOnScroll;
