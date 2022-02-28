import React from 'react';
import clsx from 'clsx';

export type BarProps = {
  color?: 'light' | 'dark';
  size?: 'm' | 'l';
  children?: React.ReactNode;
  className?: string;
};

const Bar = (props: BarProps) => {
  const {
    color, size, children, className, ...rest
  } = props;
  return (
    <div
      className={clsx(
        'p-2 bg-gray-500 text-white flex items-center h-10 max-h-10 sticky left-0',
        size === 'm' && 'px-1 py-2 h-8',
        color === 'light' && 'bg-gray-200 text-gray-700',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

Bar.defaultProps = {
  color: 'dark',
  size: 'l',
};

export default Bar;
