import React from 'react';
import clsx from 'clsx';

import InputHolder, { InputHolderProps } from '../InputHolder';

export interface InputProps extends InputHolderProps {
  /**
   * 文字與間距大小，通常表單內使用lg，表單外使用sm
   * (需注意此屬性與原生的重複，原生的size更名為widthInCharLength)
   */
  size?: 'sm' | 'lg';
  /**
   * 無內容時底部的文字
   */
  placeholder?: string;
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
  /**
   * input原生的屬性: size，以字元長度定義的寬度，但現版面多直接給定 rem-base or pixel-base 的寬度所以也不大建議使用
   */
  widthInCharLength?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { size, status, widthInCharLength, ...rest } = props;
  return (
    <InputHolder status={status} size={size}>
      <input
        ref={ref}
        className={clsx('outline-none bg-transparent')}
        tabIndex={0}
        size={widthInCharLength}
        {...rest}
      />
    </InputHolder>
  );
});

type DefaultProps = {
  size: 'lg';
  status: 'default';
};
Input.defaultProps = { size: 'lg', status: 'default' } as DefaultProps;

export default Input;
