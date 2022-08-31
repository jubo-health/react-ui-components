import React from 'react';
import { twMerge } from 'tailwind-merge';

interface StatusCaptionProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'default' | 'warning' | 'error';
}
const StatusCaption = ({
  status,
  children,
  className,
  ...rest
}: StatusCaptionProps) => (
  <div
    className={twMerge(
      'text-xs leading-[.875rem] text-grey-500',
      status === 'warning' && 'text-warning',
      status === 'error' && 'text-error',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export default StatusCaption;
