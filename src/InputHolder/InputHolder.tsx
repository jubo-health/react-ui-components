import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputHolderProps
  extends Omit<React.ComponentProps<'div'>, 'ref'> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
   */
  size?: 'sm' | 'lg';
  /**
   * 前（左）方裝飾物
   */
  startAdornment?: React.ReactNode;
  /**
   * 後（右）方裝飾物
   */
  endAdornment?: React.ReactNode;
  /**
   * 輸入狀態，僅影響底線顏色
   */
  status?: 'default' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}

const InputHolder = React.forwardRef<HTMLDivElement, InputHolderProps>(
  (props, ref) => {
    const {
      size,
      status,
      children,
      startAdornment,
      endAdornment,
      className,
      ...rest
    } = props;
    return (
      <div
        className={twMerge(
          'inline-flex relative after:border-b after:border-b-grey-400 after:absolute after:bottom-0 after:inset-x-0',
          // 'bg-grey-100',
          'hover:after:border-b-2',
          'focus-within:after:border-b-2',
          status === 'warning' && 'focus-within:after:border-b-warning',
          status === 'error'
            ? 'after:border-b-error after:border-b-2'
            : 'hover:after:border-b-grey-900',
          status === 'default' && 'focus-within:after:border-b-primary',
          size === 'lg'
            ? 'text-lg h-10 mb-2 py-2 leading-6'
            : 'h-8 mb-1 py-1 leading-[1.375rem]',
          className
        )}
        ref={ref}
        {...rest}
      >
        {startAdornment}
        {children}
        {endAdornment}
      </div>
    );
  }
);

type DefaultProps = {
  size: 'lg';
  status: 'default';
};
InputHolder.defaultProps = { size: 'lg', status: 'default' } as DefaultProps;

export default InputHolder;
