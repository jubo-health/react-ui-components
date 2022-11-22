import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface LabelProps {
  className?: string;
  /**
   * 灰色小字備註
   */
  note?: React.ReactNode;
  children: React.ReactNode;
}

const Label = (props: LabelProps) => {
  const { className, children, note } = props;
  return (
    <div className={twMerge('Label-wrapper', className)}>
      <div className='Label whitespace-prewrap break-words mr-4 text-lg leading-6 pt-2 pb-1 capitalize'>
        {children}
      </div>
      <div className='Label-note text-xs text-grey-500'>{note}</div>
    </div>
  );
};

export default Label;
