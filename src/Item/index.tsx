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

const Item = React.forwardRef<
  HTMLDivElement,
  PopoverProps & typeof defaultProps
>((props, ref) => {
  const { size, className, ...rest } = props;
  return (
    <div
      className={twMerge('py-2 px-4 leading-[1.375rem]', className)}
      ref={ref}
      {...rest}
    />
  );
});
Item.defaultProps = defaultProps;

export default Item;
