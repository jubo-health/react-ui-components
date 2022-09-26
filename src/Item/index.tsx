import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
   */
  size?: 'sm' | 'lg';
  checked?: boolean;
  hovering?: boolean;
}

const defaultProps = { size: 'lg' } as ItemProps;

const Item = React.forwardRef<HTMLDivElement, ItemProps & typeof defaultProps>(
  (props, ref) => {
    const { size, className, checked, hovering, ...rest } = props;
    return (
      <div
        role='menuitem'
        tabIndex={0}
        className={twMerge(
          'select-none relative flex py-2 px-4 leading-[1.375rem] active:bg-grey-300 min-w-fit',
          hovering && 'bg-grey-100',
          checked && 'bg-grey-200 hover:bg-grey-300',
          className
        )}
        ref={ref}
        onMouseDown={e => {
          e.preventDefault();
        }}
        {...rest}
      />
    );
  }
);
Item.defaultProps = defaultProps;

export default Item;
