import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface LabelProps {
  className?: string;
  note?: React.ReactNode;
  children: React.ReactNode;
}

const Label = ({ className, children, note }: LabelProps) => (
  <div className={twMerge('Label-wrapper', className)}>
    <div className='Label whitespace-prewrap break-words mr-4 text-lg leading-6 pt-2 pb-1 capitalize'>
      {children}
    </div>
    <div className='Label-note text-xs text-grey-500'>{note}</div>
  </div>
);

export default Label;
