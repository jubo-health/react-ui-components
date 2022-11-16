import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'size'> {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
   */
  size?: 'sm' | 'lg';
}

const defaultProps = { size: 'lg' } as ButtonProps;

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & typeof defaultProps
>((props, ref) => {
  const { size, className, ...rest } = props;
  return (
    <button
      className={twMerge(
        'rounded hover:bg-grey-200 text-grey-700 p-1',
        className
      )}
      type='button'
      ref={ref}
      {...rest}
    />
  );
});
Button.defaultProps = defaultProps;

export default Button;
