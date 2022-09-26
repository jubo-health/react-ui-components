import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface PopoverProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
   */
  size?: 'sm' | 'lg';
}

const defaultProps = { size: 'lg' } as PopoverProps;

const Popover = React.forwardRef<
  HTMLDivElement,
  PopoverProps & typeof defaultProps
>((props, ref) => {
  const { size, className, ...rest } = props;
  return (
    <div
      className={twMerge(
        'rounded-sm py-2 absolute bg-white z-50',
        'shadow-[0_4px_5px_rgba(0,0,0,0.14),0_1px_10px_rgba(0,0,0,0.12),0_2px_4px_-1px_rgba(0,0,0,0.2)]',
        'overflow-x-auto',
        className
      )}
      ref={ref}
      {...rest}
    />
  );
});
Popover.defaultProps = defaultProps;

export default Popover;
